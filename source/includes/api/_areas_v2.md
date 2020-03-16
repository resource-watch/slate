# Areas v2

The following endpoints merge together **areas of interest** and **subscriptions**. This means they can be used to transition away from subscriptions without the users losing the subscriptions that they have already created.

Please ensure that you are using `v2` in the URL when requesting these endpoints.

## Getting all user areas

```shell
curl -X GET https://api.resourcewatch.org/v2/area
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
    "data": [
        {
            "type": "area",
            "id": "5e4d74c3ef240412c2d56a71",
            "attributes": {
                "application": "gfw",
                "userId": "5e2f0eaf9de40a6c87dd9b7d",
                "createdAt": "2020-02-19T12:17:01.176Z",
                "datasets": [],
                "use": {},
                "iso": {},
                "admin": {},
                "tags": [],
                "status": "saved",
                "public": false,
                "fireAlerts": false,
                "deforestationAlerts": false,
                "webhookUrl": "",
                "monthlySummary": false,
                "subscriptionId": "5e4d273dce77c53768bc24f9",
                "email": "tiago.garcia@vizzuality.com",
                "language": "en"
            }
        }
    ]
}
```

Returns the list of areas for the user who made the request. This endpoint requires authentication.

This endpoint supports the following query parameters as filters:

Field       |             Description                                                                                                                          | Type    | Example    |
----------- | :----------------------------------------------------------------------------------------------------------------------------------------------: | ------: | ---------: |
application | Filter results by the application associated with the areas.                                                                                     | String  | 'gfw'      |
status      | Filter results by the status of the area.                                                                                                        | String  | 'saved'    |
public      | Filter results by the privacy status of the area.                                                                                                | Boolean | true       |
all         | Return all the areas instead of just the areas associated with user of the request. This filter will only be taken into account for ADMIN users. | Boolean | true       |

**Implementation details**

Finds all areas for the user who requested the list of areas. For each area, if it has an associated subscription (i.e. the `subscriptionId` field of the area is not empty), it merges the subscription data over the area data, returning it as a single object. After that, the remaining user subscriptions are converted to area objects and returned.

It is important to note that if the `all=true` query filter is provided, then the `/find-all` endpoint of the subscriptions is used to find all existing subscriptions.

## Getting a single user area

```shell
curl -X GET https://api.resourcewatch.org/v2/area/:id
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
    "data": {
        "type": "area",
        "id": "5e4d787bef240412c2d56a74",
        "attributes": {
            "application": "gfw",
            "userId": "5e2f0eaf9de40a6c87dd9b7d",
            "createdAt": "2020-02-19T12:17:01.176Z",
            "datasets": [],
            "use": {},
            "iso": {},
            "admin": {},
            "tags": [],
            "status": "saved",
            "public": false,
            "fireAlerts": false,
            "deforestationAlerts": false,
            "webhookUrl": "",
            "monthlySummary": false,
            "subscriptionId": "5e4d273dce77c53768bc24f9",
            "email": "tiago.garcia@vizzuality.com",
            "language": "en"
        }
    }
}
```

Returns the information for the area with the id provided. This endpoint requires authentication.

If the area has the `public` attribute set to `false`, you will only be able to fetch its information if you are the owner of the area. Otherwise, a `401 Unauthorized` response will be returned.

If the area has the `public` attribute set to `true` and the user who requests it is not the owner, some information will be hidden for privacy reasons.

**Implementation details**

Try to find an area with the id provided:

1. If the area exists:
   1. If the area has an associated subscription, the subscription is fetched, its data is merged over the area and the result is returned.
   2. If the area has no subscription associated, the area data is returned.
2. If the area does not exist:
   1. Try to find a subscription with the id provided. If it exists, it is returned as an area object, if not, a `404 Not Found` error is returned.

## Creating an area

```shell
curl -X POST https://api.resourcewatch.org/v2/area
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
 '{
    "name": "Example area",
    "application": "gfw",
    "image": "",
    "tags": [],
    "public": false,
    "fireAlerts": true,
    "deforestationAlerts": true,
    "webhookUrl": "http://example.com",
    "monthlySummary": true,
    "email": "youremail@resourcewatch.org",
    "language": "en"
}'
```

