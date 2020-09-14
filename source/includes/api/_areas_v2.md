# Areas v2

## What is an area?

Areas is a service provided by the RW API which allows you to define geographic areas of interest. Areas can be defined in multiple ways, such as selecting a whole country or region as your area of interest, a protected area from WDPA, or reference a custom geostore ID from the [Geostore service](#geostore).

With your areas of interest, you can then choose to be notified about events that happen inside your area of interest, such as deforestation alerts (GLAD alerts) or fire alerts (VIIRS fire alerts). You can also choose to receive a monthly summary of both GLAD and VIIRS alerts in your area of interest, which will arrive in your inbox at the first day of every month.

## What is the difference between v1 and v2?

v2 areas are an upgrade in the functionality of areas and provide you with an easier-to-use interface for creating areas of interest. Features such as the notification of alerts inside you area of interest are also only available in v2 endpoints.

However, keep in mind that v2 areas endpoints were built with the intention of merging together [**v1 areas of interest**](/index-rw.html#areas) and [**subscriptions**](/index-rw.html#subscriptions). This means, in practice, that if your users already had v1 areas or subscriptions previously created, they will show up as v2 areas when requesting data from the v2 endpoints.

This also means that, if your application was already using either subscriptions or v1 areas, you can safely transition into v2 areas while keeping the legacy v1 areas and subscriptions that your users have created.

Below the documentation of each endpoint, you'll be able to find a **implementation details** section that goes into detail on how this synchronization is performed.

## Getting all user areas

> Example request to get all areas for the logged user:

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
                "email": "your.email@resourcewatch.org",
                "language": "en"
            }
        }
    ]
}
```

The `v2/areas` endpoint returns all the areas of interest associated with the user who made the request. 

**This endpoint requires authentication, and it will return 401 Unauthorized if none is provided.**

For a detailed description of each field, check out the [Area reference](#area-reference) section.

### Pagination

Pagination is not applied when requesting all of the areas for the logged user, so all of the logged user's areas are returned in every call of the `v2/areas` endpoint.

### Filters

> Filtering areas

```shell
curl -X GET https://api.resourcewatch.org/v2/area?application=rw&public=true
```

The `v2/areas` endpoint provides the following parameters to tailor the returned listing:

Field       |             Description                                                                                                                          | Type    | Example    |
----------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | ------: | ---------: |
application | Filter results by the application associated with the areas.                                                                                     | String  | 'gfw'      |
status      | Filter results by the status of the area.                                                                                                        | String  | 'saved'    |
public      | Filter results by the privacy status of the area.                                                                                                | Boolean | true       |
all         | Return all the areas instead of just the areas associated with user of the request. This filter will only be taken into account for ADMIN users. | Boolean | true       |

### Implementation details

Finds all areas for the user who requested the list of areas. For each area, if it has an associated subscription (i.e. the `subscriptionId` field of the area is not empty), it merges the subscription data over the area data, returning it as a single object. After that, the remaining user subscriptions are converted to area objects and returned.

## Getting all areas

> Example request to get ALL areas (only available for ADMIN users):

```shell
curl -X GET https://api.resourcewatch.org/v2/area?all=true
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
                "email": "your.email@resourcewatch.org",
                "language": "en"
            }
        }
    ],
    "links": {
        "self": "http://api.resourcewatch.org/v2/area?all=true&page[number]=1&page[size]=10",
        "first": "http://api.resourcewatch.org/v2/area?all=true&page[number]=1&page[size]=10",
        "last": "http://api.resourcewatch.org/v2/area?all=true&page[number]=1&page[size]=10",
        "prev": "http://api.resourcewatch.org/v2/area?all=true&page[number]=1&page[size]=10",
        "next": "http://api.resourcewatch.org/v2/area?all=true&page[number]=1&page[size]=10"
    },
    "meta": {
        "total-pages": 1,
        "total-items": 1,
        "size": 10
    }
}
```

The same `v2/areas` endpoint, used to retrieve all of the logged user's areas, can be used to retrieve ALL areas (for all users). To trigger this behavior, all you need to do is provide the `all=true` flag as a query parameter - **keep in mind this option will only be taken into account for ADMIN users** (i.e. if the logged user is not an ADMIN, the `all=true` flag is ignored and the logged user's areas are returned).

For a detailed description of each field, check out the [Area reference](#area-reference) section.

### Pagination

> Custom pagination: load page 2 using 25 results per page

```shell
curl -X GET https://api.resourcewatch.org/v2/area?page[number]=2&page[size]=25
```

Due to performance and memory management issues, when viewing all areas (using the `v2/areas` endpoint with the `all=true` query parameter), the returned result is paginated. You can customize this behavior using the following query parameters:

Field       |             Description                                                                                                                          | Type    | Example    |
----------- | :----------------------------------------------------------------------------------------------------------------------------------------------: | ------: | ---------: |
page[number]| The number of the page to fetch. Only taken into account when using the `all=true` filter.                                                       | Number  | 1          |
page[size]  | The size of the page to fetch. Only taken into account when using the `all=true` filter. Maximum value is 100.                                   | Number  | 10         |

### Filters

> Filtering areas

```shell
curl -X GET https://api.resourcewatch.org/v2/area?application=rw&public=true
```

The filters for this endpoint are the same as the `v2/areas` endpoint described above:

Field       |             Description                                                                                                                          | Type    | Example    |
----------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | ------: | ---------: |
application | Filter results by the application associated with the areas.                                                                                     | String  | 'gfw'      |
status      | Filter results by the status of the area.                                                                                                        | String  | 'saved'    |
public      | Filter results by the privacy status of the area.                                                                                                | Boolean | true       |
all         | Return all the areas instead of just the areas associated with user of the request. This filter will only be taken into account for ADMIN users. | Boolean | true       |

### Implementation details

If the `all=true` query filter is provided, the `/find-all` endpoint of the Subscriptions service is used to find all existing subscriptions (for all users).

Then, for each area in the Areas service database, if it has an associated subscription (i.e. the `subscriptionId` field of the area is not empty), it merges the subscription data over the area data, returning it as a single object. After that, the remaining subscriptions are converted to area objects and returned.

## Getting an area by its id

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

If you know the id or the slug of a area, then you can access it directly - keep in mind the id search is case-sensitive.

**This endpoint requires authentication, and it will return 401 Unauthorized if none is provided.**

If the area has the `public` attribute set to `false`, you will only be able to fetch its information if you are the owner of the area. Otherwise, a `401 Unauthorized` response will be returned.

If the area has the `public` attribute set to `true` and the user who requests it is not the owner, some information will be hidden for privacy reasons.

### Implementation details

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

Use this endpoint to create new areas. For a detailed description of each field that can be provided in the body of the request, check out the [Area reference](#area-reference) section.

Keep in mind that you should provide one of the following when creating an area:

* `geostore` with the ID of a geostore object if you are creating an area that references a geostore;
* `wdpaid` with the ID of a protected area if you are creating an area that references a protected area;
* `iso` object with a valid country/region/subregion if you are creating an area that references an admin country/region/subregion;
* `use` object with valid id and name of a land use concessioned area, if you are creating an area that references a land use area.

**This endpoint requires authentication, and it will return 401 Unauthorized if none is provided.**

### Errors for creating an area

Error code     | Error message (example)     | Description
-------------- | --------------------------- | ------------------------------------------------------------
400            | `<field> can not be empty.` | You are missing a required field while creating the area.
400            | `<field> is not valid.`     | You provided an invalid field while creating the area.
401            | `Unauthorized`              | No token was provided.

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
* `subscriptions_url` : the URL for managing areas of interest in the flagship application (example: [https://staging.globalforestwatch.org/my-gfw](https://staging.globalforestwatch.org/my-gfw)).
* `dashboard_link` : the URL for the area dashboard (example: [https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2)).
* `map_link` : the "view on map" URL for this area (example: [https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2)).
* `image_url` : the URL for the image associated with the area.
* `tags` : a string containing the AOI tags, comma-separated.

(`5d517b3fb8cfd4001061d0b2` is an example of an area ID).

### Implementation details

POST of a new area always starts by creating the area. Then, taking into account the area attributes, it might also create a subscription which will then be associated with the area. The area's `subscriptionId` attribute will then be updated with the id of the created subscription if that's the case. The created area is then returned.

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

Use this endpoint to update an existing area. For a detailed description of each field that can be provided in the body of the request, check out the [Area reference](#area-reference) section.

Keep in mind that you should provide one of the following when updating an area:

* `geostore` with the ID of a geostore object if you are updating an area that references a geostore;
* `wdpaid` with the ID of a protected area if you are updating an area that references a protected area;
* `iso` object with a valid country/region/subregion if you are updating an area that references an admin country/region/subregion;
* `use` object with valid id and name of a land use concessioned area, if you are updating an area that references a land use area.

**This endpoint requires authentication and, in order to PATCH an area, you need to be either the owner of the area or be an ADMIN user.**

### Errors for updating an area

Error code     | Error message (example)       | Description
-------------- | ----------------------------- | --------------
400            | `name can not be empty.`      | You are missing a required field while creating the area.
400            | `application cannot be empty` | You provided an invalid field while creating the area.
401            | `Unauthorized`                | No token was provided.
404            | `Area not found`              | The area with id provided does not exist.

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

### Implementation details

DELETing an area deletes the area if it exists, and then if an associated subscription exists, it is also deleted.

If the ID of a subscription is provided, then that subscription is deleted.

## Update areas by geostore

> Example request to update all areas that reference geostores with ids "123" and "234":

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

After updating the areas, for each area that was updated which has a valid email associated and its status updated to `saved`, an email will be sent to the user to let them know that the area is ready to be viewed.

The following parameters are provided to the email service and can be used in the construction of the email:

* `id` : the ID of the area.
* `name` : the name of the area.
* `location` : an alias for the name of the area (contains the same as the `name` parameter).
* `subscriptions_url` : the URL to manage the areas in the frontend (example: [https://staging.globalforestwatch.org/my-gfw](https://staging.globalforestwatch.org/my-gfw)).
* `dashboard_link` : the link to the area dashboard (example: [https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2)).
* `map_link` : the "view on map" for the area (example: [https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2](https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2)).
* `image_url` : the URL for the image associated with the area.
* `tags` : a string containing the AOI tags, comma-separated.

## Sync areas

```shell
curl -X POST https://api.resourcewatch.org/v2/area/sync
-H "Authorization: Bearer <your-token>" \
```

> Example response:

```json
{
    "data": {
        "syncedAreas": 8,
        "createdAreas": 0
    }
}
```

> Example snippet that synchronizes the areas before fetching the information of ALL areas:

```javascript
// First call the sync endpoint
await request.post('v2/area/sync');

