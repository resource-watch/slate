# Collections

The users can save a collection of resources in the API.

<aside class="notice">
Remember — All favorite endpoints need to be authenticated.
</aside>


| Field             | Description                                                                     | Type
| ------------------|:-----------------------------------------:                                      | -----:
| name              | Name of collection owner                                                        | Text
| ownerId           | Id of the owner                                                                 | Text
| resources         | Resources in the collection                                                     | Array of Objects
| --- type          | The type of resource                                                            | Text (dataset, layer, widget)
| --- id            | The id of the reource                                                           | Text



## Create Collection

To create a collection, you need to define all next fields in the request body. The required fields that compose a collection are:

| Field             | Description                                                                     | Type
| ------------------|:-----------------------------------------:                                      | -----:
| name              | Name of collection owner                                                        | Text
| ownerId           | The id of the owner                                                             | Text


> To create an empty collection, you have to do a POST with the following body:


```shell
curl -X POST https://api.resourcewatch.org/v1/collection \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "ownerId": "<ownerId>"
  }'
```

> You can also add a resource in the body of the request when creating a new collection with the following body:


```shell
curl -X POST https://api.resourcewatch.org/v1/collection \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "ownerId": "<ownerId>",
   "resources": [
     {
      "type": "<type>",
      "id": "<id>"
      }
   ]
  }'
```

## Add Resource to Collection

To create a collection, you need to define all next fields in the request body. The required fields that compose a collection are:

| Field             | Description                                                                     | Type
| ------------------|:-----------------------------------------:                                      | -----:
| type              | Type of resource being added                                                    | Text (dataset, layer, widget)
| id                | Id of the resource                                                              | Text


> To add a resource to a collection, you have to do a POST with the following body:


```shell
curl -X POST https://api.resourcewatch.org/v1/collection/:id/resource \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "type": "<type>",
   "id": "<id>"
  }'
```

## Get Collections

This endpoint returns the collections of the logged user.

> To get all collections of the logged user, you have to do a GET request:


```shell
curl -X GET https://api.resourcewatch.org/v1/collection \
-H "Authorization: Bearer <your-token>"
```

## Get Collection by id

This endpoint returns the collection with id of the param. If the collection belongs to other user or not exist, the endpoint returns 400.

> To get the collection by id, you have to do a GET request:


```shell
curl -X GET https://api.resourcewatch.org/v1/collection/:id \
-H "Authorization: Bearer <your-token>"
```

## Delete Collection

This endpoint deletes the collection with id of the param. If the collection belongs to other user or not exist, the endpoint returns 400.

> To delete the collection by id, you have to do a DELETE request:


```shell
curl -X DELETE https://api.resourcewatch.org/v1/collection/:id \
-H "Authorization: Bearer <your-token>"
```

## Delete Collection Resource

Using this endpoint you can also delete a resource in a collection with the id, resource type and resource id of the param. If the collection belongs to other user or not exist, the endpoint returns 400.

> To delete the resource you have to do a DELETE request:


```shell
curl -X DELETE https://api.resourcewatch.org/v1/collection/:id/resource/:resourceType/:resourceId \
-H "Authorization: Bearer <your-token>"
```
