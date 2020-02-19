# Subscriptions

Subscription represents to which datasets and analysis a user can have access to.

<aside class="notice">
Remember — All subscription endpoints need to be authenticated.
</aside>

## Subscribable datasets

In order to create a subscription, a dataset must be prepared to accept them. This is achieved by declaring some queries in the dataset json object sent to the `/v1/dataset` endpoint under the `subscribable`property.

```json
{
	"name": "dataset name",
	"application": ["app"],
	"provider": "dataset provider",
	"other": "dataset_fields",
    "subscribable": {
        "test_subscription": {
            "dataQuery": "SELECT * FROM dataset-name  WHERE \"reported_date\" >= '{{begin}}' AND \"reported_date\" <= '{{end}}' AND \"number_dead\" > 0 ORDER BY reported_date DESC LIMIT 10",
            "subscriptionQuery": "SELECT COUNT(*) FROM dataset-name WHERE \"reported_date\" >= '{begin}' AND \"reported_date\" <= '{end}' AND \"number\" > 0"
        }
    }
}
```

Inside the `subscribable` object, one (or several) sub-objects can be declared. In the provided example, the `test_subscription` is provided, with both a `dataQuery` and a `subscriptionQuery`. The former will be evaluated as the subscription's content, while the latter will be evaluated to check if a subscription has changed since the last update. Both queries can contain two special keywords: {begin} and {end}. These will be substituted with  ansi-formatted datetimes --with the datetime in which the subscription was last evaluated, and the datetime at the time of evaluation, respectively.

<aside class="notice">
Mind the string format: double quotes and curly braces need to be properly escaped.
</aside>

## Creating a Subscription


Field         |                            Description                            |               Type | Required
------------- | :---------------------------------------------------------------: | -----------------: |-----------:
name          |                               Name                                |               Text | No
application   | Application of the subscription. Set to `gfw` by default          |             String | No
language      | Language of the subscriptions (used to select the email template) | en, es, fr, pt, zh | Yes
resource      | Details on the resource that will be notified for the subscription. |           Object | Yes
-- type       | The type of resource to notify. If `EMAIL`, an email is sent to the email saved in the resource content. If `URL`, a POST is requested to the web-hook URL in the resource content. | String | Yes
-- content    |  The email or URL that will be notified (according to the type).  |             String | Yes
datasets      |               Array of datasets of the subscription               |              Array | Yes (unless `datasetsQuery` is specified)
datasetsQuery |              Subscriptions to subscribable datasets               |              Array | Yes (unless `datasets` is specified)
-- id         |                           Id of dataset                           |           ObjectId | Yes (unless `datasets` is specified)
-- type       | Type of subscription defined in the dataset                       |               Text | Yes (unless `datasets` is specified)
-- params     | Geographic area of the subscription                               |             Object | Yes (unless `datasets` is specified)
env           |  Environment of the subscription. Set to `production` by default  |             String | No
userId        | Id of the user owner of the subscription. This parameter can only be provided when creating subscriptions in requests from other MSs. Otherwise, the id of the user in the token of the request is set as the owner. | String | No

<aside class="warning">The <code>application</code> field will soon be made required when creating a subscription.</aside>

<aside class="notice">
Remember — Subscriptions are created unconfirmed. A link for confirmation will be sent to the subscription email.
</aside>

A way to determine the area of interest for the subscriptions needs to be provided. A subscription can be created in six different ways:

### With an area

Field   |             Description             |            Type
------- | :---------------------------------: | --------------:
params  | Geographic area of the subscription |          Object
-- area |          Id of area object          | Text (ObjectId)

> To create a Subscription, you have to do a POST request with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "name": "<name>",
    "datasets": [
        "<dataset>"
    ],
    "params": {
        "geostore": "35a6d982388ee5c4e141c2bceac3fb72"
    },
    "datasetsQuery": [
        {
            "id": ":subscription_dataset_id",
            "type": "test_subscription",
            "threshold": 1
        }
    ],
    "application": "rw",
    "language": "en",
    "env": <environment>,
    "resource": {
        "type": "EMAIL",
        "content": "email@address.com"
    }
}'
```

In this case, a subscription is being created in reference to the `subscribable` field present in the previously defined dataset. After confirming the subscription the `subscriptionQuery` will be ran and its result will be compared against the `threshold`. If the query result is at least equal to the threshold, a new alert will be sent to the subscription's email.

### From country

Field        |             Description             |   Type
------------ | :---------------------------------: | -----:
params       | Geographic area of the subscription | Object
-- iso       |    Country or region information    | Object
---- country |              Iso code               |   Text

> To create a Subscription, you have to do a POST with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "env": <environment>,
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "iso": {
           "country": "<iso>"
       }
   },
   "datasetsQuery": [{}]
  }'
```

### From country and region

Field        |             Description             |   Type
------------ | :---------------------------------: | -----:
params       | Geographic area of the subscription | Object
-- iso       |    Country or region information    | Object
---- country |              Iso code               |   Text
---- region  |             Region code             | Number

