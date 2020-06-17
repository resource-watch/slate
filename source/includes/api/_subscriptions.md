# Subscriptions

## What is a subscription?

A subscription allows you to subscribe and get notified of updates on a datasets' data. We strongly recommend that you read the [dataset concept](#dataset) and [dataset endpoint](#dataset6) sections before proceeding.

In the following sections, you will understand how you can interact and manage subscriptions using the RW API, and use them to get notified via email or webhook of updates to the data of datasets. We will also dive into the process of confirming subscriptions, as well as how to unsubscribe a given subscription.

## Subscribable datasets

> Example of a subscribable dataset

```json
{
  "name": "Example dataset",
  "application": ["app"],
  "provider": "carto",
  ...
  "subscribable": {
    "test": {
      "dataQuery": "SELECT * FROM dataset-name  WHERE 'reported_date' >= '{{begin}}' AND 'reported_date' <= '{{end}}' AND 'number_dead' > 0 ORDER BY reported_date DESC LIMIT 10",
      "subscriptionQuery": "SELECT COUNT(*) FROM dataset-name WHERE 'reported_date' >= '{begin}' AND 'reported_date' <= '{end}' AND 'number' > 0"
    }
  }
}
```

In order to create a subscription for a given dataset, the dataset must be prepared to accept subscriptions. This can be achieved by declaring some queries in the  `subscribable` property of a dataset.

Inside the `subscribable` object, one (or many) sub-objects can be declared. In the provided example, an object is provided in the key `test` is provided, including both a `dataQuery` and a `subscriptionQuery`.

The `dataQuery` will be evaluated as the subscription's content, while the `subscriptionQuery` will be evaluated to check if a subscription has changed since the last update.

Both queries can contain two special keywords: `{begin}` and `{end}`. These will be replaced with ISO-formatted dates on runtime (with the datetime in which the subscription was last evaluated, and the datetime at the time of evaluation, respectively).

*Please note that, for readability purposes, the special characters in example on the side are not properly escaped. Don't forget all special characters must be properly escaped for the queries to be correctly executed.*

## Get subscriptions owned by the request user

> Getting the subscriptions for the request user:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
  "data": [
    {
      "type": "subscription",
      "id": "587cc014f3b3f6280058e478",
      "attributes": {
        "name": "Test subscription",
        "createdAt": "2020-01-16T12:45:08.434Z",
        "userId": "57a063da096c4eda523e99ae",
        "resource": {
          "type": "EMAIL",
          "content": "example@wri.org"
        },
        "datasets": ["viirs-active-fires"],
        "datasetsQuery": [],
        "params": {
          "geostore": "50601ff9257df221e808af427cb47701"
        },
        "confirmed": false,
        "language": "en",
        "env": "production"
      }
    }
  ]
}
```

This endpoint will allow you to get the list of subscriptions owned by the user who performed the request (identified by the access token). This, in order to use this endpoint, you must be logged in (i.e. a token must be provided). In the sections below, we’ll explore how you can customize this endpoint call to match your needs.

For a detailed description of each field, check out the [Subscription reference](#subscription-reference) section.

### Pagination

No pagination is applied for the `v1/subscriptions` endpoint. Since only the subscriptions owned by the user who performs the request are returned, all subscriptions are always returned.

### Filters

The `v1/subscriptions` endpoint supports the following optional query parameters as filters:

Field       |  Description                                             | Type   | Default value
----------- | :------------------------------------------------------: | -----: | ---------------:
application | Application to which the subscription is associated.     | String | 'gfw'
env         | The environment to which the subscription is associated. | String | 'production'

**Deprecation notice:** the default value for the `application` filter (currently, `gfw`) will be removed and the `application` filter will then have no default value. We recommend reviewing your application to ensure you set and load the correct `application` explicitly.

### Errors for getting subscriptions

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | No valid token was provided in the request headers.

## Get a subscription by id

> Example call for getting a subscription by its id:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/587cc014f3b3f6280058e478 \
-H "Authorization: Bearer <your-token>"
```

> Response:

