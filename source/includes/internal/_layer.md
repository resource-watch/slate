# Layer

## Updating the env for all layers for a dataset

> Example PATCH request that sets all layer for the given dataset to the defined env:

```shell
curl -X PATCH "https://api.resourcewatch.org/v1/layer/change-environment/<dataset_id>/<env>" \
-H "Authorization: Bearer <microservice-token>" \
-H "Content-Type: application/json"
```

This endpoints updates the `env` value of all layers associated with the given dataset id. It's only available to other microservices, and cannot be called directly by an API user. Its currently used when a dataset's `env` value is updated.

The update process is not atomic. A successful request will return a 204 `No content` response.

#### Errors for updating the env for all layers for a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You need to be logged in to be able to update layers.
403            | Forbidden      | This endpoint is only available to microservices, through their special token.
404            | Dataset not found | A dataset with the provided id does not exist.


## Deleting all layers for a dataset 

> Example DELETE request that deletes all layers for a dataset:

```shell
curl -X DELETE "https://api.resourcewatch.org/v1/dataset/<dataset_id>/layer" \
-H "Authorization: Bearer <microservice-token>" \
-H "Content-Type: application/json"
```

> Response:

```json
{
    "data": [
        {
            "id": "bd8a36df-2e52-4b2d-b7be-a48bdcd7c769",
            "type": "layer",
            "attributes": {
                "name": "Water stress",
                "slug": "Water-stress_7",
                "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                "description": "water stress",
                "application": [
                    "rw"
                ],
                "iso": [],
                "userId": "5dbadb06df2dc74d2ad054fb",
                "default": false,
                "protected": false,
                "published": true,
                "env": "production",
                "layerConfig": {},
                "legendConfig": {},
                "interactionConfig": {},
                "applicationConfig": {},
                "staticImageConfig": {},
                "createdAt": "2020-06-04T14:28:24.575Z",
                "updatedAt": "2020-06-04T14:28:24.575Z"
            }
        }, 
        {...}
    ]
}
```

This endpoints allows deleting all layers for a given dataset id. It's only available to other microservices, and cannot be called directly by an API user. Its currently used when a dataset is deleted, and all its layers need to be deleted in the process.

Like when deleting a single layer by id, deleting layers this way will also delete vocabulary tags and metadata associated with the layer, in a non-atomic way, and any failure while deleting those associated elements will also not be reflected on the response.

Unlike when deleting a single layer, when deleting layers this way, the `protected` value is ignored, and layers will be deleted even if its value is set to true.

The process of deleting multiple layers is not atomic. Layers will be deleted using a random order, and a failure in deleting one of them will produce an error, but already deleted layers will not be rolled back.

#### Errors for deleting all layers for a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You need to be logged in to be able to delete layers.
403            | Forbidden      | This endpoint is only available to microservices, through their special token.
404            | Dataset not found | A dataset with the provided id does not exist.
