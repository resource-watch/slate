# API Architecture

This chapter covers the basic architectural details of the API. If you are new to RW API development, you should start here, as key concepts explained here will be needed as you go more hands-on with the API code and/or infrastructure.

## Microservice architecture

The RW API is built using a [microservices architecture](https://en.wikipedia.org/wiki/Microservices) using [Control Tower](https://github.com/control-tower/control-tower) as the gateway application.

In this configuration, Control Tower (CT) offers gateway and core functionality, like routing or user management, while user-facing functionality is provided by a set of microservices that communicate with each other and the external world through Control Tower.

Internal communication between CT and the microservices is done through HTTP requests, and as such each microservice is built on top of a web server..These different web servers create a network within the API itself, to which will refer throughout the rest of the documentation when we mention "internal network" or "internal requests". By opposition, an "external request" will reference a request from/to the world wide web, and "external network" basically means "the internet".

Control Tower itself acts both as an API in itself - with endpoints for management and monitoring - as well as a catch-all side, that is used to proxy requests to the functional endpoints.

## Microservice dependency graphs

![Microservice dependency graph](https://raw.githubusercontent.com/gfw-api/wri-api-dependencies/master/graphs/dependencies_graph.png)

The graph above illustrates the dependencies between different microservices as of July 2020. Most dependencies are based on endpoint calls: an arrow pointing from `query` to `dataset` means that the `query` microservice makes a call to one of the endpoints implemented by the `dataset` microservice. The exception to this rule are `doc-orchestrator`,  `doc-executor` and  `doc-writer`, who instead depend on each other via [RabbitMQ](https://www.rabbitmq.com/) messages.


![Microservice with no dependencies](https://raw.githubusercontent.com/gfw-api/wri-api-dependencies/master/graphs/no_dependencies_graph.png)

The microservices above do not depend on any of the other microservices.

It's worth noting that most microservices depend on Control Tower and functionality implicitly offered by it - for example, Control Tower will automatically pass to the microservice the details of the user, should the original HTTP request come with a valid JSON Web Token.

## Data layer dependencies

![Data layer dependencies](https://raw.githubusercontent.com/gfw-api/wri-api-dependencies/master/graphs/storage_graph.png)

The graph above illustrates the different data layer elements present on the RW API, and the microservices or sites that depend on each of these.

## Lifecycle of a request

All incoming requests to the API are handled by CT that, among other things, does the following:
- Checks if there's a microservice capable of handling that request.
- Checks if authentication data is required and/or is present.
- Automatically filters out anonymous requests to authenticated endpoints.

We'll go into more details about these processes in the next sections

Control Tower matches each incoming external request to a microservice, by comparing its URI and request method. It then generates a new HTTP request to that microservice and will wait for a response to it - which is used as a response to the original external request.

Microservices can make requests to each other via Control Tower. They also have unrestricted access to the public internet, so 3rd party services can be accessed as they normally would be. The API infrastructure also has other resources, like databases (MongoDB, ElasticSearch, Postgres) or publish-subscribe queues (RabbitMQ), which can be accessed. We'll cover those in more details in a separate section.