```json
{
  "data": {
    "type": "subscription",
    "id": "587cc014f3b3f6280058e478",
    "attributes": {
      "name": "Test subscription",
      "createdAt": "2020-01-16T12:45:08.434Z",
      "userId": "57a063da096c4eda523e99ae",
      "resource": {
        "type": "EMAIL",
        "content": "example@wri.org"
      },
      "datasets": ["viirs-active-fires"],
      "datasetsQuery": [],
      "params": {
        "geostore": "50601ff9257df221e808af427cb47701"
      },
      "confirmed": false,
      "language": "en",
      "env": "production"
    }
  }
}
```

If you know the id of a subscription, then you can access it directly, by performing a GET request to the `v1/subscriptions/:id` endpoint.

**Please keep in mind that, similarly to the `GET /v1/subscriptions` endpoint, this endpoint will only return subscriptions that are owned by the user who performed the request.** If you are trying to get a subscription that does not belong to you, the request will fail with status code 404 Not Found.

### Errors for getting subscriptions by id

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | ID is not valid| The id provided is not a valid subscription id.
401            | Unauthorized   | No valid token was provided in the request headers.
404            | Subscription not found | Either no subscription exists with the provided id, or the subscription with the id provided is not owned by the user who performed the request.

## Creating a subscription

> Example POST request to create a subscription providing the bare minimum body fields:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "datasets": "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76",
    "resource": {
      "type": "EMAIL",
      "content": "henrique.pacheco@vizzuality.com"
    },
    "params": {},
    "application": "gfw",
    "language": "en"
  }'
```

> Example response:

```json
{
  "data": {
    "type": "subscription",
    "id": "5eea1e6cfd754e001b28cb2b",
    "attributes": {
      "createdAt": "2020-06-17T13:45:16.222Z",
      "userId": "5ed75dd2a82a420010ed066b",
      "resource": {
        "type": "EMAIL",
        "content": "henrique.pacheco@vizzuality.com"
      },
      "datasets": ["20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"],
      "params": {},
      "confirmed": false,
      "language": "en",
      "datasetsQuery": [],
      "env": "production"
    }
  }
}
```

This section will guide you through the process of creating a basic subscription in the RW API. Creating a subscription is done using a POST request and passing the relevant data as body fields. The supported body fields are as defined on the [subscription reference](#subscription-reference) section, but the minimum field list you must specify for all subscriptions is:

* `datasets` or `datasetsQuery`
* `resource` (which includes `resource.type` and `resource.content`)
* `params`
* `application`
* `language`

If the creation of the subscription is successful, the HTTP response code will be 200 OK, and the response body will contain the created subscription object. **Please keep in mind that you must be authenticated in order to create and/or manage subscriptions.**

### Customizing the geographic area for the subscription

When it comes to geo-referenced data, subscriptions are intrinsically tied to a geographic area of interest. This association enables users to create subscriptions to be notified of changes in the data of a dataset, but only if there are changes in the data of the dataset relative to the concrete geographic area of the world they are interested in. The specification of the geographic information for the subscription should be done in the `params` field of the subscription.

#### Subscribing to an area of interest

> Creating a subscription providing the id of an area of interest in the params field:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "datasets": ["<dataset-id>"],
    "params": {
      "area": "35a6d982388ee5c4e141c2bceac3fb72"
    },
    "application": "gfw",
    "language": "en",
    "env": "production",
    "resource": {
      "type": "EMAIL",
      "content": "email@address.com"
    }
  }'
```

