# Collections

## What is a collection?

A collection is a way of aggregating WRI API resources like datasets, layers and widgets. A collection can reference one or more resources of different types.

Collection endpoints require authentication, and the collections are associated with the owner who initially created the collection.

## Collection model reference

| Field name   | Description                                                     | Type
| -------------|:--------------------------------------------------------------: | -----:
| name         | Name of collection.                                             | String
| ownerId      | Id of the user owner of this collection.                        | String
| application  | The application this collection belongs to (defaults to `'rw'`) | String
| resources    | Array of resources in the collection.                           | Array of Objects
| --- type     | The type of resource.                                           | String (dataset, layer, widget)
| --- id       | The id of the resource.                                         | String

## Create a collection

> To create an empty collection, you can do a POST with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/collection \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "name": "Collection name"
  }'
```

> Example response:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "Collection name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": []
      }
    }
  ]
}
```

> You can also add a resource in the body of the request when creating a new collection, with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/collection \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "name": "Collection name",
    "resources": [
      {
        "type": "dataset",
        "id": "06c44f9a-aae7-401e-874c-de13b7764959"
      }
    ]
  }'
```

> Example response:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "Collection name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": [
          {
            "type": "dataset",
            "id": "06c44f9a-aae7-401e-874c-de13b7764959"
          }
        ]
      }
    }
  ]
}
```

To create a collection, you should send a POST request to the `v1/collection` endpoint, providing an authentication token that identifies the user making the request. You also need to (or can) provide the following fields in the request body:

| Field name   | Description                                                     | Required | Type
| -------------|:--------------------------------------------------------------: | -----:   | -----:
| name         | Name of collection.                                             | Yes      | String
| application  | The application this collection belongs to (defaults to `'rw'`) | No       | String
| resources    | Array of resources in the collection.                           | No       | Array of Objects

## Update a collection

> To update a collection, you should perform a PATCH request including the collection ID in the url. Here's an example:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/collection/:id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "name": "New name"
  }'
```

> Example response:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "New name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": []
      }
    }
  ]
}
```

You can update the name of a collection, you can send a PATCH request to the `v1/collection/:id` endpoint, providing an authentication token that identifies the user making the request.

**Keep in mind that you will only be able to update collections that are owned by your user.**

## Push a resource to a collection

> To add a resource to a collection, you have to do a POST with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/collection/:id/resource \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "type": "dataset",
    "id": "06c44f9a-aae7-401e-874c-de13b7764959"
  }'
```

> Example response:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "New name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": [
          {
            "type": "dataset",
            "id": "06c44f9a-aae7-401e-874c-de13b7764959"
          }
        ]
      }
    }
  ]
}
```

You can do a POST request to the `v1/collection/:id/resource` to push a new resource to an existing collection. You also need to define the following fields in the request body:

| Field             | Description                               | Type
| ------------------|:-----------------------------------------:| -----:
| type              | Type of resource being added              | Text (dataset, layer, widget)
| id                | Id of the resource                        | Text

## Get collections for the request user

> To get all collections of the logged user, you have to do a GET request:

```shell
curl -X GET https://api.resourcewatch.org/v1/collection \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "Collection name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": []
      }
    }
  ]
}
```

By making a GET request to the `v1/collection` endpoint, you can obtain the collections of the logged user.

## Get a collection by id

> To get the collection by id, you have to do a GET request:

```shell
curl -X GET https://api.resourcewatch.org/v1/collection/:id \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "Collection name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": []
      }
    }
  ]
}
```

This endpoint returns the collection with id of the param. If the collection belongs to other user or does not exist, the endpoint returns 400.

## Delete a collection

> To delete the collection by id, you have to do a DELETE request:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/collection/:id \
-H "Authorization: Bearer <your-token>"
```

> In case of success, the deleted collection is returned in the response body:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "Collection name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": []
      }
    }
  ]
}
```

This endpoint deletes the collection with id of the param. If the collection belongs to other user or does not exist, the endpoint returns 400.

## Delete a collection resource

> To delete the resource you have to do a DELETE request:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/collection/:id/resource/:resourceType/:resourceId \
-H "Authorization: Bearer <your-token>"
```

> In case of success, the updated collection is returned in the response body:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "Collection name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": []
      }
    }
  ]
}
```

Using this endpoint you can also delete a resource in a collection with the id, resource type and resource id of the param. If the collection belongs to other user or not exist, the endpoint returns 400.

## Finding collections by ids

> To find collections by ids, you have to do a POST request:

```shell
curl -X POST https://api.resourcewatch.org/v1/collection/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
    "ids": ["5f56170c1fca55001ad51779"],
    "userId": "5dd7b92abf56ca0011875ae2"
  }'
```

> Example response:

```json
{
  "data": [
    {
      "id": "5f56170c1fca55001ad51779",
      "type": "collection",
      "attributes": {
        "name": "Collection name",
        "ownerId": "5dd7b92abf56ca0011875ae2",
        "application": "rw",
        "resources": []
      }
    }
  ]
}
```

> You can also filter the returned results by application:

```shell
curl -X POST https://api.resourcewatch.org/v1/collection/find-by-ids?application=gfw \
-H "Content-Type: application/json"  -d \
 '{
    "ids": ["5f56170c1fca55001ad51779"],
    "userId": "5dd7b92abf56ca0011875ae2"
  }'
```

> Example response:

```json
{
  "data": []
}
```

You can find collections providing an array of ids by making a POST request to the `v1/collection/find-by-ids` endpoint. You must provide in the body of the request the `ids` of the collections you wish to fetch, as well as the id of the user (`userId`) who owns these collections.

You can filter the returned results by application by providing the `application` query parameter.

**Finding collections by id does not require authentication.**
