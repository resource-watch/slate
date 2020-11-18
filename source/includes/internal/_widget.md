# Widget
This section describes some aspects of widget functionality that are only available to other microservices and cannot be invoked by actual API users.
## Updating the env for all widgets for a dataset

> Example PATCH request that sets all widget for the given dataset to the defined env:

```shell
curl -X PATCH "https://api.resourcewatch.org/v1/widget/change-environment/<dataset-id>/<env>" \
-H "Authorization: Bearer <microservice-token>" \
-H "Content-Type: application/json"
```

This endpoint updates the `env` value of all widgets associated with the given dataset id. It's only available to other microservices, and cannot be called directly by an API user. It's currently used when a dataset's `env` value is updated.

The update process is not atomic. A successful request will return a 204 `No content` response.

#### Errors for updating the env for all widgets for a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You need to be logged in to be able to update widgets.
403            | Forbidden      | This endpoint is only available to microservices, through their special token.
404            | Dataset not found | A dataset with the provided id does not exist.

## Cloning widgets from other microservices

```shell
curl -X POST "https://api.resourcewatch.org/v1/widget/<widget_id_or_slug>/clone" \
-H "Authorization: Bearer <microservice-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "userId": "123456789",
}'
```

Before proceeding, please review the [cloning a widget](https://resource-watch.github.io/doc-api/index-rw.html#cloning-a-widget) documentation, as this section covers a special case that builds on top of the functionality described in it.

When cloning a widget, the newly created clone will take the `userId` of the user who issued the clone request. If you call this endpoint directly as a "real" authenticated user, that means it will get that authenticated user's `userId`. 

However, if invoked by another API microservice, the widget microservice will not have access to the token of the user, and will instead receive the internal "microservice" token. In this scenario, you should pass a `userÌd` body value that will be set as the `userId` of the newly created widget. If you do not pass this parameter, the widget will inherit the user id of the internal token. 

Note that the `userId` provided in the clone request body will not be validated - it's up to the microservice issuing the clone request to ensure it's correct.

## Deleting all widgets for a dataset 

> Example DELETE request that deletes all widgets for a dataset:

```shell
curl -X DELETE "https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget" \
-H "Authorization: Bearer <microservice-token>" \
-H "Content-Type: application/json"
```

> Response:

```json
{
    "data": [
        {
            "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
            "type": "widget",
            "attributes": {
                "name": "Example Widget",
                "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
                "slug": "example-widget",
                "userId": "5820ad9469a0287982f4cd18",
                "description": "",
                "source": null,
                "sourceUrl": null,
                "authors": null,
                "application": [
                    "rw"
                ],
                "verified": false,
                "default": false,
                "protected": false,
                "defaultEditableWidget": false,
                "published": true,
                "freeze": false,
                "env": "production",
                "queryUrl": null,
                "widgetConfig": "{}",
                "template": false,
                "layerId": null,
                "createdAt": "2017-02-08T15:30:34.505Z",
                "updatedAt": "2017-02-08T15:30:34.505Z"
            }
        },
        {...}
    ]
}
```

This endpoints allows deleting all widgets for a given dataset id. It's only available to other microservices, and cannot be called directly by an API user. Its currently used when a dataset is deleted, and all its widgets need to be deleted in the process.

Like when deleting a single widget by id, deleting widgets this way will also delete vocabulary tags and metadata associated with the widget, in a non-atomic way, and any failure while deleting those associated elements will also not be reflected on the response.

Unlike when deleting a single widget, when deleting widgets this way, the `protected` value is ignored, and widgets will be deleted even if its value is set to true.

The process of deleting multiple widgets is not atomic. Widgets will be deleted using a random order, and a failure in deleting one of them will produce an error, but already deleted widgets will not be rolled back.

#### Errors for deleting all widgets for a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You need to be logged in to be able to delete widgets.
403            | Forbidden      | This endpoint is only available to microservices, through their special token.
404            | Dataset not found | A dataset with the provided id does not exist.