A subscription can refer to a specific area of interest that has been created using the [RW API Areas service](#areas). If this is the case, you should first create your area of interest using the `/v1/areas` endpoints, grab the id of the area of interest you wish to subscribe to and provide it in the `params.area` field of the request body when creating the subscription.

Field         | Description                                                    | Type
------------- | :------------------------------------------------------------: | ----------------:
`params`      | Geographic area of the subscription                            | Object
`params.area` | Id of area of interest from the [RW API Areas service](#areas) | String

#### Subscribing to a country

> Creating a subscription providing an ISO code in the params field:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "datasets": ["<dataset-id>"],
    "params": {
      "iso": {
        "country": "BRA"
      }
    },
    "application": "gfw",
    "language": "en",
    "env": "production",
    "resource": {
      "type": "EMAIL",
      "content": "email@address.com"
    }
  }'
```

A subscription can refer to a specific country by the country's 3-letter ISO code. If this is the case, you should provide the country code in the `params.iso.country` field of the request body when creating the subscription.

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params`              | Geographic area of the subscription                            | Object
`params.iso`          | Country, region or subregion information for the subscription  | Object
`params.iso.country`  | ISO 3-letter code of the country to subscribe                  | String

#### Subscribing to a country region (or subregion)

> Creating a subscription providing an ISO code, a region code and (optionally) a subregion code in the params field:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "datasets": ["<dataset-id>"],
    "params": {
      "iso": {
        "country": "BRA",
        "region": "1",
        "subregion": "2"
      }
    },
    "application": "gfw",
    "language": "en",
    "env": "production",
    "resource": {
      "type": "EMAIL",
      "content": "email@address.com"
    }
  }'
```

A subscription can refer to a specific country region (or subregion) by the country's 3-letter ISO code and the region (and subregion) id. If this is the case, you should provide the country code in the `params.iso.country` field, the region id in the `params.iso.region` field, and optionally the subregion id in the `params.iso.subregion` field, when creating the subscription.

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params`              | Geographic area of the subscription                            | Object
`params.iso`          | Country, region or subregion information for the subscription  | Object
`params.iso.country`  | ISO 3-letter code of the country to subscribe                  | String
`params.iso.region`   | Region id to subscribe                                         | String
`params.iso.subregion`| Subregion id to subscribe (optional)                           | String

#### Subscribing to a protected area from World Database on Protected Areas

> Creating a subscription providing a WDPA id in the params field:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "datasets": ["<dataset-id>"],
    "params": {
      "wdpaid": "32054"
    },
    "application": "gfw",
    "language": "en",
    "env": "production",
    "resource": {
      "type": "EMAIL",
      "content": "email@address.com"
    }
  }'
```

A subscription can refer to a specific protected area by the id of that area in the World Database on Protected Areas. If this is the case, you should provide the WDPA id in the `params.wdpaid` field when creating the subscription.

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params`              | Geographic area of the subscription                            | Object
`params.wdpaid`       | Id of the protected area in the WDPA                           | String

#### Subscribing to a geostore

> Creating a subscription providing the id of a geostore in the params field:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "datasets": ["<dataset-id>"],
    "params": {
      "geostore": "35a6d982388ee5c4e141c2bceac3fb72"
    },
    "application": "gfw",
    "language": "en",
    "env": "production",
    "resource": {
      "type": "EMAIL",
      "content": "email@address.com"
    }
  }'
```

A subscription can refer to a specific geostore that has been created using the [RW API Geostore service](#geostore). If this is the case, you should first create your geostore using the `/v2/geostore` endpoints, grab the id of the geostore you wish to subscribe to and provide it in the `params.geostore` field of the request body when creating the subscription.

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params`              | Geographic area of the subscription                            | Object
`params.geostore`     | Id of the geostore to subscribe to.                            | String

#### Subscribing to land use areas

> Creating a subscription providing the id of a land use area in the params field:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "datasets": ["<dataset-id>"],
    "params": {
      "use": "mining",
      "useid": "234"
    },
    "application": "gfw",
    "language": "en",
    "env": "production",
    "resource": {
      "type": "EMAIL",
      "content": "email@address.com"
    }
  }'
```

A subscription can refer to a land use area provided by different datasets. At this point, the following land use datasets are supported: `"mining"` for mining areas, `"logging"` for Congo Basin logging roads, `"oilpalm"` for palm oil plantations or `"fiber"` for wood fiber plantations. If this is the case, you should provide the name of the land use dataset you wish to use in the `params.use` field, and the id of the area in the `params.useid` field of the request body when creating the subscription.

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params`              | Geographic area of the subscription                            | Object
`params.use`          | The type of land use you want to subscribe to. Can be one of `"mining"`, `"logging"`, `"oilpalm"` or `"fiber"`. | String
`params.useid`        | The id of the land use area you want to subscribe to.          | String