> Example response:

```json
{
    "data": {
        "type": "area",
        "id": "5e4d7c47ef240412c2d56a78",
        "attributes": {
            "name": "Example area",
            "application": "gfw",
            "wdpaid": null,
            "userId": "5e2f0eaf9de40a6c87dd9b7d",
            "createdAt": "2020-02-19T18:19:51.485Z",
            "image": "",
            "datasets": [],
            "tags": [],
            "status": "pending",
            "public": false,
            "fireAlerts": true,
            "deforestationAlerts": true,
            "webhookUrl": "http://example.com",
            "monthlySummary": true,
            "subscriptionId": "5e4d7c47dd8fa31290d548ae",
            "email": "youremail@resourcewatch.org",
            "language": "en"
        }
    }
}
```

Use this endpoint to create new areas. This endpoint requires authentication.

This endpoint supports the following request body parameters:

Field                |             Description                                                                            | Type    | Example    |
-------------------- | :------------------------------------------------------------------------------------------------: | ------: | ---------: |
name                 | The name of the area being created.                                                                | String  | 'Example'  |
image                | Image associated with the dataset - in GET areas, this attribute will have the URL for the image.  | String  | https://www.google.com/example.jpg |
application          | The application to which this area is associated with. Defaults to 'gfw'.                          | String  | 'gfw'      |
language             | The language of this area. Defaults to 'en'.                                                       | String  | 'es'       |
geostore             | An ID of a geostore to which this area relates to.                                                 | String  | '123'      |
public               | If the area is public or not. Defaults to false.                                                   | Boolean | true       |
fireAlerts           | If the area is intended to subscribe to fire alerts. Defaults to false.                            | Boolean | true       |
deforestationAlerts  | If the area is intended to subscribe to deforestation alerts. Defaults to false.                   | Boolean | true       |
monthlySummary       | If the area is intended to subscribe to monthly summaries. Defaults to false.                      | Boolean | true       |
email                | Email to be provided to the subscription.                                                          | String  | youremail@resourcewatch.org |
webhookUrl           | Webhook URL to be provided to the subscription (only used in case the email is not set).           | String  | https://www.google.com/ |
status               | The status of the area - either 'saved' or 'pending'. Read-only attribute.                         | String  | 'saved'    |
subscriptionId       | The ID of the subscription associated with this area. Read-only attribute.                         | String  | 5e4d7c47dd8fa31290d548ae |

### Email notification

According to multiple factors (including the `geostore` that is associated with the area, if the area subscribes to `fireAlerts`, `deforestationAlerts`, etc.), there might be a period of time in which the data for the area is being generated. While that is the case, the area will have `status` set to `'pending'`. Once the area data is ready, the `status` of the area will be updated to `'saved'`.

After creating an area, if the `email` field of the area has a valid email, an email is sent to the user. The email content varies according to the status of the area:

* If the area has status `saved`, an email is sent to let the user know the area of interest is ready to be viewed.
* If the area has status `pending`, an email is sent to let the user know the area of interest is being generated and will be available later.

### Email substitution parameters

The following parameters are provided to the email service and can be used in the construction of the email:

