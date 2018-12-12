# Microservice

This section of the docs covers the details of a microservice.

## Microservice overview

As described in the [API Architecture](#api-architecture) section, microservices are small web applications that expose a REST API through a web server. This means that microservices can be built using any programming language, just as long as it supports HTTP communication. In practical terms, most of this API's core microservices are built using [nodejs](https://nodejs.org), with [python](https://www.python.org/) and [Rails](https://rubyonrails.org/) being distant 2nd and 3rd respectively. This is due to personal preference of the team behind the API, as there really isn't a technical reason or limitation preventing the creation of microservices in PHP, Go, Elixir, etc.

<aside class="notice">
In this whole section, we will use code examples from the dataset microservice, which is built using nodejs. We will discuss the general principles, which should apply to all implementations, as well as implementation details, which may apply to your scenario if you are also using nodejs, or that may not apply if you are using something else.
</aside>


### Control Tower integration

While they could technically work as standalone applications, microservices are built from the ground up to work through Control Tower. As such, not only do they lack built-in functionality provided by Control Tower itself (for example, user management), they also need to handle their own integration with Control Tower. Control Tower provides integration libraries for certain languages and frameworks, which you can use to ease development:
- [nodejs package for Koa](https://github.com/control-tower/ct-register-microservice-node)
- [Python module for Flask](https://github.com/control-tower/ct-register-microservice-python-flask)
- [Rails engine](https://github.com/control-tower/ct-register-microservice-rails)

These libraries provide 2 basic features that we'll cover in detail in this chapter. You can also use it for reference in case you want to implement a microservice in a different programming language or framework. 

We'll use the nodejs library as reference and example in the following sections, as it's the most commoly used language in this API. Other libraries will provided the same underlying functionality, but may have different ways to operate. Refer to each library's specific documentation for more details.

#### Registering on Control Tower

The first feature provided by these libraries, and that a microservice must perform, is registering on Control Tower. Most of the details of this process can be found on [Control Tower's documentation](#microservice-registration-process), which you should read at this point if you haven't already.

```javascript
// dataset microservice registration example

const ctRegisterMicroservice = require('ct-register-microservice-node');
const Koa = require('koa');
const logger = require('logger');

const app = new Koa();

const server = app.listen(process.env.PORT, () => {
    ctRegisterMicroservice.register({
        info: require('../microservice/register.json'),
        swagger: require('../microservice/public-swagger.json'),
        mode: (process.env.CT_REGISTER_MODE && process.env.CT_REGISTER_MODE === 'auto') ? ctRegisterMicroservice.MODE_AUTOREGISTER : ctRegisterMicroservice.MODE_NORMAL,
        framework: ctRegisterMicroservice.KOA2,
        app,
        logger,
        name: config.get('service.name'),
        ctUrl: process.env.CT_URL,
        url: process.env.LOCAL_URL,
        token: process.env.CT_TOKEN,
        active: true
    }).then(() => {
    }, (error) => {
        logger.error(error);
        process.exit(1);
    });
});
```

Covering the arguments in detail:

- info: path to the JSON file that will be sent to Control Tower, containing the details about the endpoints exposed by this microservice.
- swagger: path to the Swagger YAML file that will be sent to Control Tower, documenting the public endpoints exposed by this microservice.
- mode: if set to `ctRegisterMicroservice.MODE_AUTOREGISTER` the Control Tower registration process will be automaticall triggered when the Koa application server starts. Otherwise, use `ctRegisterMicroservice.MODE_NORMAL` if you want to register manually.
- framework: `ctRegisterMicroservice.KOA2` or `ctRegisterMicroservice.KOA1`, depending on the Koa version your app uses.
- app: Koa application instance
- logger: [Logger](https://github.com/quirkey/node-logger) instance.
- name: name of the microservice to be provided to Control Tower as part of the registration process.
- ctUrl: Control Tower URL.
- url: URL within the internal network through which this microservice can be accessed.
- token: Control Tower token to authenticate the registration requests
- active: If set to `false` the microservice will be registered as disabled (not accessible). You should set this to `true` in most cases.


This registration call usually takes place right after the microservice's start process has ended, and the corresponding web server is available. Keep in mind that the call above will trigger an HTTP request to Control Tower, which in turn will call the microservice's web server - so make sure the microservice's web server is up and running when you attempt to register it.


#### Requests to other microservices

Besides contacting Control Tower to register themselves, microservices also need to contact Control Tower to make requests to other micorservices. 

```javascript
// Microservice call to another microservice's endpoint
const ctRegisterMicroservice = require('ct-register-microservice-node');
const tags = ['tag1', 'tag2'];

ctRegisterMicroservice.requestToMicroservice({
    uri: `/graph/dataset/${id}/associate`,
    method: 'POST',
    json: true,
    body: {
        tags
    }
});
```

In this example, the dataset microservice makes a call to the `/graph/dataset/<id>/associate` endpoint to tag a dataset with the given tag list. This endpoint is implemented by the Graph microservice, but the request is actually handled by Control Tower. Taking a deeper look at the code that implements the call above, we learn a few things:

```javascript
// Implementation of call to another microservice

requestToMicroservice(config) {
    logger.info('Adding authentication header ');
    try {
        let version = '';
        if (process.env.API_VERSION) {
            version = `/${process.env.API_VERSION}`;
        }
        if (config.version === false) {
            version = '';
        }
        config.headers = Object.assign(config.headers || {}, { authentication: this.options.token });
        if (config.application) {
            config.headers.app_key = JSON.stringify({ application: config.application });
        }
        config.uri = this.options.ctUrl + version + config.uri;
        return requestPromise(config);
    } catch (err) {
        logger.error('Error to doing request', err);
        throw err;
    }

}
```

As explained above, although the call is ultimately to another microservice, the request is sent to Control Tower, who is then resposible for issuing another internal request to the destination microservice, getting the reply from that call and passing it on to the microservice that initiated the process.

Another thing you'll notice is that this call depends on preexisting configuration stored in the `this.options` property. These configuration options are stored within the object during the Control Tower registration process, meaning you should not attempt to make a call to another microservice unless you have previously registered your microservice on Control Tower. Keep in mind that this is a restriction of this particular integration library, and not of Control Tower itself - a different implementation could do internal requests to microservices through Control Tower without being registered as a microservice.


### Logging

An important part of microservice operation is logging events as it processes requests. Many errors are only triggered during staging and production server execution, and without proper logging, there isn't a way to identify how it can be reproduced, so it can then be fixed.

Common development languages often come with either built-in or 3rd party logging libraries than make logging easier to handle. Current nodejs microservices use [Bunyan](https://github.com/trentm/node-bunyan) to manage logs, which eases managing log destinations (stdout, file, etc) and log levels. Other libraries, for nodejs and other languages, offer similar functionality.

For microservice logs, the main output channel should be `stdout`, so it can seamlessly integrate with the infrastructure to which microservices will be deployed when going live - more on this later. If you prefer, you can also log to file or other output channels for development purposes - it's in this sort of scenarios that logging libraries become useful, as they decouple the logging action from the destination channels.


```javascript 
const logger = require('logger');

logger.info('Validating Dataset Update');
```

The example above logs that the validation process for input data associated with a dataset updated has been started. You'll notice that the `info()` function is called - this sets the logging level for this message. While different logging tools implement different strategies to differentiate logs, this approach is rather common and widespread. It's up to you to define your log levels, how they translate into entries on the logging output, or how different logging levels are forwarded to different channels - just remember to keep the day-to-day logs on `stdout`. 

If you want to access your logging output for a microservice that's already deployed on either staging or production, you'll need access to `kubernetes` logging UI or CLI. The details of this are discussed on a separate section.

### Microservice internal architecture - nodejs

<aside class="notice">
This section is completely implementation specific and opinionated, and does not reflect any technical requirement of the API. However, as all nodejs microservices use this architecture, we will cover it here as it's useful for new developers. Other microservice implementations in other languages will have different architectures, and you can also implement your own microservice using nodejs using a totally different architecture. Take this whole section as information/suggestion rather than as a ruleset.
</aside>

Nodejs microservices are based on the [Koa](https://koajs.com/) framework for nodejs. To understand the following code snippets, we assume you are familiar with the basics of the framework, like how routes are declared and handled, and what middleware are and how they work. You should also be somewhat familiar with tools like [npm](https://www.npmjs.com/), [mongo](https://www.mongodb.com/) and [mongoose](https://mongoosejs.com/), [Jenkins CI](https://jenkins.io/), [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/)

#### Anatomy of a (nodejs) microservice

In this section, we'll use [the dataset microservice](https://github.com/resource-watch/dataset) as an example, but these concepts should apply to most if not all nodejs microservices:

- app: source code for the microservice functionality.
- config: configuration for different environments in which the microservice will be executed.
- k8s: [kubernetes](https://kubernetes.io/) configuration.
- Jenkinsfile: deployment configuration for [Jenkins CI](https://jenkins.io/).
- dataset.sh: convenience executable file (the name will always match the microservice).
- docker-compose-develop.yml: [docker-compose](https://docs.docker.com/compose/) configuration for develop environment.
- docker-compose-test.yml: [docker-compose](https://docs.docker.com/compose/) configuration for test environment.
- docker-compose.yml: [docker-compose](https://docs.docker.com/compose/) configuration for production environment.
- entrypoint.sh: [docker](https://www.docker.com/) entry point.

Since we are interested in the microservice's functional bits, we'll analyse the `app` folder content in more detail. It's worth mentioning that, depending on how you run the microservice, the respective `docker compose` files may contain relevant information and configuration, as do the files inside the `config` folder.


The `app` folder contains the following structure:

- microservice: JSON files used during the Control Tower registration process.
- src: source code for the microservice.
- test: test source code.
- Gruntfile.js: [grunt](https://gruntjs.com/) task definition file.
- index.js: nodejs entry point.

The grunt file includes several task definition that may be useful during day-to-day development. However, grunt is semi-deprecated (it's still needed, don't remove it) in the sense that it's recommended to define useful tasks in the `package.json` file instead - those tasks will, in turn, call grunt tasks.

Inside the `app/src` folder you'll find the following structure. The folders below will be commonly found on all microservice, unless stated otherwise:

- data: data files. This folder is specific to the dataset microservice.
- errors: error classes for specific scenarios, which then in turn translate into specific HTTP codes and responses.
- models: `mongose` models to ease integration with `mongo`.
- routes: `koa` route and request handling definition, as well as middleware.
- serializers: `mongoogse` model to JSON response serializers.
- services: application business logic.
- validators: input validators.
- app.constants.js: microservice application constants.
- app.js: `koa` bootstrap, as well as basic error handling and Control Tower registration.
- loader.js: convenience file that iterates over the nested content of the `routes` folder and loads files.
- logger.js: convenience file that configures the logger for ease of use.

#### Adding a new endpoint

In this section we'll cover how you can add a new endpoint with new functionality to an existing microservice. The aim is not to be a comprehensive guide to cover all cases, but more of a quick entry point into day-to-day actions you may want to perform, which should be complemented by your own learning of how a microservice works - remember that all microservices, despite being structurally similar, have their own custom code and functionality.

To add a new endpoint, here's the short tasklist you have to tackle:

- Register your route in koa.
- Add a handler for that route.
- Add middleware for validation, if applicable.
- Implement new services, models or serializers to handle your application logic, if applicable.
- Add tests for your functionality (you may want to start with this, if TDD is your thing).
- Update the Control Tower registration file.

##### Register your route in koa

This can be done in the `app/src/routes/api/v1/dataset.router.js` file, usually at the bottom of if:

```javascript

// router object declaration, usually at the top of the file
const router = new Router({
    prefix: '/dataset',
});

// routes declaration, usually at the bottom of the file
router.get('/', DatasetRouter.getAll);
router.post('/find-by-ids', DatasetRouter.findByIds);
router.post('/', validationMiddleware, authorizationMiddleware, authorizationBigQuery, DatasetRouter.create);
// router.post('/', validationMiddleware, authorizationMiddleware, authorizationBigQuery, authorizationSubscribable, DatasetRouter.create);
router.post('/upload', validationMiddleware, authorizationMiddleware, DatasetRouter.upload);
router.post('/:dataset/flush', authorizationMiddleware, DatasetRouter.flushDataset);
router.post('/:dataset/recover', authorizationRecover, DatasetRouter.recover);

router.get('/:dataset', DatasetRouter.get);
router.get('/:dataset/verification', DatasetRouter.verification);
router.patch('/:dataset', validationMiddleware, authorizationMiddleware, DatasetRouter.update);
router.delete('/:dataset', authorizationMiddleware, DatasetRouter.delete);
router.post('/:dataset/clone', validationMiddleware, authorizationMiddleware, DatasetRouter.clone);
```

In here you'll find the already existing routes. As you can see from the rather explicit syntax, you need to call the method that matches the desired HTTP verb on the `router` object, and pass it a variable number of arguments - more on this in the next section. One thing to keep in mind is that all the routes in a file are typically prefixed, as defined in the `router` object declaration.