### Creating subscriptions for other users

As a rule of thumb, you can only create and manage subscriptions for your user. However, in some specific cases, it may make sense to create subscriptions while impersonating other users. If you are interested in fetching or managing subscriptions that are owned by other users, take a look at [this section in the developer docs](/developer.html#subscriptions).

## Updating a subscription

> Example PATCH request for updating a subscription by id:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/subscriptions/:id \
-H "Authorization: Bearer <your-token>"
-H "Content-Type: application/json"  -d \
 '{
    "datasets": ["20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"],
    "params": {
      "geostore": "35a6d982388ee5c4e141c2bceac3fb72"
    },
    "application": "rw",
    "language": "fr",
    "env": "staging",
    "resource": {
      "type": "EMAIL",
      "content": "email@address.com"
    }
  }'
```

> Example response:

```json
{
  "data": {
    "type": "subscription",
    "id": "5ee79291a67d9a001b11043a",
    "attributes": {
      "createdAt": "2020-06-15T15:24:01.806Z",
      "userId": "5ed75dd2a82a420010ed066b",
      "resource": {
        "type": "EMAIL",
        "content": "email@address.com"
      },
      "datasets": ["20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"],
      "params": {
        "geostore": "35a6d982388ee5c4e141c2bceac3fb72"
      },
      "confirmed": true,
      "language": "fr",
      "datasetsQuery": [],
      "env": "staging"
    }
  }
}
```

**As with most of subscription endpoints, this endpoint requires authentication. Additionally, you must be the owner of the subscription in order to update it, otherwise the request will fail with `404 Not Found`.**

To update a subscription, you should use the PATCH `v1/subscriptions/:id` endpoint. Updating a subscription follows the same validations as when creating a new one - i.e. partial updates are not supported. You must provide all the required fields of the subscription for the update to be successful. The minimum fields list you must specify to update a subscription is:

* `datasets` or `datasetsQuery`
* `resource` (which includes `resource.type` and `resource.content`)
* `params`
* `application`
* `language`

If the update of the subscription is successful, the HTTP response code will be 200 OK, and the response body will contain the updated subscription object.

*Note: Updating a subscription does not require confirming it. A confirmed subscription will stay confirmed after an update.*

## Deleting subscriptions

> Example DELETE request for deleting a subscription by its id:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/subscriptions/:id \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
  "data": {
    "type": "subscription",
    "id": "5ee79291a67d9a001b11043a",
    "attributes": {
      "createdAt": "2020-06-15T15:24:01.806Z",
      "userId": "5ed75dd2a82a420010ed066b",
      "resource": {
        "type": "EMAIL",
        "content": "email@address.com"
      },
      "datasets": ["20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"],
      "params": {
        "geostore": "35a6d982388ee5c4e141c2bceac3fb72"
      },
      "confirmed": true,
      "language": "fr",
      "datasetsQuery": [],
      "env": "staging"
    }
  }
}
```

**As with most of subscription endpoints, this endpoint requires authentication. Additionally, you must be the owner of the subscription in order to delete it, otherwise the request will fail with `404 Not Found`.**

To delete a subscription, you should use the DELETE `v1/subscriptions/:id` endpoint. If the deletion of the subscription is successful, the HTTP response code will be 200 OK, and the response body will contain the deleted subscription object.

## Subscription lifecycle