> To create a Subscription, you have to do a POST request with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "env": <environment>,
   "params": {
       "iso": {
           "country": "<iso>",
           "region": "<region>"
       }
    }
  }'
```

### From World Database on Protected Areas (wdpa)

Field     |             Description             |   Type
--------- | :---------------------------------: | -----:
params    | Geographic area of the subscription | Object
-- wdpaid |        id of protected area         | Number

> To create a Subscription, you have to do a POST request with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "env": <environment>,
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "wdpaid": <idWdpa>
    },
   "datasetsQuery": [{}]
  }'
```

### From land use areas

Field    |             Description             |   Type
-------- | :---------------------------------: | -----:
params   | Geographic area of the subscription | Object
-- use   |              Use name               |   Text
-- useid |               Id use                | Number

> To create a Subscription, you have to do a POST request with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "env": <environment>,
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "use": "<useName>",
       "useid": <id>
    },
   "datasetsQuery": [{}]
  }'
```

Subscription has 4 different lands uses:

#### Oil palm

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "env": <environment>,
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "use": "oilpalm",
       "useid": <id>
    },
	"datasetsQuery": [{}]
  }'
```

#### Mining

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "env": <environment>,
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "use": "mining",
       "useid": <id>
    }
  }'
```

#### Wood fiber

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "env": <environment>,
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "use": "fiber",
       "useid": <id>
    },
	"datasetsQuery": [{}]
  }'
```

#### Congo Basin logging roads

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "env": <environment>,
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "use": "logging",
       "useid": <id>
    },
	"datasetsQuery": [{}]
  }'
```

### From geostore

Field       |             Description             |   Type
----------- | :---------------------------------: | -----:
params      | Geographic area of the subscription | Object
-- geostore |           Id of geostore            |   Text

> To create a Subscription, you have to do a POST request with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "<name>",
   "application": "<application>",
   "env": <environment>,
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "geostore": "<idGeostore>"
    },
   "datasetsQuery": [{}]
  }'
```

## Confirm subscription

All subscriptions are created unconfirmed. The user needs confirm his subscription with this endpoint.

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/:id/confirm
```

## Get a subscription by its ID

You can get the data from a specific subscription using the following `GET` request:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/<subscription-id> \
-H "Authorization: Bearer <your-token>"
```

<aside class="notice">
Remember — this endpoint is authenticated.
</aside>
<aside class="success">
Remember — the response is in JSONApi format.
</aside>

> Example

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/5d9c933c04c106001056d2a1 \
-H "Authorization: Bearer xxxxxx"
```

> Response:

```json

{
    "data":
    {
        "type": "subscription",
        "id": "5d9c933c04c106001056d2a1",
        "attributes":
        {
            "name": "",
            "createdAt": "2019-10-08T13:46:36.894Z",
            "userId": "58e22f662071c01c02f76a0f",
            "resource":
            {
                "type": "EMAIL",
                "content": "aaa@aaa.com"
            },
            "datasets":
            [
                "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"
            ],
            "params": {},
            "confirmed": false,
            "language": "en",
            "datasetsQuery":
            [
                {
                    "threshold": 1,
                    "lastSentDate": "2019-10-08T13:46:36.895Z",
                    "historical": [],
                    "type": "COUNT"
                }
            ],
            "env": "production"
        }
    }
}
```


## Get subscriptions for a user

You can get a list of the current user's subscriptions using the following endpoint. In order to use this endpoint, you need to be logged in.


```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>"
```

<aside class="success">
Remember — the response is in JSONApi format.
</aside>

> Response:

```json

{
   "data":[
      {
         "type":"subscription",
         "id":"587cc014f3b3f6280058e478",
         "attributes":{
            "name":"test",
            "createdAt":"2017-01-16T12:45:08.434Z",
            "userId":"57a063da096c4eda523e99ae",
            "resource":{
               "type":"EMAIL",
               "content":"pepe@gmail.com"
            },
            "datasets":[
               "viirs-active-fires"
            ],
            "params":{
               "iso":{
                  "region":null,
                  "country":null
               },
               "wdpaid":null,
               "use":null,
               "useid":null,
               "geostore":"50601ff9257df221e808af427cb47701"
            },
            "confirmed":false,
            "language":"en",
            "datasetsQuery": [],
            "env": "production"
         }
      }
   ]
}
```

This endpoint supports the following optional query parameters as filters:

Field       |             Description                              |   Type | Default value
----------- | :--------------------------------------------------: | -----: | -----:
application | Application to which the subscription is associated. | String | 'gfw'
env         |           Id of geostore                             | String | 'production'

<aside class="warning">The <code>application</code> filter, which defaults to <code>gfw</code>, will soon be modified. We recommend reviewing your application to ensure you set and load the correct <code>application</code> explicitly</aside>

## Resend confirmation

To resend the confirmation:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/subscriptions/:id/send_confirmation \
-H "Authorization: Bearer <your-token>"
```

## Modify subscription

