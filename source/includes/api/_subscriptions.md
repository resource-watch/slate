# Subscriptions

Subscription represents to wich datasets and analyisis a user can have access to.

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

Inside the `subscribable` object, one (or several) subobjects can be declared. In the provided example, the `test_subscription` is provided, with both a `dataQuery` and a `subscriptionQuery`. The former will be evaluated as the subscription's content, while the latter will be evaluated to check if a subscription has changed since the last update. Both queries can contain two special keywords: {begin} and {end}. These will be substituted with  ansi-formatted datetimes --with the datetime in which the subscription was last evaluated, and the datetime at the time of evaluation, respectively.

<aside class="notice">
Mind the string format: double quotes and curly braces need to be properly escaped.
</aside>

## Create Subscription

Field         |                            Description                            |               Type
------------- | :---------------------------------------------------------------: | -----------------:
name          |                               Name                                |               Text
application   |                  Application of the subscription                  |      gfw, rw, prep
language      | Language of the subscriptions (used to select the email template) | en, es, fr, pt, zh
resource      |   This field contains the subscription is of type email or hook   |             Object
-- type       |                               Type                                |       EMAIL or URL
-- content    |                           Email or url                            |               Text
datasets      |               Array of datasets of the subscription               |              Array
datasetsQuery |              Subscriptions to subscribable datasets               |              Array
-- id         |                           Id of dataset                           |   ObjectId
-- type       | Type of subscription defined in the dataset | Text 
-- params     | Geographic area of the subscription                               | Object

You only require one of `datasets`  or `datasetsQuery`, but not both.

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
    "resource": {
        "type": "EMAIL",
        "content": "email@addres.com"
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

## Obtain the subscriptions for a user

To get the authenticated  user subscriptions:

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
            "datasetsQuery":[

            ]
         }
      }
   ]
}
```

## Resend confirmation

To resend the confirmation:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/subscriptions/:id/send_confirmation \
-H "Authorization: Bearer <your-token>"
```

## Modify subscription

To modify a subscription:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/subscriptions/:id \
-H "Authorization: Bearer <your-token>"
```

With a body with the same format as before.

## Unsubscribe

To unsubscribe from a subscription:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/:id/unsubscribe \
-H "Authorization: Bearer <your-token>"
```

## Delete subscription

To unsubscribe (delete a subscription):

```shell
curl -X DELETE https://api.resourcewatch.org/v1/subscriptions/:id/unsubscribe \
-H "Authorization: Bearer <your-token>"
```
