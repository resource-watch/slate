# Microservice development guide

In this chapter, we'll cover additional details that you, as a RW API developer, should keep in mind when developing your microservice. We'll focus not only on the technical requirements you need to meet for your microservice to communicate with the remaining RW API internal components, but also discuss the policy surrounding development for the RW API, as a way to achieve a certain degree of consistency across a naturally heterogeneous microservice-based system. 

<aside class="notice">
Control Tower, which is mentioned throughout these docs, will be replaced soon with an equivalent but alternative solution. While we will aim to have this transition be as seamless as possible, you may need to adapt your code once this is done.
</aside>

## Microservice overview

As described in the [API Architecture](#api-architecture) section, microservices are small web applications that expose a REST API through a web server. This means that microservices can be built using any programming language, just as long as it supports HTTP communication. In practical terms, most of this API's core microservices are built using [nodejs](https://nodejs.org), with [python](https://www.python.org/) and [Rails](https://rubyonrails.org/) being distant 2nd and 3rd respectively. This is due to personal preference of the team behind the API, as there really isn't a technical reason or limitation preventing the creation of microservices in PHP, Go, Elixir, etc.

In this whole section, we will use code examples from the [Dataset microservice](https://github.com/resource-watch/dataset/), which is built using nodejs. We will discuss the general principles, which should apply to all implementations, as well as implementation details, which may apply to your scenario if you are also using nodejs, or that may not apply if you are using something else.

## Microservice internal architecture - nodejs

<aside class="notice">
This section is completely implementation specific and opinionated, and does not reflect any technical requirement of the API. However, as all nodejs microservices use this architecture, we will cover it here as it's useful for new developers. Other microservice implementations in other languages will have different architectures, and you can also implement your own microservice using nodejs using a totally different architecture. Take this whole section as information/suggestion rather than as a ruleset.
</aside>

Nodejs microservices are based on the [Koa](https://koajs.com/) framework for nodejs. To understand the following code snippets, we assume you are familiar with the basics of the framework, like how routes are declared and handled, and what middleware are and how they work. You should also be somewhat familiar with tools like [npm](https://www.npmjs.com/), [mongo](https://www.mongodb.com/) and [mongoose](https://mongoosejs.com/), [Jenkins CI](https://jenkins.io/), [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/)

### Anatomy of a (nodejs) microservice

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

### Adding a new endpoint

In this section we'll cover how you can add a new endpoint with new functionality to an existing microservice. The aim is not to be a comprehensive guide to cover all cases, but more of a quick entry point into day-to-day actions you may want to perform, which should be complemented by your own learning of how a microservice works - remember that all microservices, despite being structurally similar, have their own custom code and functionality.

To add a new endpoint, here's the short tasklist you have to tackle:

- Register your route in koa.
- Add a handler for that route.
- Add middleware for validation, if applicable.
- Implement new services, models or serializers to handle your application logic, if applicable.
- Add tests for your functionality (you may want to start with this, if TDD is your thing).
- Update the Control Tower registration file.

### Register your route in koa

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

## Control Tower integration

While they could technically work as standalone applications, microservices are built from the ground up to work through Control Tower. As such, not only do they lack built-in functionality provided by Control Tower itself (for example, user management), they also need to handle their own integration with Control Tower. Control Tower provides integration libraries for certain languages and frameworks, which you can use to ease development:
- [nodejs package for Koa](https://github.com/control-tower/ct-register-microservice-node)
- [Python module for Flask](https://github.com/control-tower/ct-register-microservice-python-flask)
- [Rails engine](https://github.com/control-tower/ct-register-microservice-rails)

These libraries provide 2 basic features that we'll cover in detail in this chapter. You can also use it for reference in case you want to implement a microservice in a different programming language or framework. 

We'll use the nodejs library as reference and example in the following sections, as it's the most commonly used language in this API. Other libraries will provided the same underlying functionality, but may have different ways to operate. Refer to each library's specific documentation for more details.

### Registering on Control Tower

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
- mode: if set to `ctRegisterMicroservice.MODE_AUTOREGISTER` the Control Tower registration process will be automatically triggered when the Koa application server starts. Otherwise, use `ctRegisterMicroservice.MODE_NORMAL` if you want to register manually.
- framework: `ctRegisterMicroservice.KOA2` or `ctRegisterMicroservice.KOA1`, depending on the Koa version your app uses.
- app: Koa application instance
- logger: [Logger](https://github.com/quirkey/node-logger) instance.
- name: name of the microservice to be provided to Control Tower as part of the registration process.
- ctUrl: Control Tower URL.
- url: URL within the internal network through which this microservice can be accessed.
- token: Control Tower token to authenticate the registration requests
- active: If set to `false` the microservice will be registered as disabled (not accessible). You should set this to `true` in most cases.


This registration call usually takes place right after the microservice's start process has ended, and the corresponding web server is available. Keep in mind that the call above will trigger an HTTP request to Control Tower, which in turn will call the microservice's web server - so make sure the microservice's web server is up and running when you attempt to register it.


### Requests to other microservices

Besides contacting Control Tower to register themselves, microservices also need to contact Control Tower to make requests to other microservices. 

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

As explained above, although the call is ultimately to another microservice, the request is sent to Control Tower, who is then responsible for issuing another internal request to the destination microservice, getting the reply from that call and passing it on to the microservice that initiated the process.

Another thing you'll notice is that this call depends on preexisting configuration stored in the `this.options` property. These configuration options are stored within the object during the Control Tower registration process, meaning you should not attempt to make a call to another microservice unless you have previously registered your microservice on Control Tower. Keep in mind that this is a restriction of this particular integration library, and not of Control Tower itself - a different implementation could do internal requests to microservices through Control Tower without being registered as a microservice.

In some scenarios, while developing, it's not practical to run all the microservices your logic depend on on your development computer. The [Writing end-to-end tests](#writing-end-to-end-tests) section has some details about writing tests for your code, including how you can mock such calls, so you don't have to run the actual dependencies.

## Docker

When deployed in a production environment, microservices will run in a [Docker](https://www.docker.com/) container. As a microservice developer, you should include in your microservice the necessary configuration to run your application inside a container. This is done using a Dockerfile, and you can use the [Dataset microservice's Dockerfile](https://github.com/resource-watch/dataset/blob/develop/Dockerfile) as an example of how one of these files looks like for a nodejs based microservice.

Its worth noting that these container are set up in a way that allows using them to both run the microservice itself, or their tests. This will be useful further ahead when we review the testing approach you should use when writing microservices.

## Data layer

Many microservices require the ability to store data to perform their function. The RW API has several data storage tools available to you, in case you need to store information to run your service.

**Warning**: microservices run on ephemeral containers managed by Kubernetes, and often in multiple parallel instances, so do not rely on storing data on the filesystem, unless you know there's something like a [Kubernetes' persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) to back it up.

When accessing these tools, there are a few things you should keep in mind:
- Isolation is not guaranteed, meaning your microservice will have theoretical access to other microservice's data, and other microservices may access your data.
- Despite having access to it, you should not manipulate other microservice's data directly at the data layer, unless there's a clear agreement between the involved microservices.
- It's up to you to ensure logic level isolation of your data - for example, if you rely on an relational database, be sure to use a unique database name.
- Access to the data layer is only available within the RW API cluster, which is why not all data storage tools have authentication enabled.

Currently, the following data storage tools are available on the RW API cluster:

### MongoDB v3.6

[MongoDB](https://www.mongodb.com/) is the most frequently used data storage tool, as it supports schema-less document storage, thus making it easy to setup and run. When using MongoDB, be sure to give your collection an unique name, to avoid conflicts

To see an example of how to use MongoDB on a real-world microservice, check out the [Dataset microservice](https://github.com/resource-watch/dataset/).

### Postgres v9.6

Use [Postgres](https://www.postgresql.org/) if your application needs a relational database. Unlike other data storage tools, Postgres access to individual microservices is granted on a per-database basis.

To see an example of how to use Postgres on a real-world microservice, check out the [Resource watch manager microservice](https://github.com/resource-watch/resource-watch-manager/) (written in Ruby on Rails).

### Elasticsearch v5.5

Use [Elasticsearch](https://www.elastic.co/) for search optimization or heterogeneous data storage with quick access. The current setup also includes [a 3rd party plugin for SQL support on ES 5](https://github.com/NLPchina/elasticsearch-sql).

To see an example of how to use Elasticsearch on a real-world microservice, check out the [Document dataset adapter microservice](https://github.com/resource-watch/document-adapter/).

### Redis v5.0

[Redis](https://redis.io/) is an in-memory data storage tool, and can also be used as a [pub-sub](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) messaging tool.

You can learn how to use Redis in your applications by looking at the code of the [Subscriptions microservice](https://github.com/gfw-api/gfw-subscription-api).

### Neo4J v2.0

[Neo4J](https://neo4j.com/) is a graph database used by [Graph microservice](https://github.com/resource-watch/graph-client/) to build complex associations between different RW API resources.

### RabbitMQ v3.7

[RabbitMQ](https://www.rabbitmq.com/) is a message broker service, which is particularly useful when handling long, asynchronous operations. You can see an example of its usage on the [Document microservice - Executor submodule](https://github.com/resource-watch/doc-executor) code base.

### Cloud services

Some microservices have data storage needs that are not covered by the applications described here (for example, file storage). In those scenarios, it's common to use cloud services (like AWS S3, for example), but do reach out to the broader RW API development team before implementing your solution.

## HTTP caching

The RW API has a system-wide HTTP cache that you may use to cache your requests, improving scalability and response times. This cache is based on [Fastly](https://www.fastly.com/), and you can browse its documentation if you are looking for a specific detail on its behavior. For most common use cases, you just need to keep in mind the following:

- Only responses with codes 200, 203, 300 and 410 are cached, and the default cache TTL is 3 days.
- GET responses for `/auth` endpoints are never cached.
- GET responses for `/query` or `/fields` endpoints are cached for 2 days.
- Your microservice can use the `cache` response header to tag a cache entry. This, in itself, has no functional impact. Example [here](https://github.com/resource-watch/dataset/blob/47ad8b9509b97803d7f484549908e72ecaa98467/app/src/routes/api/v1/dataset.router.js#L396).
- Your microservice can use the `uncache` header to purge cache entries matching a given tag, as set in the previous point. Example [here](https://github.com/resource-watch/dataset/blob/47ad8b9509b97803d7f484549908e72ecaa98467/app/src/routes/api/v1/dataset.router.js#L462).

## Logging

An important part of microservice operation is logging events as it processes requests. Many errors are only triggered during staging and production server execution, and without proper logging, there isn't a way to identify how it can be reproduced, so it can then be fixed.

Common development languages often come with either built-in or 3rd party logging libraries than make logging easier to handle. Current nodejs microservices use [Bunyan](https://github.com/trentm/node-bunyan) to manage logs, which eases managing log destinations (stdout, file, etc) and log levels. Other libraries, for nodejs and other languages, offer similar functionality.

For microservice staging and production logs, the output channels should be `stdout` and `stderr`, the standard output streams you'll find on most OSs. When live, these, will seamlessly integrate with the infrastructure to which microservices will be deployed, and will allow for cluster-wide logging. 


```javascript 
const logger = require('logger');

logger.info('Validating Dataset Update');
```

The example above logs that the validation process for input data associated with a dataset updated has been started. You'll notice that the `info()` function is called - this sets the logging level for this message. While different logging tools implement different strategies to differentiate logs, most microservices uses these 4 levels:

- `debug`: use this whenever anything happens, that may or may not be relevant to have logged on a daily basis, but rather as a opt-in development and debug tool.
- `info`: use this for high-level expected actions and output that you'd need to have available to you in case you need to investigate a production issue.
- `warn`: use this for situations where something unexpected happened, but that may not necessarily be irregular flows - for example, user originated errors.
- `error`: use this when the application failed and is no longer able to recover, or when an server-side error occurs.

A common issue some developers have concerns logging errors. It's not uncommon to find microservices where all types of errors generate a `error` log entry. However, this actually produces a lot of noise, and make it hard to debug. Consider the following two scenarios when attempting to load a dataset by id:

- The dataset microservice queries the database, and the database cannot find a dataset matching that id, and the microservice returns a 404 HTTP response.
- The dataset microservice queries the database, but the database is offline for whatever reason, and the microservice returns a 500 HTTP response.

Both cases are, indeed, errors. However, the first one is not an application error - the microservice behaved as it should. In this scenario, logging this event should not involve an `error` level event, as nothing unexpected, from the application's point of view, happened: a user asked for something that does not exist, and the microservice handled that as it should.

On the second case, however, something really unexpected did happen - the microservice could not contact the database. This is an application level error, as we assume that our databases are always available for to microservices. This is an example scenario where a `error` logging line should be generated. Or, putting it in another way, only use `errors` logging for situations where a RW API developer should look into it.

If you want to access your logging output for a microservice that's already deployed on either staging or production, you'll need access to `kubernetes` logging UI or CLI.

## Testing

Testing code is important. And, as the developer of a RW API microservice, it's your responsibility to ensure that your code is bug free and easily extendable in the future. That means it should ship with a set of tests that can ensure, now and in the future, that it does what it's supposed to do. And the best way to do that is through testing.

If you are developing a new microservice or endpoint, it's expected that you provide a complete test suit for your code. In many cases, existing microservices will be a valuable source of examples you can copy and adapt to your needs. On occasion, you'll need to changes to endpoints that are not yet covered by tests. In those scenarios, we ask that add at least the tests to cover your modification. If you are feeling generous, and want to add tests that cover the endpoint's full functionality, you'll have our gratitude - test coverage for the RW API's endpoints is a work in progress, and not all endpoints have been reached just yet.

### Writing end-to-end tests

Most microservices rely, to varying degrees, on end-to-end tests. In the context of an HTTP based microservice, this means that tests are responsible for issuing an HTTP request to a running instance of your microservice, getting the response and validating its content. Tests should also handle things like mocking resources and isolation from outside world - we'll get to these in a moment.

> Example of a test from the dataset microservice

```javascript
it('Create a JSON dataset with data in the body should be successful', async () => {
    const timestamp = new Date();
    const dataset = {
        name: `JSON Dataset - ${timestamp.getTime()}`,
        application: ['forest-atlas', 'rw'],
        applicationConfig: {
            'forest-atlas': {
                foo: 'bar',
            },
            rw: {
                foo: 'bar',
            }
        },
        connectorType: 'document',
        env: 'production',
        provider: 'json',
        dataPath: 'data',
        dataLastUpdated: timestamp.toISOString(),
        data: {
            data: [
                {
                    a: 1,
                    b: 2
                },
                {
                    a: 2,
                    b: 1
                },
            ]
        }
    };

    nock(process.env.CT_URL)
        .post('/v1/doc-datasets/json', (request) => {
            request.should.have.property('connector').and.be.an('object');
            const requestDataset = request.connector;

            requestDataset.should.have.property('name').and.equal(dataset.name);
            requestDataset.should.have.property('connectorType').and.equal(dataset.connectorType);
            requestDataset.should.have.property('application').and.eql(dataset.application);
            requestDataset.should.have.property('data').and.deep.equal(dataset.data);
            requestDataset.should.have.property('sources').and.eql([]);
            requestDataset.should.not.have.property('connectorUrl');

            return true;
        })
        .reply(200, {
            status: 200,
            detail: 'Ok'
        });

    const response = await requester.post(`/api/v1/dataset`).send({
        dataset,
        loggedUser: USERS.ADMIN
    });
    const createdDataset = deserializeDataset(response);

    response.status.should.equal(200);
    response.body.should.have.property('data').and.be.an('object');
    createdDataset.should.have.property('name').and.equal(`JSON Dataset - ${timestamp.getTime()}`);
    createdDataset.should.have.property('connectorType').and.equal('document');
    createdDataset.should.have.property('provider').and.equal('json');
    createdDataset.should.have.property('connectorUrl').and.equal(null);
    createdDataset.should.have.property('tableName');
    createdDataset.should.have.property('userId').and.equal(USERS.ADMIN.id);
    createdDataset.should.have.property('status').and.equal('pending');
    createdDataset.should.have.property('overwrite').and.equal(false);
    createdDataset.should.have.property('applicationConfig').and.deep.equal(dataset.applicationConfig);
    createdDataset.should.have.property('dataLastUpdated').and.equal(timestamp.toISOString());
    createdDataset.legend.should.be.an.instanceOf(Object);
    createdDataset.clonedHost.should.be.an.instanceOf(Object);
});
```

Current nodejs based microservices rely on [Chai](https://www.chaijs.com/) and [Mocha](https://mochajs.org/) as testing libraries, and this code example shows one of the tests that validate the dataset creation process. The code block is relatively large, but the logic is simple:

- We craft a JSON object with the content of the HTTP POST body
- As this endpoint needs to make a call to another microservice (through Control Tower), we use [Nock](https://github.com/nock/nock) to mock that POST request to the `/v1/doc-datasets/json` endpoint. This way, your tests won't require actual running instances of Control Tower or other microservices to run.
- We send the our previously crafted POST request to a running instance of our dataset microservice, along with a `loggedUser` spoof data.
- We get the HTTP response, process it for easier handling, and proceed to validate that it's content is as expected.

Different microservices and endpoint will have different requirements when it comes to testing, but the great majority of endpoints can be tested using simple variations of these steps. There are some additional considerations you should take into account when testing:

- The example above creates an actual dataset, meaning a MongoDB (or equivalent mocks) need to exist. For MongoDB specifically, our approach so far has been to use a real MongoDB instance, and running the tests on a separate collection (´dataset-tests´ for example), aiming for isolation. Other microservices (for example, those relying on Elasticsearch) use mocks instead. Mocking usually leads to faster execution times, but can be troublesome to properly code. Use whichever alternative is best for you, and refer to the [Data layer](#data-layer) section for examples of microservices that use (and test with) different tools.
- Nock has a [feature that blocks all HTTP requests](https://github.com/nock/nock#enabledisable-real-http-requests), which is useful to ensure your code or tests are not relying on an external service without you being aware - just be sure to whitelist your own IP, otherwise the HTTP call your test makes to your microservice will fail too.
- Individual tests should run in isolation, and without assuming order. For example, running a test that first tests an insert, and then using the inserted element to test a delete would be a bad practice. Instead, your insert test should clean up its data once it's done, and the delete test should prepopulate the database before actually trying to delete it. A corollary of this is that you should be able to run your tests multiple times, back-to-back, without that affecting the results.

### Test coverage metrics

While not required, most microservices use [code coverage](https://en.wikipedia.org/wiki/Code_coverage) tools to evaluate how much of your code base is actually being checked when the test suite is executed. Nodejs based microservices frequently use [NYC](https://www.npmjs.com/package/nyc) and [Istanbul](https://istanbul.js.org/) for this purpose, in case you are looking for a recommendation.

### Running your tests using docker compose

The previous section covers an example of how a test looks like. Depending on your microservice technology stack, you have different ways of running your tests - in the case of the Dataset microservice, tests are executed using [yarn](https://yarnpkg.com/). 

However, to standardise test execution, you should also create a [docker compose](https://docs.docker.com/compose/) file that runs your tests (and their dependencies). This docker compose configuration should use the [existing docker file](#docker) set up previously, unless that's not possible.

Here's an example of [one of these files](https://github.com/resource-watch/dataset/blob/ab23e379362680e9899ac8f191589988f0b7c1cd/docker-compose-test.yml). These will be particularly useful down the line, but also convenient for running tests locally.

For convenience, microservices commonly have a [one line CLI command](https://github.com/resource-watch/dataset/blob/ab23e37936/dataset.sh#L8) that allows running tests using the docker compose configuration you provide. These are particularly useful for other developers to run your tests without having to manually set up the associated dependencies.

### CI/CD, Travis and Code Climate

Assuming you are hosting your microservice code on a service like Github, then you may benefit from its integration with [CI/CD](https://en.wikipedia.org/wiki/CI/CD) tools. There are multiple options in this space, and they mostly offer the same core functionality, but our preference so far has been to use [Travis](https://travis-ci.org/). In a nutshell, you can configure Travis to run your tests every time you push a new commit to a Github pull request. Tests will run on Travis' servers, and if they fail, you will get a message on your pull request warning you about this.

For full details on Travis and its features, how to configure it, what alternatives are there, and their pros and cons, please refer to your favourite search engine. If you are just want the basic, "it just works" configuration, [this file from the Dataset microservice](https://github.com/resource-watch/dataset/blob/cd55ff83695266ffae58471569fc3c16b2f1adf2/.travis.yml#L10) will have most of what you'll need.

Apart from running your tests, Travis also integrates with a service called [Code Climate](https://codeclimate.com/) which analyses your code and looks for potentially problematic bits and suggests you fix them. More often than not, we just rely on another functionality offered by Code Climate - [code coverage](https://en.wikipedia.org/wiki/Code_coverage). This allows you to easily monitor how your pull request influences code coverage - for example, you can set up an alarm that warns you in case your pull request decreases your code coverage, which may indicate that you added more code than you tested.

Most microservices will display a test status and code coverage badges on their README, as a way to display if the tests are passing, and a rough estimation of how broad the test coverage is.

### Smoke testing

Besides the test tools covered above, which are used to validate that your code changes work as designed, there is also a smoke test tool in place, that periodically issues a request to selected RW API endpoints and validates that the response match an expected preconfigured value. These tests are not used to validate functionality, but rather availability - if something goes wrong, a human is notified that the RW API is not working as it should, and that this is potentially affecting users. 

If you believe your microservice implements a mission-critical endpoint that would merit one of these tests, please reach out to the RW API team.

## Deploying your microservice

### Jenkins

Microservice deployment to the Kubernetes clusters is done using [Jenkins](https://www.jenkins.io/). The actual deployment process is configurable using a [Jenkinsfile](https://github.com/resource-watch/dataset/blob/develop/Jenkinsfile) script written in [Groovy](https://groovy-lang.org/). Most microservices use the same file, as the logic in it is flexible enough to accommodate most scenarios.

In a nutshell, this Jenkinsfile will:

- Build a docker image using the Docker file contained in your microservice.
- Uses the included docker compose configuration to run your tests. If the tests fail, the process is aborted at this stage
- Push the generated docker image to [dockerhub](https://hub.docker.com/)
- Depending on the git branch, the following actions will take place:
  - If deploying from the `develop` branch, it will push the docker image to the staging kubernetes cluster 
  - If deploying from the `master` branch, you will get a confirmation input. If you confirm, it will push the docker image to the production kubernetes cluster 
  - Any other branches are ignored.
  
At the beginning of each deploy process, you will also see an confirmation input that, if accepted, will redeploy the kubernetes configuration contained in the microservice code repository to the respective kubernetes cluster: `develop` branch to the staging cluster, `master` branch to the production cluster.

One thing worth noting is that the docker images generated using this method are publicly available on dockerhub. Be careful not to store any sensitive data in them, as it will be available to anyone.

### Kubernetes configuration

Most microservice have a [Kubernetes configuration folder](https://github.com/resource-watch/dataset/tree/develop/k8s), typically containing 3 folders:

- `production` contains files that will be applied when deploying the `master` branch to the production cluster
- `staging` contains files that will be applied when deploying the `develop` branch to the production cluster
- `services` contains files that will be applied when deploying either branches to their respective cluster.

Note that these settings are only applied if you opt in to it, by interacting with the input request that is displayed on Jenkins at the very beginning of the deployment process.

## Documentation

### README

Here are some 'do' and 'do not' you should take into account when writing the README.md for your microservice.

Do:

- Add the name of your microservice, along with a high level, short description of what it does.
- Identify the technical dependencies. This should include:
  - Programming language
  - Main framework or language-specific tools used
  - Data layer dependencies or other applications, including version numbers
  - Dependencies on other microservices
- Describe how to get your microservice up and running for development purposes (at least for the operating system you are currently using, but you get extra "thank you"s if you add details for other OSs)
- Describe how to run your tests
- Describe if and which configuration variables exist, and their behavior.
- Document implementation details, software development architectural decisions, etc
- Use English.

Do not:

- Document in detail how to set up dependencies on 3rd party applications (for example, don't provide installation instruction for a database server, just mention it's a dependency, and assume your fellow developer will figure out how to set it up on their system).
- Include a license text - you may mention it, but add the actual text on a separate file, to keep the README file concise.
- Assume the reader has vast experience in developing for the RW API, in the language your microservice is coded on, or using its dependencies or libraries
- Document endpoint behavior - that goes elsewhere.

Overall, the README should be targeted at developers that may need to run, test and debug your code.

### Functional documentation

Documentation describing the business logic implemented by your microservice should go in the [RW API Documentation](/) page. The documentation is available [on this Github repository](https://github.com/resource-watch/doc-api/) and its README includes instructions on how to use it and contribute.

Documentation is a key component of a successful API, so when altering public-facing behavior on the RW API, you must update the documentation accordingly, so that RW API users out there can be aware of the changes you made.

## Code styling

As a way to help RW API developers collaborate, most microservices include a [linter](https://en.wikipedia.org/wiki/Lint_(software)) tool and ruleset to promote, as much as possible, a common set of rules for the way code is structured.

For microservices written in nodejs, this is achieved using [Eslint](https://eslint.org/) with [this configuration file](https://github.com/resource-watch/dataset/blob/develop/.eslintrc.yml).

For ruby-based microservices, you can use [Rubocop](https://github.com/rubocop-hq/rubocop) along with [this configuration file](https://github.com/resource-watch/resource-watch-manager/blob/develop/.rubocop.yml).

Most microservices will also include a [.editorconfig](https://github.com/resource-watch/dataset/blob/develop/.editorconfig) file - you can learn more about there [here](https://editorconfig.org/).