```shell
curl -X PATCH https://api.resourcewatch.org/v1/subscriptions/:id \
-H "Authorization: Bearer <your-token>"
```

To modify a subscription, use the following PATCH endpoint. The body should be formatted in the same way as when creating a subscription.

If the request comes from another micro service, then it is possible to modify subscriptions belonging to other users. Otherwise, you can only modify subscriptions if you are the owner of the subscription.

## Unsubscribe

To unsubscribe from a subscription:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/:id/unsubscribe \
-H "Authorization: Bearer <your-token>"
```

## Delete subscription

```shell
curl -X DELETE https://api.resourcewatch.org/v1/subscriptions/:id/unsubscribe \
-H "Authorization: Bearer <your-token>"
```

To delete a subscription, use the following DELETE endpoint.

If the request comes from another micro service, then it is possible to delete subscriptions belonging to other users. Otherwise, you can only delete subscriptions if you are the owner of the subscription.

## Finding subscriptions by ids

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions/find-by-ids \
-H "Authorization: Bearer <your-token>"
-H "Content-Type: application/json"  -d \
 '{ "ids": ["5e4d273dce77c53768bc24f9"] }'
```

> Example response:

```json

{
    "data": [
        {
            "type": "subscription",
            "id": "5e4d273dce77c53768bc24f9",
            "attributes": {
                "createdAt": "2020-02-19T12:17:01.176Z",
                "userId": "5e2f0eaf9de40a6c87dd9b7d",
                "resource": {
                    "type": "EMAIL",
                    "content": "henrique.pacheco@vizzuality.com"
                },
                "datasets": [
                    "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"
                ],
                "params": {},
                "confirmed": false,
                "language": "en",
                "datasetsQuery": [
                    {
                        "threshold": 1,
                        "lastSentDate": "2020-02-19T12:17:01.175Z",
                        "historical": [],
                        "id": "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76",
                        "type": "COUNT"
                    }
                ],
                "env": "production"
            }
        }
    ]
}
```

You can find a set of subscriptions given their ids using the following endpoint.

This endpoint is restricted to usage by other micro services.

## Finding subscriptions for a given user

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions/user/5e2f0eaf9de40a6c87dd9b7d \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json

{
    "data": [
        {
            "type": "subscription",
            "id": "5e4d273dce77c53768bc24f9",
            "attributes": {
                "createdAt": "2020-02-19T12:17:01.176Z",
                "userId": "5e2f0eaf9de40a6c87dd9b7d",
                "resource": {
                    "type": "EMAIL",
                    "content": "henrique.pacheco@vizzuality.com"
                },
                "datasets": [
                    "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"
                ],
                "params": {},
                "confirmed": false,
                "language": "en",
                "datasetsQuery": [
                    {
                        "threshold": 1,
                        "lastSentDate": "2020-02-19T12:17:01.175Z",
                        "historical": [],
                        "id": "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76",
                        "type": "COUNT"
                    }
                ],
                "env": "production"
            }
        }
    ]
}
```

You can find all the subscriptions associated with a given user id using the following endpoint.

This endpoint is restricted to usage by other micro services.

This endpoint supports the following optional query parameters as filters:

Field       |             Description                              |   Type |
----------- | :--------------------------------------------------: | -----: |
application | Application to which the subscription is associated. | String |
env         | Environment to which the subscription is associated. | String |

## Subscription statistics

Statistics endpoints require authentication by an ADMIN user.

### General subscription statistics



The `subscription/statistics` endpoint can be used to access all data regarding the subscription notifications that have been sent.

This endpoint supports the following query parameters as filters (please note that the dates must be formatted as MM-DD-YYYY):

Field       |             Description                                                          | Type   | Default | Example    |
----------- | :------------------------------------------------------------------------------: | -----: | ------: | ---------: |
start       | The start of the date range to fetch the statistics. This parameter is required. | String | None    | 01-01-2020 |
end         | The end of the date range to fetch the statistics. This parameter is required.   | String | None    | 02-20-2020 |
application | The application for which the statistics will be fetched.                        | String | 'gfw'   | 'rw'       |


```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/statistics?start=:start&end=:end \
-H "Authorization: Bearer <your-token>"
```

> Response:

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

### Grouped subscription statistics

The `subscription/statistics-group` endpoint can be used to access data regarding the subscription notifications that have been sent, grouped by the the dataset of the subscription.

This endpoint supports the following query parameters as filters (please note that the dates must be formatted as MM-DD-YYYY):

Field       |             Description                                                          | Type   | Default | Example    |
----------- | :------------------------------------------------------------------------------: | -----: | ------: | ---------: |
start       | The start of the date range to fetch the statistics. This parameter is required. | String | None    | 01-01-2020 |
end         | The end of the date range to fetch the statistics. This parameter is required.   | String | None    | 02-20-2020 |
application | The application for which the statistics will be fetched.                        | String | 'gfw'   | 'rw'       |

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/statistics-group?start=:start&end=:end \
-H "Authorization: Bearer <your-token>"
```

> Response:

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