// Then call the get endpoint while there are more pages to find
var results = [];
var hasNextPage = true;
var pageNumber = 1;
while (hasNextPage) {
   var res = await request.get('v2/area?all=true&page[number]=' + pageNumber);
   results = results.concat(res.data);
   pageNumber++;
   hasNextPage = res.links.self === res.links.last;
}
```

Use this endpoint to synchronize each area information with the associated subscription. The usage of this endpoint is recommended if you are performing update processes that rely on updated subscription information for the areas.

This endpoint supports the following query parameters to control the execution of the sync:

Field       |             Description                              |   Type | Example |
----------- | :--------------------------------------------------: | -----: | ------: |
startDate   | The date from which the sync will be executed. All subscriptions that have been updated since this date will be synced with the existing areas. | String | 2020-03-18T09:45:56.476Z
endDate     | The date until which the sync will be executed. All subscriptions that have been updated until this date will be synced with the existing areas. | String | 2020-03-25T09:45:56.476Z

*Note: By default, the sync is done for the last week changes (i.e. the default value for the `startDate` parameter is one week ago and the default value for the `endDate` parameter is now).*

## Area reference

This section gives you a complete view at the properties that are maintained as part of an area. When interacting with an area (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/gfw-api/gfw-area/blob/develop/app/src/models/area.modelV2.js).

Field name     | Type    | Required            | Default value | Description |
-------------- | ------- | ------------------- |-------------- | ----------- | 
id             | String  | Yes (autogenerated) |               | Unique Id of the area. Auto generated on creation. Cannot be modified by users.    
name           | String  | No                  |               | Name of the area.
application    | String  | Yes                 | 'gfw'         | The application this area belongs to.  
geostore       | String  | No                  |               | If this area references a geostore, the ID of the geostore will be saved in this field.     
wdpaId         | String  | No                  |               | If this area references a WDPA, the ID of the WDPA will be saved in this field.     
userId         | String  | Yes (autopopulated) |               | Id of the user who owns the area. Set automatically on creation. Cannot be modified by users.
use            | Object  | No                  |               | If this area references a land use concession, this field will contain an object that identifies the concrete area referred.
use.id         | String  | No                  |               | The ID of the land use concession to track.
use.name       | String  | No                  |               | The name of the land use concession to track (example: `logging`).
iso            | Object  | No                  |               | If this area references an admin country or region, this field will contain an object that identifies the concrete area referred.
iso.country    | String  | No                  |               | The 3-letter ISO code of the country being referred by this area.
iso.region     | String  | No                  |               | An ID of the region inside the country to reference (optional, you can reference the whole country, or just on specific region of the country).
iso.subregion  | String  | No                  |               | An ID of the subregion inside the region to reference (optional, you can reference the whole region, or just on specific subregion of the region).
admin          | Object  | No                  |               | Alternative syntax, see the `iso` field above.
admin.adm0     | String  | No                  |               | Alternative syntax, see the `iso.country` field above.
admin.adm1     | String  | No                  |               | Alternative syntax, see the `iso.region` field above.
admin.adm2     | String  | No                  |               | Alternative syntax, see the `iso.subregion` field above.
image          | String  | No                  |               | URL for an image representative of the area of interest.
templateId     | String  | No                  |               | ?
tags           | Array   | Yes                 | []            | Array of string tags that can be used to categorize areas.
status         | String  | Yes                 | 'pending'     | The status of the area - can be one of `pending`, `saved` or `failed`. Cannot be modified by users. Initially, it is set as `pending`. Once all the data for the area is crunched and ready to be read, the status is updated to `saved` and an email is sent to the user. If errors occur, the status is set to `failed`.
public         | Boolean | Yes                 | false         | If the area is public or private. Public area information can be accessed by other users.
fireAlerts     | Boolean | Yes                 | false         | If the area subscribes to notifications on fire alerts - set this field to true if you wish to be notified about fire alerts in your area of interest.
deforestationAlerts | Boolean | Yes                 | false         | If the area subscribes to notifications on deforestation alerts - set this field to true if you wish to be notified about deforestation alerts in your area of interest.
monthlySummary | Boolean | Yes                 | false         | If the area subscribes to monthly summary notifications - set this field to true if you wish to be notified monthly about deforestation and fire alerts in your area of interest.
email          | String  | No                  |               | The email that will be used as receiver of the notification emails.
webhookUrl     | String  | No                  |               | Instead of receiving an email as notification, you can choose to receive a hit in the webhook URL you set in this field.
language       | String  | No                  | 'en'          | The language in which you wish to receive the email notifications. `en`, `fr`, `zh`, `id`, `pt-br` or `es-mx` are the supported values for this field. If any other value is provided, `en` is automatically set.
subscriptionId | String  | No                  |               | If an area is returned as the reflection of an existing subscription in the Subscriptions service, this field will contain the ID of the corresponding subscription.
createdAt      | Date    | No (autogenerated)  | now           | Automatically maintained date of when the area was created. Cannot be modified by users.
updatedAt      | Date    | No (autogenerated)  | now           | Automatically maintained date of when the area was last updated. Cannot be modified by users.
