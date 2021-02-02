# Graph

The interaction with some of the graph endpoints is restricted to other RW API services - the following sections describe these endpoints. Keep in mind user-facing graph endpoints are described in detail in the [graph endpoint documentation](/reference.html#graph). The [graph concept docs](/reference.html#concepts) might also be a useful resource for learning what the RW API graph is and what it has to offer you.

## Creating dataset graph nodes

> POST request to create a dataset graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/dataset/:id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint creates a graph node for the dataset with id provided in the URL path. 

**This endpoint is automatically called on dataset creation**, so you don't need to manually do it yourself after you create a dataset. In order to ensure that API users cannot manually create graph nodes for datasets, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to create a graph node for a dataset, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for creating dataset graph nodes

Error code | Error message   | Description
---------- | --------------- | ---------------------------------
401        | Unauthorized    | No authorization token provided.
403        | Not authorized  | You are trying to call this endpoint without being identified as a RW API service.

## Creating widget graph nodes

> POST request to create a widget graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/widget/:idDataset/:idWidget \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint creates a graph node for the widget with id provided in the URL path. It also creates a graph edge, connecting the newly created widget graph node to the graph node for the dataset associated with this widget.

**This endpoint is automatically called on widget creation**, so you don't need to manually do it yourself after you create a widget. In order to ensure that API users cannot manually create graph nodes for widgets, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to create a graph node for a widget, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for creating widget graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Dataset not found | No graph node for the dataset with id provided was found.

## Creating layer graph nodes

> POST request to create a layer graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/layer/:idDataset/:idLayer \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint creates a graph node for the layer with id provided in the URL path. It also creates a graph edge, connecting the newly created layer graph node to the graph node for the dataset associated with this layer.

**This endpoint is automatically called on layer creation**, so you don't need to manually do it yourself after you create a layer. In order to ensure that API users cannot manually create graph nodes for layers, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to create a graph node for a layer, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for creating layer graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Dataset not found | No graph node for the dataset with id provided was found.

## Creating metadata graph nodes

> POST request to create a metadata graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/metadata/:resourceType/:idResource/:idMetadata \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint creates a graph node for the metadata with id provided in the URL path. As you might have come across in the [Metadata endpoint documentation](#metadata12), metadata is always associated with either a dataset, layer, or widget. So, when creating a graph node for a metadata entry, you must also provide the resource type (dataset, layer, or widget) and its corresponding id. 

Calling this endpoint will also create a graph edge connecting the newly created metadata graph node to the graph node for the resource (dataset, layer, or widget) associated with it.

**This endpoint is automatically called on metadata creation**, so you don't need to manually do it yourself after you create a metadata entry. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to create a graph node for a metadata entry, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for creating metadata graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

## Deleting dataset graph nodes

> DELETE request to remove a dataset graph node:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/dataset/:id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint deletes the graph node for the dataset with id provided in the URL path. 

**This endpoint is automatically called on dataset deletion**, so you don't need to manually do it yourself after you create a dataset. In order to ensure that API users cannot manually delete graph nodes for datasets, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to delete a graph node for a dataset, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for deleting dataset graph nodes

Error code | Error message   | Description
---------- | --------------- | ---------------------------------
401        | Unauthorized    | No authorization token provided.
403        | Not authorized  | You are trying to call this endpoint without being identified as a RW API service.

## Deleting widget graph nodes

> DELETE request to remove a widget graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/widget/:id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint deletes the graph node for the widget with id provided in the URL path.

**This endpoint is automatically called on widget deletion**, so you don't need to manually do it yourself after you delete a widget. In order to ensure that API users cannot manually delete graph nodes for widgets, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to delete a graph node for a widget, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for deleting widget graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.

## Deleting layer graph nodes

> DELETE request to remove a layer graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/layer/:id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint deletes the graph node for the layer with id provided in the URL path.

**This endpoint is automatically called on layer deletion**, so you don't need to manually do it yourself after you delete a layer. In order to ensure that API users cannot manually delete graph nodes for layers, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to delete a graph node for a layer, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for deleting layer graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.

## Deleting metadata graph nodes

> DELETE request to remove a metadata graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/metadata/:id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint deletes the graph node for the metadata with id provided in the URL path.

**This endpoint is automatically called on metadata deletion**, so you don't need to manually do it yourself after you delete a metadata entry. In order to ensure that API users cannot manually delete graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to delete a graph node for a metadata entry, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for deleting metadata graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.

## Associating concepts to graph nodes

> POST request to associate concepts to a graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/:resourceType/:idResource/associate \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{
  "tags": ["health", "society"]
}'
```

This endpoint creates a graph edge, representative of the relationship between the resource identified in the URL path and the concepts provided in the `tags` field of the request body.

**This endpoint is automatically called when you associate the vocabulary "knowledge_graph" to a resource**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

## Updating concepts associated with graph nodes

> PUT request to update the concepts associated to a graph node:

```shell
curl -X PUT https://api.resourcewatch.org/v1/graph/:resourceType/:idResource/associate \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{
  "tags": ["health", "society"],
  "application": "rw"
}'
```

This endpoint updates the graph edge associated with the resource identified in the URL path. Existing concepts are deleted and replaced with the ones provided in the `tags` field of the request body.

**This endpoint is automatically called when you associate the vocabulary "knowledge_graph" to a resource**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

## Deleting concepts associated with graph nodes

> DELETE request to remove concepts associated to a graph node:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/:resourceType/:idResource/associate \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint deletes the graph edge associated with the resource identified in the URL path.

**This endpoint is automatically called when you associate the vocabulary "knowledge_graph" to a resource**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

### Query parameters

> Specifying the application of the resource to be deleted:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/:resourceType/:idResource/associate?application=gfw
```

You can use the query parameter `application` to specify the application of the graph edge to be deleted by this request. You can find out more information about this field [here](/reference.html#applications).

### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

## Creating favorite relationships between users and graph nodes

> POST request to create favorite relationship between user and graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/favourite/:resourceType/:idResource/:userId \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{ "application": "rw" }'
```

This endpoint creates a graph edge representative of a favorite relationship between the resource identified in the URL path and the user id also identified in the URL path.

**This endpoint is automatically called when you call vocabulary's create favorite endpoint**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

## Deleting favorite relationships between users and graph nodes

> DELETE request to remove favorite relationship between user and graph node:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/favourite/:resourceType/:idResource/:userId \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint deletes the graph edge representative of a favorite relationship between the resource identified in the URL path and the user id also identified in the URL path.

**This endpoint is automatically called when you call vocabulary's delete favorite endpoint**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

### Query parameters

> Specifying the application of the favorite relationship to be deleted:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/favourite/:resourceType/:idResource/:userId?application=gfw
```

You can use the query parameter `application` to specify the application of the graph edge to be deleted by this request. You can find out more information about this field [here](/reference.html#applications).

### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.