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
                  |                      <===   POST /api/v1/microservice  <===                          | 
                  | {"name":"microservice name", "url": "http://microservice-url.com", "active": true }  | 
                  |                                ===>   Reply  ===>                                    | 
                  |                      { /* JSON with microservice details */ }                        | 
                  |                                                                                      | 
                  |                                                                                      | 
                  |                                                                                      | 
                  |                           ===>   GET /api/info  ===>                                 | 
                  |                                <===   Reply  <===                                    | 
                  |                      { /* JSON with microservice endpoints */ }                      | 
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
	]
}
```

Breaking it down bit by bit:

- `name`: Name of the microservice.
- `tags`: List of tags associated with the microservice.
- `endpoints`: Array of `endpoint` objects.

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

- ###### `binary`: Using this causes Control Tower to pipe the microservice's response content as a binary stream to the external request's reply. Use this in case you expect your microservice's replies to have large amounts of data.
- `authenticated`: Setting this to `true` causes Control Tower to immediately return an HTTP `401` error code in case this endpoint matches the external request, but that request has no user identification data.
- `applicationRequired`: Setting this to `true` causes Control Tower to immediately return an HTTP `401` error code in case this endpoint matches the external request, but that request has no application data as part of the user's data.
- `filters`: An array of filter objects that the request must match to in order for a match to be considered successful.
- `filters.name`: A name for the filter, without functional implications.
- `filters.method`: Method to use in the filter request.
- `filters.path`: URI to use in the filter request.
- `filters.params`: Query parameters passed to the filter request.
- `filters.compare`: Response structure to be matched with the filter request reply, to determine if the external request matches this filter.

The filtering section has the most complex structure, so lets analyse it with a real-world example. The above example would match a request like GET `<api external URL>/v1/query/<dataset id>`. Once that request is received by Control Tower, it is tentatively matched to this endpoint, but pending the validation of the filter section.

To process the filter, Control Tower will do a request of type `filters.method` (GET, in this case) and URI `filters.path`. As the URI contains a `:dataset` variable, it will use the `filters.params`