You have created your subscription using [the endpoint for creating subscriptions](#creating-a-subscription). But, if you notice the subscription object returned after creation, you will be able to see that the subscription `confirmed` field is set to `false`. This means that this subscription is not confirmed yet.

For the subscription to be usable (i.e. in order to be notified via email or webhook), you will first need to confirm it. Check more information about confirming subscriptions in the [confirming a subscription](#confirming-a-subscription) section.

If confirming subscriptions using a HTTP request is not an option, and for some reason you have lost the confirmation email, you can check the [resending confirmation emails](#resending-the-subscription-confirmation-email) section for more information on how to resend the confirmation email.

If, at any point, you want to stop receiving email or webhook notifications, you can check the [unsubscribing](#unsubscribing) section for details on how to stop receiving notifications for your subscriptions.

### Confirming a subscription

> Example GET request to confirm a subscription:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/:id/confirm
```

Upon creation of the subscription, a confirmation email is sent to the email of the user who created the subscription. This email will contain a link, which you will need to click in order to confirm the subscription. You can also confirm the subscription by performing a GET request to the `v1/subscriptions/:id/confirm` endpoint, as exemplified on the side.

*Manually calling this endpoint will redirect you to the GFW application.*

### Resending the subscription confirmation email

> Example GET request to resend the confirmation email for a subscription:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/:id/send_confirmation \
-H "Authorization: Bearer <your-token>"
```

For convenience, the RW API offers an additional endpoint to resend the confirmation email. In order to do this, you should perform a GET request to the `v1/subscriptions/:id/send_confirmation`. As with most of the other subscription endpoints, please keep in mind that you must be authenticated in order to use this endpoint.

*Manually calling this endpoint will redirect you to the GFW application.*

### Unsubscribing

> Example GET request to unsubscribe:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/:id/unsubscribe \
-H "Authorization: Bearer <your-token>"
```

**Note: unsubscribing is equivalent to deleting the subscription**.

You can use the endpoint `v1/subscriptions/:id/unsubscribe` (exemplified on the side) for unsubscribing from a subscription. As with most of the other subscription endpoints, please keep in mind that you must be authenticated in order to use this endpoint.

## Subscription statistics

The following section details the endpoints that can be used to access statistics on the usage of subscriptions.

**The usage of the following endpoints is restricted to AMIN users.**

### General subscription statistics

> Example GET request to obtain general subscription statistics:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/statistics?start=:start&end=:end \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
  "topSubscriptions": {
    "geostore": 1000,
    "country": 30,
    "region": 20,
    "wdpa": 10,
    "use": 1
  },
  "info": {
    "numSubscriptions": 1000,
    "totalSubscriptions": 6000,
    "usersWithSubscriptions": 1000,
    "totalEmailsSentInThisQ": 0,
    "totalEmailsSended": 0
  },
  "usersWithSubscription": 119,
  "newUsers": 210,
  "groupStatistics": {
    "glad-alerts": {
      "country": 15,
      "region": 28,
      "use": 1,
      "wdpa": 9,
      "geostore": 1305,
      "countries": {
        "CHL": 1,
        "IDN": 3,
        ...
      },
      "regions": {
        "1": 1,
        "2": 2,
        ...
      },
      "wdpas": {
        "130": 1,
        "34043": 5,
        ...
      },
      "countryTop": {
        "name": "IDN",
        "value": 3
      },
      "regionTop": {
        "nameRegion": 12,
        "nameCountry": "IDN",
        "value": 2
      },
      "wdpaTop": {
        "id": 34043,
        "value": 5
      }
    },
    "prodes-loss": {...},
    "umd-loss-gain": {...},
    "terrai-alerts": {...},
    "viirs-active-fires": {...},
    "imazon-alerts": {...},
    "forma250GFW": {...},
    "forma-alerts": {...},
    "story": {...},
    "63f34231-7369-4622-81f1-28a144d17835": {...}
  }
}
```

The `v1/subscriptions/statistics` endpoint can be used to access all the data regarding the subscription notifications that have been sent.

#### Filters

This endpoint supports the following query parameters as filters:

Field       |             Description                                                              | Type   | Default | Example    |
----------- | :----------------------------------------------------------------------------------: | -----: | ------: | ---------: |
start       | The start of the date range to fetch the statistics. **This parameter is required.** | String | None    | 01-01-2020 |
end         | The end of the date range to fetch the statistics. **This parameter is required.**   | String | None    | 02-20-2020 |
application | The application for which the statistics will be fetched.                            | String | 'gfw'   | 'rw'       |

### Grouped subscription statistics

> Example GET request to obtain grouped subscription statistics:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/statistics-group?start=:start&end=:end \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
  "glad-alerts": {
    "country": 15,
    "region": 28,
    "use": 1,
    "wdpa": 9,
    "geostore": 1305,
    "countries": {
      "CHL": 1,
      "IDN": 3,
      ...
    },
    "regions": {
      "1": 1,
      "2": 2,
      ...
    },
    "wdpas": {
      "130": 1,
      "34043": 5,
      ...
    },
    "countryTop": {
      "name": "IDN",
      "value": 3
    },
    "regionTop": {
      "nameRegion": 12,
      "nameCountry": "IDN",
      "value": 2
    },
    "wdpaTop": {
      "id": 34043,
      "value": 5
    }
  },
  "prodes-loss": {...},
  "umd-loss-gain": {...},
  "terrai-alerts": {...},
  "viirs-active-fires": {...},
  "imazon-alerts": {...},
  "forma250GFW": {...},
  "forma-alerts": {...},
  "story": {...},
  "63f34231-7369-4622-81f1-28a144d17835": {...}
}
```

The `v1/subscriptions/statistics-group` endpoint can be used to access data regarding the subscription notifications that have been sent, grouped by the the dataset of the subscription. The output of this endpoint is a subset of the output of the `v1/subscriptions/statistics` endpoint.

#### Filters

This endpoint supports the following query parameters as filters:

Field       |             Description                                                              | Type   | Default | Example    |
----------- | :----------------------------------------------------------------------------------: | -----: | ------: | ---------: |
start       | The start of the date range to fetch the statistics. **This parameter is required.** | String | None    | 01-01-2020 |
end         | The end of the date range to fetch the statistics. **This parameter is required.**   | String | None    | 02-20-2020 |
application | The application for which the statistics will be fetched.                            | String | 'gfw'   | 'rw'       |

## Subscription reference

This section gives you a complete view at the properties that are maintained as part of a subscription. When interacting with a subscription (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/gfw-api/gfw-subscription-api/blob/develop/app/src/models/subscription.js).

Filter           | Type    | Required            | Default value       | Description
---------------- | ------- | ------------------- |-------------------- | ------------------------------------------------------------------
id               | String  | Yes                 | (auto-generated)    | Unique Id of the subscription. Auto generated on creation. Cannot be modified by users.
name             | String  | No                  |                     | The name of the subscription.
confirmed        | Boolean | No                  | false               | If the subscription is confirmed or not. Cannot be modified by users, only through the usage of the confirm and unsubscribe endpoints. (TODO: missing refs!)
resource         | Object  | Yes                 |                     | An object containing the data for who (or what) should be notified on dataset data changes.
resource.type    | Enum    | Yes                 |                     | The type of resource to be notified. Can take the values of `"EMAIL"` (for an email notification) or `"URL"` for a webhook notification.
resource.content | String  | Yes                 |                     | The object to be notified: should be a valid email case `resource.type` is `"EMAIL"`, and a valid URL case `resource.type` is `"URL"`.
datasets         | Array   | No                  | `[]`                | An array of dataset ids that this subscription is tracking.
datasetsQuery    | Array   | No                  | `[]`                | An alternative way of stating the datasets that this subscription is tracking.
params           | Object  | No                  | `{}`                | Determines the area of interest that this subscription should track. Can contain information to narrow the updates being tracked (especially in the case of geo-referenced data).
userId           | String  | Yes                 | (auto-populated)    | Id of the user who owns the subscription. Set automatically on creation. Cannot be modified by users.
language         | String  | No                  | `'en'`              | The language for this subscription. Useful for customizing email notifications according to the language of the subscription. Possible values include `'en'`, `'es'`, `'fr'`, `'pt'` or `'zh'`.
application      | String  | Yes                 | `'gfw'`             | Applications associated with this subscription.
env              | String  | Yes                 | `'production'`      | Environment to which the subscription belongs.
createdAt        | Date    | No                  | (auto-populated)    | Automatically maintained date of when the subscription was created. Cannot be modified by users.
updatedAt        | Date    | No                  | (auto-populated)    | Automatically maintained date of when the subscription was last updated. Cannot be modified by users.
