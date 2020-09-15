# Microservice development guide

In this chapter, we'll cover additional details that you, as a RW API developer, should keep in mind when developing your microservice. We'll focus not only on the technical requirements you need to meet for your microservice to communicate with the remaining RW API internal components, but also discuss the policy surrounding development for the RW API, as a way to achieve a certain degree of consistency across a naturally heterogeneous microservice-based system. 

<aside class="notice">
Control Tower, which is mentioned throughout these docs, will be replaced soon with an equivalent but alternative solution. While we will aim to have this transition be as seamless as possible, you may need to adapt your code once this is done.
</aside>

## Microservice overview

As described in the [API Architecture](#api-architecture) section, microservices are small web applications that expose a REST API through a web server. This means that microservices can be built using any programming language, just as long as it supports HTTP communication. In practical terms, most of this API's core microservices are built using [nodejs](https://nodejs.org), with [Python](https://www.python.org/) and [Rails](https://rubyonrails.org/) being distant 2nd and 3rd respectively. This is due to personal preference of the team behind the API, as there really isn't a technical reason or limitation preventing the creation of microservices in PHP, Go, Elixir, etc.

In this whole section, we will use code examples from the [Dataset microservice](https://github.com/resource-watch/dataset/), which is built using nodejs. We will discuss the general principles, which should apply to all implementations, as well as implementation details, which may apply to your scenario if you are also using nodejs, or that may not apply if you are using something else.

## Setting up a development environment

In this section, we'll cover the details of how you can configure your operating system to be used as a development environment for the [Dataset microservice](https://github.com/resource-watch/dataset/), which is built using nodejs. These instructions will apply, without major changes, to all other nodejs-based microservices. For microservices based on Python or Rails, and when using [Docker](https://www.docker.com/), you should also be able to use these instructions. Native execution for Python and Rails microservices is done using equivalent commands, which we'll outline as we go. 

Note that these instructions aim at giving you the details about **what's specific to the RW API**, and it's not a step-by-step list of commands you can copy-paste. For example, we will not cover the details of how to install dependencies - that's something best answered by that particular piece of software's documentation page for your operating system, which you can easily find with your favourite search engine.

Also, when applying these instruction to different microservices, be sure to review their respective `README.md` file for a comprehensive list of dependencies you'll need, or other specific details about its setup process.

### Execution - native vs Docker

All microservices can be executed in two ways: natively or using [Docker](https://www.docker.com/). If you are not familiar with Docker, we suggest briefly learning about it does before proceeding. In a nutshell, it simplifies setup and execution, at the expense of varying performance hit, depending on your operating system. Here are a few key points you should consider when making a decision between executing natively or using Docker:  

- When using Docker, you typically do not need to set up any other dependency for any microservice - Docker will take care of that for you.
- On Windows and Mac, Docker will run a small Linux virtual machine behind the scenes, which will mean a noticeable increase in resource consumption and a reduction in runtime performance, when compared to native execution. When using linux, that does not happen, and runtime performance and resource usage is roughly equivalent to native execution.
- Docker does have its quirks, and it does come with a bootstrap time penalty when running your code, so if you are not very familiar with it, or are used to native execution of nodejs, Python or Rails code, it may pay off to use that approach. 

### Using native execution

#### Getting the code

The first step will be getting the source code from [Github](https://github.com/resource-watch/dataset/) to your computer using the [Git](https://git-scm.com/) CLI (or equivalent). 

```shell
git clone git@github.com:resource-watch/dataset.git
```

#### Installing dependencies

In the source code you just downloaded, you'll find a `README.md` file with detailed instruction for the microservice, including dependencies you'll need to install.

For all Node.js microservices, you'll need to install [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com). Rather than installing Node.js from the official website, we recommend using [nvm](https://github.com/nvm-sh/nvm), which allows you to easily install and manage different Node.js versions on your computer, since different microservices may require different versions of Node.js to run.

<aside class="notice">
For Python, you can use something like <a href="https://github.com/pyenv/pyenv">pyenv</a>, and <a href="https://rvm.io/">rvm</a> for Rails-based microservices.
</aside>

```shell
# Install Node.js v12 for the dataset microservice
nvm install 12

# Switch to the v12 installation
nvm use 12
```

Once you've installed a version manager like nvm, you need to check which version of the language to install. For Node.js microservices, the `package.json` file typically has a `engine` value which will tell you which version(s) of Node.js are supported. Another place where you'll find this info (which also works for other languages) is the content of the `Dockerfile` (typically in the first line) - in the dataset microservice, for example, `FROM node:12-alpine` means this microservice runs on Node.js v12.

```shell
# To install dependencies, navigate to the directory where you cloned the microservice and run:
yarn
```

[Yarn](https://yarnpkg.com) is a package manager for Node.js applications (a spiritual equivalent to [pip](https://pypi.org/project/pip/) for Python or [Bundler](https://bundler.io/) for Ruby). Once it's installed, be sure to use it to install the necessary libraries (see right).

<aside class="notice">
Windows users: If after running <code>yarn</code> you get an error where <code>gyp</code> cannot find Visual Studio, the solution <i>should</i> be as easy as running <code>yarn global add windows-build-tools</code> from an admin command prompt.
</aside>
 
The microservice's `README` may specify additional dependencies you need to install. [MongoDB](https://www.mongodb.com/), for example, is a common dependency of many RW API microservices, with applications like [Postgres](https://www.postgresql.org/), [Redis](https://redis.io/), [RabbitMQ](https://www.rabbitmq.com/) or [Elasticsearch](https://www.elastic.co/home) also being required on certain microservices. If a version number is not identified on the `README.md` file, the `docker-compose-test.yml` file may help. `image: mongo:3.4` means this microservice depends on MongoDB v3.4.

Besides these dependencies, microservices may also depend on the Control Tower gateway, and other microservices: 

- As we'll cover in the [Registering on Control Tower section](#registering-on-control-tower), on bootstrap, a microservice will register itself in Control Tower so it can expose its endpoints to the public facing API - but this behavior can be disabled, as we'll see in a moment.
- Microservices expect user data to be provided by Control Tower in a specific format - a workaround for this is passing this data yourself when calling your microservice endpoints
- [Requests to other microservices](#requests-to-other-microservices) are routed through Control Tower, so if the endpoints you will be developing rely on other microservices, you need to set up both Control Tower and those microservices locally.
- Control Tower implements certain endpoints related to user management, which may also be required by the endpoints you'll be working on.

If your endpoint does not rely on other microservices, and you don't rely on or can spoof the user data provided by Control Tower, you can set the `CT_REGISTER_MODE` environment variable to a value other than `auto` to disable the automatic registration on startup, thus removing the dependency on Control Tower. However, this is not recommended, as using Control Tower will have your development environment resemble the production setup, thus potentially highlighting any issues you may otherwise miss.

To set up Control Tower, follow these same instructions, as the process is the same as for any nodejs microservice.

#### Configuration

With the dependencies set up, it's time to configure the microservice. This is done using [environment variables](https://en.wikipedia.org/wiki/Environment_variable) (env vars) which you can define in multiple ways, depending on your OS, way of executing the code (e.g. many IDEs have a "Run" feature that allow configuring environment variables using a GUI) and personal preference. For this tutorial, and going forward, we'll assume you'll run the code from a terminal and specify the environment variables inline.

```shell
NODE_ENV=production CT_REGISTER_MODE=none <more variables> <your command>
```

To find out more about which env vars you can/need to specify, refer to the microservice's `README.md` file, as it typically documents the main variables available to you. Nodejs-base microservices will often have a full list in the `config/custom-environment-variables.json` file. The `docker-compose-test.yml` and `docker-compose-develop.yml` files contain usages of said variables, and may be helpful if you are looking for an example or an undocumented variable.

As a rule of thumb, env vars configure things like databases address and credentials, 3rd party services (for example, an AWS S3 bucket URL or AWS access credentials), or Control Tower URL (only necessary if you decide to use it).

#### Starting the microservice

```shell
# Starting a Node.js microservice:
yarn start

# Node.js using inline environment variables:
NODE_ENV=production CT_REGISTER_MODE=none <your other environment variables> yarn start

# Starting a Python microservice may look something like this:
python main.py

# Rails-based microservices can rely on the traditional Rails CLI:
rails server
```

Once you have determined the values you'll need to run your microservice with the desired configuration, you should have everything ready to run it. For nodejs based microservice like Dataset, you can do this by running `yarn start`. For other languages, the startup command will be different (see right).

You can also review the `entrypoint.sh` file content, under the `start` or `develop` sections, as it will contain the command you need to execute to run the code natively.

The application should output useful information, like database connection status and HTTP port. Depending on your configuration for the Control Tower auto registration, it will also output the result of that process. Overall, if no error message is produced, the microservice should be up and running, and available at the port specified by its output.

#### Running the tests

```shell
# Running tests for a Node.js microservice:
yarn test

# Node.js with environment variables:
NODE_ENV=test CT_REGISTER_MODE=none <your other environment variables> yarn test

# Python:
exec pytest <test folder>

# Ruby:
bundle exec rspec spec
```

Most microservices (hopefully all in the future) come with tests included. Running these tests can help you identify issues with your code changes, and are required for any new modifications merged into the RW API. It's recommended that you run tests locally before pushing changes to Github.

Tests sometimes mock certain dependencies, like external 3rd party service, but often require an actually running database, as a native execution would (think MongoDB or Postgres). Check the `docker-compose-test.yml` for whatever services it runs besides the microservice - those are the dependencies you'll need to have up and running to run the tests natively. Control Tower is not required to run the tests.

Test execution requires roughly the same env vars as running the actual microservice. For microservices that rely on a database, make sure you are not using the same database as you do for development purposes - tests assume database isolation, and will delete preexisting data.
 
See right for how to run tests for microservices in different languages. You can also review the `entrypoint.sh` file content, under the `test` section, which will contain the exact command you need to execute.

#### Common errors and pitfalls

- **Your microservice cannot connect to MongoDB/other database**: ensure that the corresponding service is running and listening on the configured address and port - be mindful that `localhost`, `127.0.0.1` and your local IP are not always interchangeable. Also confirm user and password data.
- **Your microservice crashes shortly after start, trying to reach a network address**: this may be your microservice trying to reach Control Tower. Either disable Control Tower auto registration, or run Control Tower.
- **Your microservice crashes when handling an API call, trying to reach a network address**: this may be your microservice trying to reach another microservice through Control Tower. Make sure that both Control Tower and the necessary dependent microservices are up and running, and that all microservices involved are registered in Control Tower. Be sure that Control Tower's cron is running.
- **Your microservice has user-related issues, even though you are providing a `Bearer` token**: Bearer tokens are processed by Control Tower, and transformed into a `loggedUser` JSON object that microservices expect. Either provide said object directly to your microservice, or route you request with the token through Control Tower.
- **Your tests keep failing**: This can be due to multiple reasons. Check the microservice's travis status (link in the README.md) to see if it's just you, or if there's an issue with the preexisting code base. Run your tests a few more times and see if the output is consistent - some tests are not deterministic, and have varying results. Ensure your env vars are correct - check `docker-compose-test.yml` or `.travis.yml` for examples on values.

### Using Docker

#### Getting the code

The first step will be getting the source code from [Github](https://github.com/resource-watch/dataset/) to your computer using the [Git](https://git-scm.com/) CLI (or equivalent). 

```shell
git clone git@github.com:resource-watch/dataset.git
```

<aside class="notice">
Make sure to checkout with `--config core.autocrlf=input`. This avoids an issue between Docker and Windows when handling line endings.
</aside>

#### Installing dependencies

As we mentioned before, if you decide to use Docker, your only dependency will be Docker itself (and docker-compose, which comes included). Depending on your OS, Docker installation instructions will differ, but your favourite web search engine will hopefully point you in the right direction.

When you run Docker, it will automatically fetch the necessary dependencies and run them for you. However, if you are not using Linux, you may have to fine-tune some settings so that dependencies like MongoDB can communicate with your microservice - we'll review this in detail in a bit.

Note that Docker will not fetch nor run Control Tower for you - if you want to execute your microservice in integration with Control Tower, you'll have to set it up manually. Alternatively, set the `CT_REGISTER_MODE` [environment variable](https://en.wikipedia.org/wiki/Environment_variable) to any value other than `auto`.

#### Configuration

Configuration for Docker based execution is done using [environment variables](https://en.wikipedia.org/wiki/Environment_variable) (env vars) passed to the Docker runtime using a special `dev.env` file. Some microservices will include a `dev.env.sample` or equivalent that you can copy-paste and use as a starting point when configuring your environment.

To find out more about which env vars you can/need to specify, refer to the microservice's `README.md` file, as it typically documents the main variables available to you. Nodejs-base microservices will often have a full list in the `config/custom-environment-variables.json` file. The `docker-compose-test.yml` and `docker-compose-develop.yml` files contain usages of said variables, and may be helpful if you are looking for an example or an undocumented variable.

As a rule of thumb, env vars configure things like databases address and credentials, 3rd party services (for example, an AWS S3 bucket URL or AWS access credentials), or Control Tower URL (only necessary if you decide to use it). Your docker-compose file may already have predefined values for some of these, in which case do not overwrite them unless you are certain of what you're doing.

Docker networking works differently on Linux vs other operating systems, and you need to keep this in mind when specifying values for things like MongoDB or Control Tower addresses. Under Linux, Docker containers and the host operating system run in the same network host, so you can use `localhost`, for example, when telling a dockerized Dataset microservice where it can reach Control Tower (running natively or in a Docker container). Under other operating systems, however, Docker containers run on a different network host, so you should instead use your local network IP - using `localhost` will not reach your expected target. 

#### Starting the microservice

For convenience, most microservices include a unix-based script that will run the Docker command that will start your microservice, along with the dependencies covered by Docker. The file name will vary from microservice to microservice, and the argument may also vary, but it's usually something along the lines of:

```shell
./dataset.sh develop
```

Mac users' mileage may vary with these scripts, and Windows users will need to manually open these file and reproduce the included logic in Windows-compatible syntax - don't worry, they are pretty simple and easy to understand. 

Docker will take a few minutes to run, especially during the first execution, but once it's up and running, you should see the HTTP address where your microservice is available in the output printed to the console.

#### Running the tests

Running tests under Docker is similar to running the actual microservice. The easiest way to do so, for unix-based OSs is using the included `.sh` helper file:

```shell
./dataset.sh test
```

#### Common errors and pitfalls

- **Your microservice cannot connect to MongoDB/other database**: this can happen with Docker setups if the database container takes longer to start than the microservice container - which is common on first time executions. Re-run the docker-compose command fixes it most times. Check if the address, port, username and password values on the `dev.env` file are correct - most of the time, the default values will work, and your `dev.env` file should not override them.
- **Your microservice crashes shortly after start, trying to reach a network address**: this may be your microservice trying to reach Control Tower. Either disable Control Tower auto registration, or run Control Tower. Ensure that the address and port pointing to Control Tower are correct - typically you need to use your private IP address (`localhost` or `127.0.0.1` won't do for non linux OSs).
- **Your microservice crashes when handling an API call, trying to reach a network address**: this may be your microservice trying to reach another microservice through Control Tower. Make sure that both Control Tower and the necessary dependent microservices are up and running, and that all microservices involved are registered in Control Tower. Be sure that Control Tower's cron is running.
- **Your microservice has user-related issues, even though you are providing a `Bearer` token**: Bearer tokens are processed by Control Tower, and transformed into a `loggedUser` JSON object that microservices expect. Either provide said object directly to your microservice, or route you request with the token through Control Tower.
- **Your tests keep failing**: This can be due to multiple reasons. Check the microservice's travis status (link in the README.md) to see if it's just you, or if there's an issue with the preexisting code base. Run your tests a few more times and see if the output is consistent - some tests are not deterministic, and have varying results.

## CI/CD

The RW API uses multiple tools in it's [CI](https://en.wikipedia.org/wiki/Continuous_integration) and [CD](https://en.wikipedia.org/wiki/Continuous_delivery) pipelines. All microservices that compose the RW API use a common set of tools:

- [Github](https://github.com) for version control and code repository.
- [Travis CI](travis-ci.org/) for automatic test execution.
- [Code Climate](codeclimate.com/) for code coverage monitoring.
- [Jenkins](https://www.jenkins.io/) for deployment.

We assume, at this point, that you're already familiar with Github and its core functionality, like branches and pull requests (PRs). If that's not the case, use your favourite search engine to learn more about those concepts.

Each microservice lives in a separate Github repository, most of which have Travis and Code Climate integrations configured. Whenever a pull request is created, both tools will be triggered automatically - Travis will run the tests included in the code, and notify the PR author of the result. Code Climate builds on top of that, and monitors and reports [code coverage](https://en.wikipedia.org/wiki/Code_coverage). The behavior of both tools is controlled by a single `.travis.yml` file you'll find in the root of each microservice's code base, and you can learn about it on each of the tool's documentation page. You can see the result directly on the PR page.

When you want to submit a change to the code of one of the microservices, you should:

- Do your changes in a separate git branch, named after the change you're making.
- Target the `dev` branch (or `develop`, if `dev` does not exist yet).
- Include tests to cover the change you're making.
- Ensure your PR tests pass when executed by Travis.
- Maintain/increase the code coverage value reported by Code Climate.
- Briefly describe the changes you're doing in a `CHANGELOG.md` entry and, if these are public-facing, do a PR to the [RW API documentation repository](github.com/resource-watch/doc-api).

At this stage, and even if your tests pass locally, they may fail when executed in Travis. We recommend running them again if this happens, to see if any [hiccup](https://whatis.techtarget.com/definition/hiccup) occurred. If that's not the case, look into the Travis logs to learn more. Unfortunately, the reasons for these are diverse. It can be related to env vars defined inside the `.travis.yml` file, missing or incorrectly configured dependencies, differences in packages between your local environment and Travis', etc. At the time of writing, and by default which can be overridden, Travis uses Ubuntu and is configured to [use native execution](#using-native-execution) when running tests, so using that very same approach locally may get you closer to the source of the problem you're experiencing. Travis' output log will usually help you identify what's happening, and get you closer to a solution.

Once reviewed by a peer, your changes will be merged and will be ready for deployment to one of the live environments.

Currently, the RW API has 3 different environments:

- `dev` for internal testing and development of new features. There are no guarantees of stability or data persistence. While it's not bared from public access, it's meant to be used only by developers working on the RW API code, for testing, debugging and experimentation.
- `staging` is a more stable environment, meant to be used by both the RW API developers as well as other developers working on applications built using the RW API. It aims to be functionally stable, but occasional interruptions may occur if needed as part of a process, and code is sometimes in "release candidate" status, meaning it can have some issues. Data is often relied on by users of this API, so be mindful when performing destructive actions.
- `production` is meant to be as stable as possible, as it's used by real users.

Each microservice repository has a branch matching the name of each of these 3 environments, and changes will always go from a feature branch to `dev`, then to `staging`, and finally to `production`. To push your changes across the different environments, you should:

- Create a PR from the source branch to the target branch (from `dev` to `staging`, or from `staging` to `production`)
- Deploy the code to the respective environment (we'll see how in a moment)
- Test it with actual calls to the API, to validate that no side effects were introduced.

Depending on the scale of the changes you're doing, it's recommended to use [git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) with [semantic versioning](https://semver.org/). Also be sure to update the `CHANGELOG.md` accordingly, and the `package.json` or equivalent files if they refer a version number. It's also best practice to announce the changes you're about to deploy before doing so, so that other developers of RW API applications can be on the lookout for regressions, and can quickly get in touch with you should any undesired behavior change be detected.

Each of the referred environments lives on a separate [Kubernetes](https://kubernetes.io/) cluster (hosted with [AWS EKS](https://aws.amazon.com/eks/)), and deployment is done using individual Jenkins instances:

- [Jenkins for the dev environment](https://jenkins.aws-dev.resourcewatch.org)
- [Jenkins for the staging environment](https://jenkins.aws-staging.resourcewatch.org)
- [Jenkins for the production environment](https://jenkins.aws-prod.resourcewatch.org)

All 3 instances have similar overall configuration, but different microservices may deploy differently depending on the behavior coded into the `Jenkinsfile` that's part of their source code - for example, some WRI sites are also deployed using this approach, but opt to deploy both staging and production versions to the `production` cluster, and may not be in the `staging` or `dev` Jenkins.

The list of jobs you find on each Jenkins instance will match the list of services deployed on that environment. In the details of each job, you should find a branch named after the environment, which corresponds to the Github branch with the same name (some services may still have the old approach, with `develop` for `dev` and `staging`, and `master` for `production`). You may also find other branches, or a different branch structure, depending on the service itself - again, the `Jenkinsfile` configuration is king here, and you should refer to it to better understand what is the desired behavior per branch. In some cases, old branches will be listed on Jenkins but should be ignored.

Once you start a deployment process, Jenkins will run the `Jenkinsfile` content - it is, after all, a script - and perform the actions contained in it. While it's up to the maintainer of each microservice to modify this script, more often that not it will run the tests included in the microservice, using Docker, and if these pass, push the newly generated Docker image to [Docker Hub](https://hub.docker.com/). It will then update the respective Kubernetes cluster with content of the matching subfolder inside the `k8s` folder of the microservice, plus the `k8s/service` folder if one exists. The last step is to deploy the recently pushed Docker image from Docker Hub to the cluster, which will cause Kubernetes to progressively replace running old instances of the service with ones based on the new version.

**A couple of important notes here:**

- All code deployed this way is made public through Docker Hub. If you have sensitive information in your codebase, and are using a Github private repository but are deploying using this approach, your information is NOT kept private.
- When deploying to production, most microservices will have an additional step at the end of the `Jenkinsfile` execution, which will require a human to explicitly click a link at the end of the Jenkins build log to trigger a deployment to the cluster. This is made intentionally so that deployment to the production environment are explicit and intentional, and are not triggered by accident.

While it's rare, tests ran by Jenkins at this stage may also fail, preventing your deployment. In these cases, refer to the Jenkins build log for details, which most of the times can be reproduced locally [running your tests using Docker](#running-the-tests69). If your Jenkins log mentions issues related with disk capacity or network address assignment problems, please reach out to someone with access to the Jenkins VMs and ask for a [docker system prune](https://docs.docker.com/engine/reference/commandline/system_prune/).

## Testing your deployed code

With your code live on one of the clusters, you should now proceed to testing it. The type of tests you should run vary greatly with the nature of the changes you did, so common sense and industry best practices apply here:

- The bigger the change, the broader the testing should be.
- Test your changes with different types of users, `applications`, payloads, etc.
- Try to break your code - send unexpected input, try to access resources you should not have access to, etc. More important than doing what it should is not doing what it shouldn't .
- If you can, ask for help - testing can be seen as an exercise in creativity, and having someone's assistance will help think outside the box.
- If you find a bug, fix it, and test everything again, not only what you just fixed.
- If a test is "simple", write it as a code test, which is reproducible. Save manual testing for the complex scenarios.
- Test the assumptions you used for behavior of other microservices - E2E testing mocks other microservices, so this may be the first time your code is running alongside real instances of other microservices.
- Clean up after your tests - if you created a bunch of test data, do your best to delete it once you're done. This is particularly important if you are testing something in the production environment, as that test data may be visible to real world users. Cleaning up in staging is also highly recommended.

If you are implementing a new endpoint and it's mission critical to the RW API or one of the applications it powers, you may want to add a [API smoke test](#api-smoke-tests) to ensure that any issue affecting its availability is detected and reported. Refer to that section of the docs for more details.

## Microservice internal architecture - nodejs

<aside class="notice">
This section is completely implementation specific and opinionated, and does not reflect any technical requirement of the API. However, as all nodejs microservices use this architecture, we will cover it here as it's useful for new developers. Other microservice implementations in other languages will have different architectures, and you can also implement your own microservice using nodejs using a totally different architecture. Take this whole section as information/suggestion rather than as a ruleset.
</aside>

Nodejs microservices are based on the [Koa](https://koajs.com/) framework for nodejs. To understand the following code snippets, we assume you are familiar with the basics of the framework, like how routes are declared and handled, what middleware is, and how it works. You should also be somewhat familiar with tools like [npm](https://www.npmjs.com/), [mongo](https://www.mongodb.com/) and [mongoose](https://mongoosejs.com/), [Jenkins CI](https://jenkins.io/), [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/)

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

Route registration is done using the [koa-router](https://github.com/ZijianHe/koa-router) library, and can be done in the `app/src/routes/api/v1/dataset.router.js` file, usually at the bottom of if:

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

Another best practice we recommend for log management is using an application-wide configuration value to define the logging level. This is prove extremely useful when you switch from your local development environment (where you may prefer the `debug` logging level for maximum detail) to production (where `warn` or `error` may be more reasonable). 

When using Bunyan, logging levels are set [per stream](https://github.com/resource-watch/dataset/blob/5d4b6d1a3b243f5ba985b444633c0f6acf78b35d/app/src/logger.js#L7). Many microservices integrate the [Config](https://www.npmjs.com/package/config) library at this stage, allowing you to have different values for [production](https://github.com/resource-watch/dataset/blob/25ab6b6ac7b1c4618b3d4ae1690957b256bafca8/config/prod.json#L4), [staging](https://github.com/resource-watch/dataset/blob/685a799f79f2441a129e4cf5cfaf3ed06ace5546/config/staging.json#L4) or other environments. Config also allows you to [override selected values with a environment variable](https://github.com/resource-watch/dataset/blob/34d4b00fe06bd6d7c9b1dd25e043da4e820db653/config/custom-environment-variables.json#L12), typically `LOGGER_LEVEL`, which you may use, for example, to temporarily override the logging level on a particular environment without changing the predefined default values. 

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

- The example above creates an actual dataset, meaning a MongoDB (or equivalent mocks) need to exist. For MongoDB specifically, our approach so far has been to use a real MongoDB instance, and running the tests on a separate database (´dataset-tests´ for example), aiming for isolation. Other microservices (for example, those relying on Elasticsearch) use mocks instead. Mocking usually leads to faster execution times, but can be troublesome to properly code. Use whichever alternative is best for you, and refer to the [Data layer](#data-layer) section for examples of microservices that use (and test with) different tools.
- Nock has a [feature that blocks all HTTP requests](https://github.com/nock/nock#enabledisable-real-http-requests), which is useful to ensure your code or tests are not relying on an external service without you being aware - just be sure to whitelist your own IP, otherwise the HTTP call your test makes to your microservice will fail too.
- Tests must be idempotent, and execute without assuming order. For example, running a test that first tests an insert, and then using the inserted element to test a delete would be a bad practice. Instead, your insert test should clean up its data once it's done, and the delete test should prepopulate the database before actually trying to delete it. A corollary of this is that you should be able to run your tests multiple times, back-to-back, without that affecting the results.

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
