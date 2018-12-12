# Control Tower

This chapter covers Control Tower in depth - what it does and how it does it.

## Overview

[Control Tower](https://github.com/control-tower/control-tower) is essentially a mix of 3 main concepts:
- An API proxy/router
- A lightweight management API
- A plugin system to extend functionality and its own API.

We'll cover those 3 topics individually in this section.

## API proxy/router

Control Tower's most basic functionality is accepting external requests to the API, "forwarding" them to the corresponding microservices, and returning whatever response the microservices produce.

Once an external request is received, Control Tower uses the HTTP request method and the URI of the request to match it to one of the known endpoints exposed internally by one of the microservices. Note that all external requests are handled exclusively by Control Tower, and microservices are no able to directly receive requests from outside the API's internal network (they can, however, make external requests).

This matching process can have one of two results:

### Handling a matching request

Should a match be found for the external request's URI and method, a new, internal request is generated and dispatched to the corresponding microservice. The original external request will be blocked until the microservice replies to the internal request - and the internal request's reply will be used as the reply to the external request as soon as the corresponding microservice returns it.

<aside class="notice">
By default, Control Tower does as little changes as necessary to the incoming external request and to the associated response produced by the microservice. However, for security, authentication/authorization, or due to external-to-internal endpoint mapping, changes will be made to requests and replies body, headers, etc.
</aside>

### Handling a non-matching request

#### No URI and method match

At its most basic, the external requests is matched by URI and HTTP method. Should no combination of URI and method be found, Control Tower will reply to the external request with a `404` HTTP code.

#### Authenticated

Microservice endpoints can be marked as requiring authentication. If a matching request is received, but no user authentication data is provided in the request, Control Tower will reject the request with a `401` HTTP code.

#### Application key

Similar to what happens with authenticated endpoints, microservice endpoints can also request an `application` to be provided in the request. If that requirement is not fulfilled, Control Tower will reject the request with a `401` HTTP code.

#### Filter error

Registered endpoints also have the possibility to specify `filters` - a custom requirement that must be met by the request in order for a request match to be successful. For example, endpoints associated with dataset operations use a common URI and HTTP method, but will be handled by different microservices depending on the type of dataset being used - this type of functionality can be implemented using the `filter` functionality. On some scenarios, even if all the previous conditions are met, `filters` may rule out a given match, in which case a `401` HTTP code will be returned.


### Microservice registration process

The matching process described above is carried out by Control Tower based on endpoints declared by each microservice. In this section, we'll take a detailed look at the process through which microservices can declare their available endpoints to Control Tower

#### Overview

Here's a graphical overview of the requests exchanged between CT and a microservice:

Control Tower     |                                     Request                                          |    Microservice
----------------- | :----------------------------------------------------------------------------------: | ------:
                  |                        <===   POST /v1/microservice  <===                            | 
                  | {"name":"microservice name", "url": "http://microservice-url.com", "active": true }  | 
                  |                                ===>   Reply  ===>                                    | 
                  |                                      HTTP OK                                         | 
                  |                                                                                      | 
                  |                                                                                      | 
                  |                                                                                      | 
                  |                           ===>   GET /api/info  ===>                                 | 
                  |                                <===   Reply  <===                                    | 
                  |                      { /* JSON with microservice details */ }                        | 
                  |                                                                                      | 
                  |                                                                                      | 
                  |                                                                                      | 
                  |                                (every 30 seconds)                                    | 
                  |                           ===>   GET /api/ping  ===>                                 | 
                  |                               <===   Reply  <===                                     | 
                  |                                       pong                                           | 


The registration process is started by the microservice. It announces its name, internal URL and active state to Control Tower. This tentatively registers the microservice in Control Tower's database, and triggers the next step of the process.

Immediately after receiving the initial request from the microservice, Control Tower uses the provided URL to reach the microservice. This is used not only to load the endpoint data, but also to ensure that Control Tower is able to reach the microservice at the provided URL - if that does not happen, the registration process is aborted on Control Tower's side, and the microservice data dropped. When it receives this request, the microservice should reply with a JSON array of supported endpoints. We'll dive deeper into the structure of that reply in a moment.

The last step of the process is Control Tower processing that JSON entity, and storing its data in its database. From this point on, the microservice is registered and is able to receive user requests through Control Tower.

Control Tower will, every 30 seconds, emit a `ping` request to the microservice, which must reply to it to confirm to Control Tower that it's still functional. Should the microservice fail to reply to a ping request, Control Tower will assume its failure, and de-register the microservice and associated endpoints. Should this happen, it's up to the microservice to re-register itself on Control Tower, to be able to continue accepting requests.

#### Minimal configuration

During the registration process, each microservice is responsible for informing Control Tower of the endpoints it supports, if they require authentication, application info, etc. This is done through a JSON object, that has the following basic structure:


```json
{
	"name": "dataset",
	"tags": ["dataset"],
	"endpoints": [
        {
            "path": "/v1/dataset",
            "method": "GET",
            "redirect": {
                "method": "GET",
                "path": "/api/v1/dataset"
            }
        }
	],
	"swagger": {}
}
```

Breaking it down bit by bit:

- `name`: Name of the microservice.
- `tags`: List of tags associated with the microservice.
- `endpoints`: Array of `endpoint` objects.
- `swagger`: [Swagger](https://swagger.io/) formatted JSON object documenting the microservice's endpoints.

Within the `endpoints` array, the expected object structure is the following: 

- `path`: Expected external request URI that will match to this endpoint.
- `method`: Expected external request method that will match to this endpoint.
- `redirect.method`: Method to use in the internal request to the microservice.
- `redirect.path`: URI to use in the internal request to the microservice.

Taking the example above, that reply would be provided by the `dataset` microservice while registering on Control Tower. It would tell CT that it has a single public endpoint, available at GET `<api public URL>/v1/dataset`. When receiving that external request, the `redirect` portion of the endpoint configuration tells CT to issue a GET request to `<microservice URL>/api/v1/dataset`. It then follows the process previously described to handle the reply from the microservice and return its content to the user.

#### Advanced configuration

The example from the previous section covers the bare minimum a microservice needs to provide to Control Tower in order to register an endpoint. However, as discussed before, Control Tower can also provide support for more advanced features, like authentication and application data filtering. The JSON `endpoint` snippet below shows how these optional parameters can be used to configure said functionality. 

```json
{
	"name": "query-document",
	"tags": ["query-document"],
	"endpoints": [
        {
            "path": "/v1/query/:dataset",
            "method": "GET",
            "binary": true,
            "authenticated": true,
            "applicationRequired": true,
            "redirect": {
                "method": "POST",
                "path": "/api/v1/document/query/:dataset"
            },
            "filters": [{
                "name": "dataset",
                "path": "/v1/dataset/:dataset",
                "method": "GET",
                "params": {
                    "dataset": "dataset"
                },
                "compare": {
                    "data": {
                        "attributes": {
                            "connectorType": "document"
                        }
                    }
                }
            }]
        }	
    ]
 }
```

Within the `endpoints` array, you'll notice a few changes. The `path` property now includes an URI which contains `:dataset` in it - this notation tells Control Tower to expect a random value in that part of the URI (delimited by `/`) and to refer to that value as `dataset` in other parts of the process.

The `redirect.path` references the same `:dataset` value - meaning the incoming value from the external request will be passed on to the internal requests to the microservice generated by Control Tower.

You'll also notice new fields that were not present before: 

- `binary`: Using this causes Control Tower to pipe the microservice's response content as a binary stream to the external request's reply. Use this in case you expect your microservice's replies to have large amounts of data.
- `authenticated`: Setting this to `true` causes Control Tower to immediately return an HTTP `401` error code in case this endpoint matches the external request, but that request has no user identification data.
- `applicationRequired`: Setting this to `true` causes Control Tower to immediately return an HTTP `401` error code in case this endpoint matches the external request, but that request has no application data as part of the user's data.
- `filters`: An array of filter objects that the request must match to in order for a match to be considered successful.
- `filters.name`: A name for the filter, without functional implications.
- `filters.method`: Method to use in the filter request.
- `filters.path`: URI to use in the filter request.
- `filters.params`: Query parameters passed to the filter request.
- `filters.compare`: Response structure to be matched with the filter request reply, to determine if the external request matches this filter.

The filtering section has the most complex structure, so lets analyse it with a real-world example. The above example would match a request like GET `<api external URL>/v1/query/<dataset id>`. Once that request is received by Control Tower, it is tentatively matched to this endpoint, but pending the validation of the filter section.

To process the filter, Control Tower will do a request of type `filters.method` (GET, in this case) and URI `filters.path`. As the URI contains a `:dataset` variable, it will use the `filters.params` object to map that value to the `dataset` value from the external request. This internal request is then issued and the process briefly stopped until a response is returned.

Once the response is returned, the `filters.compare` object comes into play: Control Tower will see if the response body object matches the set value in the `filters.compare` object. In this particular example, the resulting comparison would be something like `response.body.data.attributes.connectorType == "document"`. Should this evaluate to `true`, the filter is considered to have matched, and this endpoint is used to dispatch the internal request to. Otherwise, this endpoint is discarded from the list of possible matches for this external request.

Its worth noting at this stage that there's no restriction regarding uniqueness of internal endpoints - two microservices may support the same endpoint, and use filters to differentiate between them based on the underlying data. The example above illustrates how a microservice can support the `/v1/query/:dataset` external endpoint, but only for datasets of type `document`. A different microservice may support the same endpoint, but with a different filter value (for example `carto`) and offer the same external functionality with a completely different underlying implementation.

Should multiple endpoints match an external request, one of them is chosen and used - there are no guarantees in terms of which is picked, so while this scenario does not produce an error, you probably want to avoid it.


## Management API

In the previous section, we discussed how microservices can register their endpoint on Control Tower, exposing their functionality to the outside world. That registration process uses part of Control Tower's own API, which we'll discuss in finer detail in this section.

### Microservice management endpoints

The microservice registration endpoint is one of 4 endpoints that exist around microservice management:

#### GET `/microservice/`

This endpoint shows a list of registered microservice and their corresponding endpoints.

```bash
curl -X GET \
  http://<CT URL>/api/v1/microservice \
  -H 'Authorization: Bearer <your user token>' \
  -H 'Content-Type: application/json'
```

```json
[
    {
        "infoStatus": {
            "numRetries": 0,
            "error": null,
            "lastCheck": "2018-12-05T07:33:30.244Z"
        },
        "pathInfo": "/info",
        "pathLive": "/ping",
        "status": "active",
        "cache": [],
        "uncache": [],
        "tags": [
            "dataset"
        ],
        "_id": "5aa66766aee7ae846a419c0c",
        "name": "Dataset",
        "url": "http://dataset.default.svc.cluster.local:3000",
        "version": 1,
        "endpoints": [
            {
                "redirect": {
                    "method": "GET",
                    "path": "/api/v1/dataset"
                },
                "path": "/v1/dataset",
                "method": "GET"
            }
        ],
        "updatedAt": "2018-11-23T14:27:10.957Z",
        "swagger": "{}"
    }
]
```

#### GET `/microservice/status`

Lists information about operational status of each microservice - like errors detected by Control Tower trying to contact the microservice or number of retries attempted.

```bash
curl -X GET \
  http://<CT URL>/api/v1/microservice/status \
  -H 'Authorization: Bearer <your user token>' \
  -H 'Content-Type: application/json'
```

```json
[
    {
        "infoStatus": {
            "numRetries": 0,
            "error": null,
            "lastCheck": "2018-12-05T07:36:30.199Z"
        },
        "status": "active",
        "name": "Dataset"
    }
]
```

#### POST `/microservice/`

This is the endpoint used by microservices to register on Control Tower. You can find a detailed analysis of its syntax in the [previous section](#api-proxy-router)

#### DELETE `/microservice/:id`

This endpoint is used to unregister a microservice's endpoints from Control Tower. Control Tower does not actually delete the microservice information, nor does it immediately remove the endpoints associated to it. This endpoint iterates over all endpoint associated with the microservice to be unregistered, and flags them for deletion - which is actually done by a cron task that in the background. Until that moment, the microservice and associated endpoints will continue to be available, and external requests to those endpoints will be handled as matched as they were before. However, you will notice that endpoints scheduled for deletion will have a `toDelete` value of true - more on this in the next section.


```bash
curl -X DELETE \
  http://<CT URL>/api/v1/microservice/<microservice id> \
  -H 'Authorization: Bearer <your user token>' \
  -H 'Content-Type: application/json'
```

```json
{
    "infoStatus": {
        "numRetries": 0
    },
    "pathInfo": "/info",
    "pathLive": "/ping",
    "status": "active",
    "cache": [],
    "uncache": [],
    "tags": [
        "dataset",
        "dataset",
        "dataset"
    ],
    "_id": "5c0782831b0bf92a37a754e2",
    "name": "Dataset",
    "url": "http://127.0.0.1:3001",
    "version": 1,
    "updatedAt": "2018-12-05T07:49:36.754Z",
    "endpoints": [
        {
            "redirect": {
                "method": "GET",
                "path": "/api/v1/dataset"
            },
            "path": "/v1/dataset",
            "method": "GET"
        }
    ],
    "swagger": "{}"
}
```

### Endpoint management endpoints

#### GET `/endpoint`

This endpoint lists all microservice endpoint known by Control Tower. Note that it does not contain endpoints offered by Control Tower itself or any of its plugins.

```bash
curl -X GET \
  http://<CT URL>/api/v1/endpoint \
  -H 'Authorization: Bearer <your user token>' \
  -H 'Content-Type: application/json'
```

```json
[
    {
        "pathKeys": [],
        "authenticated": false,
        "applicationRequired": false,
        "binary": false,
        "cache": [],
        "uncache": [],
        "toDelete": true,
        "_id": "5c0784c88dcce0323abe705d",
        "path": "/v1/dataset",
        "method": "GET",
        "pathRegex": {},
        "redirect": [
            {
                "filters": null,
                "_id": "5c0784c88dcce0323abe705e",
                "method": "GET",
                "path": "/api/v1/dataset",
                "url": "http://127.0.0.1:3001"
            }
        ],
        "version": 1
    }
]
```

#### DELETE `/endpoint/purge-all`

This endpoint purges the complete HTTP cache for all microservices. It does not support any kind of parametrization, so it's not possible to use this endpoint to clear only parts of the cache. As such, we recommend not using this endpoint unless you are certain of its consequences, as it will have noticeable impact in end-user perceived performance.

```bash
curl -X DELETE \
  http://<CT URL>/api/v1/endpoint/purge-all \
  -H 'Authorization: Bearer <your user token>' \
  -H 'Content-Type: application/json'
```

### Documentation management endpoints

#### GET `/doc/swagger`

Generates a complete [Swagger](https://swagger.io/) JSON file documenting all API endpoints. This swagger is compiled by Control Tower based on Swagger files provided by each microservice. As such, the Swagger details for a given endpoint will only be as good as the information provided by the microservice itself.

<aside class="notice">
This
</aside>


```bash
curl -X GET \
  http://<CT URL>/api/v1/endpoint \
  -H 'Authorization: Bearer <your user token>' \
  -H 'Content-Type: application/json'
```

```json
{
    "swagger": "2.0",
    "info": {
        "title": "Control Tower",
        "description": "Control Tower - API",
        "version": "1.0.0"
    },
    "host": "tower.dev:9000",
    "schemes": [
        "http"
    ],
    "produces": [
        "application/vnd.api+json",
        "application/json"
    ],
    "paths": {
        "/api/v1/doc/swagger": {
            "get": {
                "description": "Return swagger files of registered microservices",
                "operationId": "getSwagger",
                "tags": [
                    "ControlTower"
                ],
                "produces": [
                    "application/json",
                    "application/vnd.api+json"
                ],
                "responses": {
                    "200": {
                        "description": "Swagger json"
                    },
                    "500": {
                        "description": "Unexpected error",
                        "schema": {
                            "$ref": "#/definitions/Errors"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "Errors": {
            "type": "object",
            "description": "Errors",
            "properties": {
                "errors": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Error"
                    }
                }
            }
        },
        "Error": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "A unique identifier for this particular occurrence of the problem."
                },
                "links": {
                    "type": "object",
                    "description": "A links object",
                    "properties": {
                        "about": {
                            "type": "string",
                            "description": "A link that leads to further details about this particular occurrence of the problem."
                        }
                    }
                },
                "status": {
                    "type": "string",
                    "description": "The HTTP status code applicable to this problem, expressed as a string value"
                },
                "code": {
                    "type": "string",
                    "description": "An application-specific error code, expressed as a string value"
                },
                "title": {
                    "type": "string",
                    "description": "A short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization."
                },
                "detail": {
                    "type": "string",
                    "description": "A human-readable explanation specific to this occurrence of the problem. Like title, this field's value can be localized"
                },
                "source": {
                    "type": "object",
                    "description": "An object containing references to the source of the error, optionally including any of the following members",
                    "properties": {
                        "pointer": {
                            "type": "string",
                            "description": "A JSON Pointer [RFC6901] to the associated entity in the request document"
                        },
                        "parameter": {
                            "type": "string",
                            "description": "A string indicating which URI query parameter caused the error."
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "description": "A meta object containing non-standard meta-information about the error."
                }
            }
        }
    }
}
```

### Plugin management endpoints

Control Tower as a plugin system of its own, which we'll cover in detail in the next section. As part of that system it has a few API endpoints to support certain actions

#### GET `/plugin`

Lists all currently enabled plugins, along with their configuration.

```bash
curl -X GET \
  http://<CT URL>/api/v1/plugin \
  -H 'Authorization: Bearer <your user token>' \
  -H 'Content-Type: application/json'
```

```json
[
    {
        "active": true,
        "_id": "5bfd440834d5076bb4609f9f",
        "name": "manageErrors",
        "description": "Manage Errors",
        "mainFile": "plugins/manageErrors",
        "config": {
            "jsonAPIErrors": true
        }
    }
]
```

#### PATCH `/plugin/:id`

Updates the settings of a given plugin.

```bash
curl -X PATCH \
  http://<CT URL>/api/v1/plugin/:pluginId \
  -H 'Authorization: Bearer <your user token>' \
  -H 'Content-Type: application/json' \
  -d '{
	"config": {
        "jsonAPIErrors": false
    }
}'
```

```json
{
    "_id": "5bfd440834d5076bb4609f9f",
    "name": "manageErrors",
    "description": "Manage Errors",
    "mainFile": "plugins/manageErrors",
    "config": {
        "jsonAPIErrors": false
    }
}
```

## Control Tower plugins

Control Tower provides basic API management functionality, but it also has a set of plugins that allow decoupling non-core functionality from the core code base. In this section we'll briefly cover the functional aspect of each plugin, without focusing too much on the underlying implementation, which will be covered separately.


### Time Request

This plugin times the time elapsed between the external request is received and the reply to it being dispatched back to the external API client. It adds the computed value as a response header `X-Response-Time`


### Manage errors

This plugin intercepts replies that represent errors and formats them properly.


### CORS

This plugins adds the necessary headers to support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)


### Invalidate cache endpoints

Varnish cache integration plugin that invalidates cache entries.

<aside class="notice">
This plugin is disabled and is no longer supported.
</aside>


### Response formatter

Handles response formats other than the default JSON, setting headers and formatting the response body according to the requested content type. Currently only supports XML.


### Statistics

Collects and stores statistics about the API usage. You can find more details on [this repo](https://github.com/control-tower/ct-stadistics-plugin).


### MongoDB sessions

Adds support for storing session data on MongoDB


### Oauth plugin

User management and authentication plugin. Supports email+password based registration, as well as Facebook, Twitter and Google+ oauth-based authentication. You can find more details on [this repo](https://github.com/control-tower/ct-oauth-plugin).


### Redis cache

Redis-based caching for Control Tower. You can find more details on [this repo](https://github.com/control-tower/ct-redis-cache).

<aside class="notice">
This plugin is disabled and is no longer supported.
</aside>


### Application key authorization

Application key handling.


### Fastly cache

Integrates HTTP caching using [Fastly](https://www.fastly.com/).
