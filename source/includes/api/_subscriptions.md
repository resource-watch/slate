# Subscriptions

## What is a subscription?

*Note: We strongly recommend that you read the [dataset concept](#dataset) and [dataset endpoints](#dataset6) sections before proceeding.*

A subscription allows you to get notified of updates on a datasets' data, either for every update, or for updates restricted to geographical areas of your interest. For example, you can use subscriptions to subscribe to deforestation alerts ([GLAD alerts dataset](http://api.resourcewatch.org/v1/dataset/61170ad0-9d6a-4347-8e58-9b551eeb341e)) in the Amazon forest, or track fire alerts ([VIIRS fire alerts dataset](http://api.resourcewatch.org/v1/dataset/64c948a6-5e34-4ef2-bb69-6a6535967bd5)) in your area of residence.

In the following sections, we will cover how you can interact and manage subscriptions in the RW API. We will see how you can customize subscriptions so that we only get notified for changes in a dataset's data for specific geographic regions. You will learn how to use them to get notified via email or calls to a URL you provide. We will also dive into subscription lifecycle, and understand how we can confirm subscriptions, resend confirmation emails and how to unsubscribe and stop receiving notifications.

However, we will start by understanding how we can prepare datasets to support subscriptions.

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

Before we go into the details of managing subscriptions, it's important to understand that, while you can create a subscription for *any* dataset, some conditions must be met by the dataset for its corresponding subscriptions to be functional and actually work as described here.

In order to support a functional subscription, a dataset must have some queries defined in its `subscribable` property. In this property, of type object, one (or many) sub-objects need to be declared. In the example on the side, an object is provided in the key `test`, including both a `dataQuery` and a `subscriptionQuery`.

`dataQuery` and `subscriptionQuery` should always be present inside each sub-object of the `subscribable` dataset's field. The first will be evaluated as the subscription's content, while the latter will be evaluated to check if a subscription has changed since the last update.

Both queries can contain two special keywords: `{begin}` and `{end}`. These will be replaced with ISO-formatted dates on runtime (with the datetime in which the subscription was last evaluated, and the datetime at the time of evaluation, respectively).

For more details on how you can modify the `subscribable` property of a dataset, check out the documentation on [updating a dataset](#updating-a-dataset).

*Please note that, for readability purposes, the special characters in example on the side are not properly escaped. Don't forget all special characters must be properly escaped for the queries to be correctly executed.*

## How are subscription notifications sent?

> Example of POST body data for a webhook notification:

```json
{
  "value": 5,
  "downloadUrls": {
    "csv": "https://production-api.globalforestwatch.org/glad-alerts/download/?period=2020-02-22,2020-03-04&gladConfirmOnly=False&aggregate_values=False&aggregate_by=False&geostore=423e5dfb0448e692f97b590c61f45f22&format=csv",
    "json": "https://production-api.globalforestwatch.org/glad-alerts/download/?period=2020-02-22,2020-03-04&gladConfirmOnly=False&aggregate_values=False&aggregate_by=False&geostore=423e5dfb0448e692f97b590c61f45f22&format=json"
  },
  "alerts": [
    {
      "alert_type": "GLAD",
      "date": "10/10/2019 00:10 UTC"
    },
    {
      "alert_type": "GLAD",
      "date": "11/10/2019 00:10 UTC"
    },
    {
      "alert_type": "GLAD",
      "date": "12/10/2019 00:10 UTC"
    },
    {
      "alert_type": "GLAD",
      "date": "13/10/2019 00:10 UTC"
    },
    {
      "alert_type": "GLAD",
      "date": "14/10/2019 00:10 UTC"
    },
    {
      "alert_type": "GLAD",
      "date": "15/10/2019 00:10 UTC"
    }
  ],
  "layerSlug": "glad-alerts",
  "alert_name": "Subscription for Amazônia, Brazil",
  "selected_area": "Amazônia, Brazil",
  "unsubscribe_url": "https://production-api.globalforestwatch.org/subscriptions/5ea996383efbd0119327b372/unsubscribe?redirect=true&lang=en",
  "subscriptions_url": "https://www.globalforestwatch.org/my-gfw?lang=en",
  "dashboard_link": "https://www.globalforestwatch.org/dashboards/aoi/5ea996383efbd0119327b372?lang=en",
  "alert_link": "https://www.globalforestwatch.org/map/aoi/5ea996383efbd0119327b372?lang=en&map%5BcanBound%5D=true&map%5Bdatasets%5D%5B0%5D%5Bdataset%5D=bfd1d211-8106-4393-86c3-9e1ab2ee1b9b&map%5Bdatasets%5D%5B0%5D%5Blayers%5D%5B0%5D=8e4a527d-1bcd-4a12-82b0-5a108ffec452&map%5Bdatasets%5D%5B0%5D%5BtimelineParams%5D%5BstartDate%5D=2020-04-15&map%5Bdatasets%5D%5B0%5D%5BtimelineParams%5D%5BendDate%5D=2020-04-22&map%5Bdatasets%5D%5B0%5D%5BtimelineParams%5D%5BtrimEndDate%5D=2020-04-22&map%5Bdatasets%5D%5B1%5D%5Bdataset%5D=0b0208b6-b424-4b57-984f-caddfa25ba22&map%5Bdatasets%5D%5B1%5D%5Blayers%5D%5B0%5D=b45350e3-5a76-44cd-b0a9-5038a0d8bfae&map%5Bdatasets%5D%5B1%5D%5Blayers%5D%5B1%5D=cc35432d-38d7-4a03-872e-3a71a2f555fc&mainMap%5BshowAnalysis%5D=true",
  "alert_date_begin": "2020-04-15",
  "alert_date_end": "2020-04-22"
}
```

Subscriptions support two types of notifications: emails or webhook requests is performed. Both notifications are checked and sent every day, assuming that the dataset data has changed since the last notification sent.

Webhook notifications are sent as POST requests to the URL saved in the subscription. You can check on the side an example of the data that is sent in the body of the POST call. Please note that the webhook POST body data can change, based on the dataset chosen to receive notifications.

You can see in the image below an example of an email notification for GLAD deforestation alerts:

![Subscription email example](images/subscription-email-example.png)

## Getting subscriptions owned by the request user

> Getting the subscriptions for the request user:

```shell
curl -X GET "https://api.resourcewatch.org/v1/subscriptions" \
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

This endpoint will allow you to get all the subscriptions owned by the user who performed the request (identified by the access token). To use this endpoint, you must be logged in (i.e. a token must be provided). In the sections below, we’ll explore how you can customize this endpoint call to match your needs.

For a detailed description of each field, check out the [Subscription reference](#subscription-reference) section.

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

## Getting a subscription by id

> Example call for getting a subscription by its id:

```shell
curl -X GET "https://api.resourcewatch.org/v1/subscriptions/<subscription_id>" \
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

If you know the id of a subscription, then you can access it directly by performing a GET request to the `v1/subscriptions/:id` endpoint. Keep in mind that this will only match subscriptions that are owned by the user who performed the request.

### Errors for getting subscriptions by id

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | ID is not valid| The id provided is not a valid subscription id.
401            | Unauthorized   | No valid token was provided in the request headers.
404            | Subscription not found | Either no subscription exists with the provided id, or the subscription with the id provided is not owned by the user who performed the request.

## Creating a subscription

> Example POST request to create a subscription providing the bare minimum body fields:

```shell
curl -X POST "https://api.resourcewatch.org/v1/subscriptions" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "datasets": "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76",
    "resource": {
      "type": "EMAIL",
      "content": "example@wri.org"
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
        "content": "example@wri.org"
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

This section will guide you through the process of creating a basic subscription in the RW API. Creating a subscription can be done by any logged user using a POST request and passing the relevant data as body fields. The supported body fields are as defined on the [subscription reference](#subscription-reference) section, but the minimum field list you must specify for all subscriptions are:

* `datasets` or `datasetsQuery`
* `resource` (which must include both `resource.type` and `resource.content`)
* `params`
* `application`
* `language`

If the creation of the subscription is successful, the HTTP response code will be 200 OK, and the response body will contain the created subscription object. Please note that **subscriptions must be confirmed** before they become active - refer to the [subscription lifecycle](#subscription-lifecycle) for more details on this.

### Errors for creating subscriptions

Error code     | Error message                       | Description
-------------- | ----------------------------------- | --------------
400            | `<field>` required                  | You didn't provide one of the required fields.
401            | Unauthorized                        | No valid token was provided in the request headers.

### Customizing the geographic area for the subscription

When it comes to geo-referenced data, subscriptions are intrinsically tied to a geographic area of interest. This association enables users to create subscriptions to be notified of changes in the data of a dataset, but only if there are changes in the data of the dataset relative to the concrete geographic area of the world they are interested in. The specification of the geographic information for the subscription should be done in the `params` field of the subscription.

#### Subscribing to an area of interest

> Creating a subscription providing the id of an area of interest in the params field:

```shell
curl -X POST "https://api.resourcewatch.org/v1/subscriptions" \
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

A subscription can refer to a specific area of interest that has been created using the [RW API Areas service](#areas). If this is the case, you should first [create your area of interest](#create-area), grab its id and provide it in the `params.area` field of the request body when creating the subscription.

Field         | Description                                                    | Type
------------- | :------------------------------------------------------------: | ----------------:
`params`      | Geographic area of the subscription                            | Object
`params.area` | Id of area of interest from the [RW API Areas service](#areas) | String

#### Subscribing to a country, country region or subregion

> Creating a subscription to a whole country:

```shell
curl -X POST "https://api.resourcewatch.org/v1/subscriptions" \
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

> Creating a subscription to a country subregion:

```shell
curl -X POST "https://api.resourcewatch.org/v1/subscriptions" \
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

A subscription can refer to a country, one of its regions, or a subregion within a region. Countries are identified by their ISO 3166-1 alpha-3 code - check [here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) for a list of all the available country codes. Regions and subregions are identified by their respective GADM id, which can be obtained from GADM's dataset [here](https://gadm.org/data.html). When creating a subscription for a region, the country ISO must be specified. For subscribing to a subregion, both region and country ISO must be provided.

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params.iso.country`  | ISO 3-letter code of the country to subscribe                  | String
`params.iso.region`   | Region id to subscribe                                         | String
`params.iso.subregion`| Subregion id to subscribe (optional)                           | String

#### Subscribing to a protected area from World Database on Protected Areas

> Creating a subscription providing a WDPA id in the params field:

```shell
curl -X POST "https://api.resourcewatch.org/v1/subscriptions" \
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

A subscription can refer to a specific protected area by the id of that area in the World Database on Protected Areas. If this is the case, you should provide the WDPA id in the `params.wdpaid` field when creating the subscription. IDs of protected areas worldwide can be obtained from the [Protected Planet website](https://www.protectedplanet.net/).

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params.wdpaid`       | Id of the protected area in the WDPA                           | String

#### Subscribing to a geostore

> Creating a subscription providing the id of a geostore in the params field:

```shell
curl -X POST "https://api.resourcewatch.org/v1/subscriptions" \
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

A subscription can refer to a specific geostore that has been created using the [RW API Geostore service](#geostore). If this is the case, you should [create your geostore](#create-geostore) and use its id in the `params.geostore` field of the request body when creating the subscription.

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params.geostore`     | Id of the geostore to subscribe to.                            | String

#### Subscribing to land use areas

> Creating a subscription providing the id of a land use area in the params field:

```shell
curl -X POST "https://api.resourcewatch.org/v1/subscriptions" \
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

A subscription can refer to a land use area provided by different datasets. At this point, the following land use datasets are supported: `mining` for mining areas, `logging` for Congo Basin logging roads, `oilpalm` for palm oil plantations or `fiber` for wood fiber plantations. If this is the case, you should provide the name of the land use dataset you wish to use in the `params.use` field, and the id of the area in the `params.useid` field of the request body when creating the subscription.

The ids to be used for land use areas can be obtained from the following CartoDB datasets:

* Mining area IDs can be obtained by querying [this dataset](http://api.resourcewatch.org/v1/dataset/c2142922-84d9-4564-8216-a4867b9e48c5).
* Palm oil plantation IDs can be obtained from [this CartoDB table](https://wri-01.carto.com/tables/gfw_oil_palm/public/map).
* Wood fiber plantation IDs can be obtained from [this CartoDB table](https://wri-01.carto.com/tables/gfw_woodfiber/public/map).
* Congo Basin logging road IDs can be obtained from [this CartoDB table](https://wri-01.carto.com/tables/osm_logging_roads/public/map).

Field                 | Description                                                    | Type
--------------------- | :------------------------------------------------------------: | ----------------:
`params.use`          | The type of land use you want to subscribe to. Can be one of `mining`, `logging`, `oilpalm` or `fiber`. | String
`params.useid`        | The id of the land use area you want to subscribe to.          | String

## Updating a subscription

> Example PATCH request for updating a subscription by id:

```shell
curl -X PATCH "https://api.resourcewatch.org/v1/subscriptions/<subscription_id>" \
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

You can update subscriptions associated with you user account by using the PATCH `v1/subscriptions/:id` endpoint. Updating a subscription follows the same validations as when creating a new one - i.e. all required field values must be provided, even if they remain the same. Values for fields other than the following are optional. The minimum fields list you must specify to update a subscription is:

* `datasets` or `datasetsQuery`
* `resource` (which much include `resource.type` and `resource.content`)
* `params`
* `application`
* `language`

If the update of the subscription is successful, the HTTP response code will be 200 OK, and the response body will contain the updated subscription object.

*Note: Updating a subscription does not require confirming it. A confirmed subscription will stay confirmed after an update.*

### Errors for updating subscriptions

Error code     | Error message                       | Description
-------------- | ----------------------------------- | --------------
400            | `<field>` required                  | You didn't provide one of the required fields.
400            | Id is not valid                     | The id provided is not valid.
401            | Unauthorized                        | No valid token was provided in the request headers.
404            | Subscription not found              | Either a subscription with the id provided does not exist or it is not owned by the user who performed the request.

## Deleting subscriptions

> Example DELETE request for deleting a subscription by its id:

```shell
curl -X DELETE "https://api.resourcewatch.org/v1/subscriptions/<subscription_id>" \
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

To delete a subscription associated with your user account, you should use the DELETE `v1/subscriptions/:id` endpoint. If the deletion of the subscription is successful, the HTTP response code will be 200 OK, and the response body will contain the deleted subscription object.

### Errors for deleting subscriptions

Error code     | Error message                       | Description
-------------- | ----------------------------------- | --------------
400            | Id is not valid                     | The id provided is not valid.
401            | Unauthorized                        | No valid token was provided in the request headers.
404            | Subscription not found              | Either a subscription with the id provided does not exist or it is not owned by the user who performed the request.

## Subscription lifecycle

You have created your subscription using [the endpoint for creating subscriptions](#creating-a-subscription). But, if you notice the subscription object returned after creation, you will be able to see that the subscription `confirmed` field is set to `false`. This means that this subscription is not confirmed yet.

For the subscription to be usable (i.e. in order to be notified via email or webhook), you will first need to confirm it. Check more information about confirming subscriptions in the [confirming a subscription](#confirming-a-subscription) section.

If confirming subscriptions using a HTTP request is not an option, and for some reason you have lost the confirmation email, you can check the [resending confirmation emails](#resending-the-subscription-confirmation-email) section for more information on how to resend the confirmation email.

If, at any point, you want to stop receiving email or webhook notifications, you can check the [unsubscribing](#unsubscribing) section for details on how to stop receiving notifications for your subscriptions.

### Confirming a subscription

> Example GET request to confirm a subscription:

```shell
curl -X GET "https://api.resourcewatch.org/v1/subscriptions/<subscription_id>/confirm"
```

Upon creation of the subscription, a confirmation email is sent to the email of the user who created the subscription. This email will contain a link, which you will need to click in order to confirm the subscription. You can also confirm the subscription by performing a GET request to the `v1/subscriptions/:id/confirm` endpoint, as exemplified on the side.

*Manually calling this endpoint will redirect you to the GFW application.*

### Resending the subscription confirmation email

> Example GET request to resend the confirmation email for a subscription:

```shell
curl -X GET "https://api.resourcewatch.org/v1/subscriptions/<subscription_id>/send_confirmation" \
-H "Authorization: Bearer <your-token>"
```

For convenience, the RW API offers an additional endpoint to resend the confirmation email. In order to do this, you should perform a GET request to the `v1/subscriptions/:id/send_confirmation`. As with most of the other subscription endpoints, please keep in mind that you must be authenticated in order to use this endpoint.

This endpoint does not change the subscription - i.e. if the subscription was already confirmed, it stays that way. The confirmation email will always be sent, regardless if the subscription is confirmed or not.

*Manually calling this endpoint will redirect you to the GFW application.*

### Unsubscribing

> Example GET request to unsubscribe:

```shell
curl -X GET "https://api.resourcewatch.org/v1/subscriptions/<subscription_id>/unsubscribe" \
-H "Authorization: Bearer <your-token>"
```

**Note: unsubscribing is equivalent to deleting the subscription**.

You can use the endpoint `v1/subscriptions/:id/unsubscribe` (exemplified on the side) for unsubscribing from a subscription. As with most of the other subscription endpoints, please keep in mind that you must be authenticated in order to use this endpoint.

## Subscription statistics

The following section details the endpoints that can be used to access statistics on the usage of subscriptions.

**The usage of the following endpoints is restricted to ADMIN users.**

### General subscription statistics

> Example GET request to obtain general subscription statistics:

```shell
curl -X GET "https://api.resourcewatch.org/v1/subscriptions/statistics?start=:start&end=:end" \
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
curl -X GET "https://api.resourcewatch.org/v1/subscriptions/statistics-group?start=:start&end=:end" \
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
resource.type    | Enum    | Yes                 |                     | The type of resource to be notified. Can take the values of `EMAIL` (for an email notification) or `URL` for a webhook notification.
resource.content | String  | Yes                 |                     | The object to be notified: should be a valid email case `resource.type` is `EMAIL`, and a valid URL case `resource.type` is `URL`.
datasets         | Array   | No                  | `[]`                | An array of dataset ids that this subscription is tracking.
datasetsQuery    | Array   | No                  | `[]`                | An alternative way of stating the datasets that this subscription is tracking.
params           | Object  | No                  | `{}`                | Determines the area of interest that this subscription should track. Can contain information to narrow the updates being tracked (especially in the case of geo-referenced data).
userId           | String  | Yes                 | (auto-populated)    | Id of the user who owns the subscription. Set automatically on creation. Cannot be modified by users.
language         | String  | No                  | `'en'`              | The language for this subscription. Useful for customizing email notifications according to the language of the subscription. Possible values include `'en'`, `'es'`, `'fr'`, `'pt'` or `'zh'`.
application      | String  | Yes                 | `'gfw'`             | Applications associated with this subscription.
env              | String  | Yes                 | `'production'`      | Environment to which the subscription belongs.
createdAt        | Date    | No                  | (auto-populated)    | Automatically maintained date of when the subscription was created. Cannot be modified by users.
updatedAt        | Date    | No                  | (auto-populated)    | Automatically maintained date of when the subscription was last updated. Cannot be modified by users.
