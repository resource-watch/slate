# Subscriptions NEW

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

## Subscription reference

This section gives you a complete view at the properties that are maintained as part of a subscription. When interacting with a subscription (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/gfw-api/gfw-subscription-api/blob/develop/app/src/models/subscription.js).

Filter           | Type    | Required            | Default value       | Description
---------------- | ------- | ------------------- |-------------------- | ------------------------------------------------------------------
id               | String  | Yes                 | (auto-generated)    | Unique Id of the subscription. Auto generated on creation. Cannot be modified by users.
name             | String  | No                  |                     | The name of the subscription.
confirmed        | Boolean | No                  | false               | If the subscription is confirmed or not.
resource         | Object  | Yes                 |                     | An object containing the data for who (or what) should be notified on dataset data changes.
resource.type    | Enum    | Yes                 |                     | The type of resource to be notified. Can take the values of `"EMAIL"` (for an email notification) or `"URL"` for a webhook notification.
resource.content | String  | Yes                 |                     | The object to be notified: should be a valid email case `resource.type` is `"EMAIL"`, and a valid URL case `resource.type` is `"URL"`.
datasets         | Array   | No                  | `[]`                | An array of dataset ids that this subscription is tracking.
datasetsQuery    | Array   | No                  | `[]`                | An alternative way of stating the datasets that this subscription is tracking.
params           | Object  | No                  | `{}`                | Parameters for customizing the tracking of this subscription. Can contain information to narrow the updates being tracked (especially in the case of geo-referenced data).
userId           | String  | Yes                 | (auto-populated)    | Id of the user who owns the subscription. Set automatically on creation. Cannot be modified by users.
language         | String  | No                  | `'en'`              | The language for this subscription. Useful for customizing email notifications according to the language of the subscription.
application      | String  | Yes                 | `'gfw'`             | Applications associated with this subscription.
env              | String  | Yes                 | `'production'`      | Environment to which the subscription belongs.
createdAt        | Date    | No                  | (auto-populated)    | Automatically maintained date of when the subscription was created. Cannot be modified by users.
updatedAt        | Date    | No                  | (auto-populated)    | Automatically maintained date of when the subscription was last updated. Cannot be modified by users.