* `id` : the ID of the area.
* `name` : the name of the area.
* `location` : an alias for the name of the area (contains the same as the `name` parameter).
* `subscriptions_url` : the URL to manage the areas in the frontend (example: [https://staging.globalforestwatch.org/my-gfw](https://staging.globalforestwatch.org/my-gfw)).
* `dashboard_link` : the link to the area dashboard (example: [https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2)).
* `map_link` : the "view on map" for the area (example: [https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2)).
* `image_url` : the URL for the image associated with the area.
* `tags` : a string containing the AOI tags, comma-separated.

(`5d517b3fb8cfd4001061d0b2` is an example of an area ID).

### Implementation details

POST of a new area always starts by creating the area and, taking into account the area attributes, it might also create a subscription which will then be associated with the area. The area's `subscriptionId` attribute will then be updated with the id of the created subscription if that's the case. The created area is then returned.

The subscription is created only if the area has selected set to `true` at least one of the following attributes:

* deforestationAlerts
* fireAlerts
* monthlySummary

## Updating an area

```shell
curl -X PATCH https://api.resourcewatch.org/v2/area/:id
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
 '{
    "name": "Example area",
    "application": "gfw",
    "image": "",
    "tags": [],
    "public": false,
    "fireAlerts": true,
    "deforestationAlerts": true,
    "webhookUrl": "http://example.com",
    "monthlySummary": true,
    "email": "youremail@resourcewatch.org",
    "language": "en"
}'
```

> Example response:

```json
{
    "data": {
        "type": "area",
        "id": "5e4d7c47ef240412c2d56a78",
        "attributes": {
            "name": "Example area",
            "application": "gfw",
            "wdpaid": null,
            "userId": "5e2f0eaf9de40a6c87dd9b7d",
            "createdAt": "2020-02-19T18:19:51.485Z",
            "image": "",
            "datasets": [],
            "tags": [],
            "status": "pending",
            "public": false,
            "fireAlerts": true,
            "deforestationAlerts": true,
            "webhookUrl": "http://example.com",
            "monthlySummary": true,
            "subscriptionId": "5e4d7c47dd8fa31290d548ae",
            "email": "youremail@resourcewatch.org",
            "language": "en"
        }
    }
}
```

Use this endpoint to update an existing area. This endpoint requires authentication and, in order to PATCH an area, you need to be either the owner of the area or be an ADMIN user.

This endpoint supports the following request body parameters:

Field                |             Description                                                                            | Type    | Example    |
-------------------- | :------------------------------------------------------------------------------------------------: | ------: | ---------: |
name                 | The name of the area being created.                                                                | String  | 'Example'  |
image                | Image associated with the dataset - in GET areas, this attribute will have the URL for the image.  | String  | https://www.google.com/example.jpg |
application          | The application to which this area is associated with. Defaults to 'gfw'.                          | String  | 'gfw'      |
language             | The language of this area. Defaults to 'en'.                                                       | String  | 'es'       |
geostore             | An ID of a geostore to which this area relates to.                                                 | String  | '123'      |
public               | If the area is public or not. Defaults to false.                                                   | Boolean | true       |
fireAlerts           | If the area is intended to subscribe to fire alerts. Defaults to false.                            | Boolean | true       |
deforestationAlerts  | If the area is intended to subscribe to deforestation alerts. Defaults to false.                   | Boolean | true       |
monthlySummary       | If the area is intended to subscribe to monthly summaries. Defaults to false.                      | Boolean | true       |
email                | Email to be provided to the subscription.                                                          | String  | youremail@resourcewatch.org |
webhookUrl           | Webhook URL to be provided to the subscription (only used in case the email is not set).           | String  | https://www.google.com/ |
status               | The status of the area - either 'saved' or 'pending'. Read-only attribute.                         | String  | 'saved'    |
subscriptionId       | The ID of the subscription associated with this area. Read-only attribute.                         | String  | 5e4d7c47dd8fa31290d548ae |

### Email notification

According to multiple factors (including the `geostore` that is associated with the area, if the area subscribes to `fireAlerts`, `deforestationAlerts`, etc.), there might be a period of time in which the data for the area is being generated. While that is the case, the area will have `status` set to `'pending'`. Once the area data is ready, the `status` of the area will be updated to `'saved'`.

After updating an area, if it has status `saved` and if the `email` field of the area has a valid email, an email is sent to the user, to let him know the area of interest is ready to be viewed.

### Email substitution parameters

The following parameters are provided to the email service and can be used in the construction of the email:

* `id` : the ID of the area.
* `name` : the name of the area.
* `location` : an alias for the name of the area (contains the same as the `name` parameter).
* `subscriptions_url` : the URL to manage the areas in the frontend (example: [https://staging.globalforestwatch.org/my-gfw](https://staging.globalforestwatch.org/my-gfw)).
* `dashboard_link` : the link to the area dashboard (example: [https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2)).
* `map_link` : the "view on map" for the area (example: [https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2)).
* `image_url` : the URL for the image associated with the area.
* `tags` : a string containing the AOI tags, comma-separated.

(`5d517b3fb8cfd4001061d0b2` is an example of an area ID).

### Implementation details

PATCHing an area is a bit more complex, and it comes down to 3 major cases:

1. The area already exists and has subscriptions preference (`deforestationAlerts`, `fireAlerts` or `monthlySummary` set to true) in the request data:
   1. If the area doesn't have a subscription associated, a new one is created and associated.
   2. If the area already had a subscription, then the subscription is PATCHed according to the data provided in the request body.
2. The area already exists and doesn’t has subscription preferences (`deforestationAlerts`, `fireAlerts` or `monthlySummary` set to true) in the request data:
   1. If the area had a subscription associated, then the subscription associated is deleted.
   2. Otherwise, just save the area.
3. The area doesn’t exist because on the fetch it returned a mapped subscription (meaning we are PATCHing an area using the ID of a subscription):
   1. First, create a new area, and then:
      1. If the request data has subscriptions preference (`deforestationAlerts`, `fireAlerts` or `monthlySummary` set to true), also PATCH the subscription.
      2. If the request data doesn't have subscriptions preference (`deforestationAlerts`, `fireAlerts` or `monthlySummary` set to true), delete the associated subscription.

## Deleting an area

```shell
curl -X DELETE https://api.resourcewatch.org/v2/area/:id
-H "Authorization: Bearer <your-token>" \
```

> Returns 204 No Content in case of success.

Use this endpoint to delete an existing area. This endpoint requires authentication and, in order to DELETE an area, you need to be either the owner of the area or be an ADMIN user.

**Implementation details**

DELETing an area deletes the area if it exists, and then if an associated subscription exists, it is also deleted.

If the ID of a subscription is provided, then that subscription is deleted.

## Update areas by geostore

```shell
curl -X POST https://api.resourcewatch.org/v2/area/update
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
 '{
    "geostores": ["123", "234"],
    "update_params": {
        "status": "saved",
        "name": "Updated Area"
    }
}'
```

> Example response:

```json
{
    "data": [
        {
            "type": "area",
            "id": "5e4d74c3ef240412c2d56a71",
            "attributes": {
                "application": "gfw",
                "userId": "5e2f0eaf9de40a6c87dd9b7d",
                "createdAt": "2020-02-19T12:17:01.176Z",
                "datasets": [],
                "use": {},
                "iso": {},
                "admin": {},
                "tags": [],
                "status": "saved",
                "public": false,
                "fireAlerts": false,
                "deforestationAlerts": false,
                "webhookUrl": "",
                "monthlySummary": false,
                "subscriptionId": "5e4d273dce77c53768bc24f9",
                "email": "tiago.garcia@vizzuality.com",
                "language": "en"
            }
        }
    ]
}
```

Use this endpoint to batch update multiple areas that are associated with one of the geostore ids provided in the request body. In order to use this endpoint, you need to be authenticated as an ADMIN user.

You can use the `update_params` field of the request body to specify multiple fields to update on the areas that belong to the geostore ids provided in the body. Keep in mind that the same validations as when updating an area are applied. If a validation fails, the request will fail with `400 Bad Request` and no area will be updated.

In case of success a 200 OK response is returned, and all the areas that match the update criteria (belonging to one of the geostores provided in the request body) will be returned.

After updating the areas, for each area that was updated (if it has a valid email associated), an email will be sent to the user to let them know that the area is ready to be viewed.

The following parameters are provided to the email service and can be used in the construction of the email:

* `id` : the ID of the area.
* `name` : the name of the area.
* `location` : an alias for the name of the area (contains the same as the `name` parameter).
* `subscriptions_url` : the URL to manage the areas in the frontend (example: [https://staging.globalforestwatch.org/my-gfw](https://staging.globalforestwatch.org/my-gfw)).
* `dashboard_link` : the link to the area dashboard (example: [https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2)).
* `map_link` : the "view on map" for the area (example: [https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2)).
* `image_url` : the URL for the image associated with the area.
* `tags` : a string containing the AOI tags, comma-separated.
