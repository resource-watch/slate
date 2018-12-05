# Control Tower plugin development

This chapter covers Control Tower plugin development basics. It aims at providing basic understanding of how existing Control Tower plugins work, and give you the foundations to develop your own plugins.

## Implementing functionality

Control Tower and its plugins are implemented using Nodejs and [Koa](https://koajs.com/). Be sure to familiarize yourself with the key concepts behind this framework before exploring this section, as it assumes you are comfortable with concepts like route declaration or koa middleware.

Existing plugin functionality for Control Tower falls within one of two categories: middleware that intercepts requests as they are processed by Control Tower, or new endpoints that are added to Control Tower's API. Some plugins combine the two approaches to implement their functionality.

### Middleware

Middleware-based functionality consists of intercepting the external request and/or response and either gathering data about them (for logging or statistics) or modifying them (for example, for caching). This type of functionality can be implemented using koa's middleware API, as Control Tower itself does not modify or extend that in any way.


### Endpoint creation

Plugins can also extend Control Tower's endpoint list by registering new endpoints of their own. An example of this is the Control Tower Oauth plugin that exposes a number of endpoints to support actions like registering, logging in, recovering password, etc. Like with the middleware approach, this can be implemented by relying on koa principles, and Control Tower does not modify this behavior.


## Data storage

Control Tower uses a Mongo database to store data like known microservices or endpoints. Plugins can also access this database and create their own collections, should they wish to. Control Tower and existing plugins rely on [Mongoose](https://mongoosejs.com/) to that effect, and you'll find example of its usage throughout Control Tower and its plugins code.


## Plugin bootstrap and config

During its first initialization, Control Tower will load plugin settings from [this file](https://github.com/control-tower/control-tower/blob/develop/app/src/migrations/init.js). It includes a list of plugins to be initialized, whether or not they should be active, and their default configuration. On subsequent executions, this information will be loaded from the database instead, so additional changes you may want to do should be done on the database, and not on this file.

An important part of this file and of the corresponding database entries is plugin configuration. This data is stored within the `plugins` MongoDB collection managed by Control Tower but it's made available to plugins as they are initialized and ran.
