# Subscriptions

Subscription represents to wich datasets and analyisis a user can have access to.

<aside class="notice">
Remember — All subscription endpoints need to be authenticated.
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
-- id         |                           Id of dataset                           |   ObjectId -- type | Type of subscription defined in the dataset | Text -- params | Geographic area of the subscription | Object You only require datasets or datasetsQuery, not both.

<aside class="notice">
Remember — All subscriptions are created unconfirmed and the process sends a message to the email of the subscription to confirm it.
</aside>

You can create a subscription with 6 different params:

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
   "application": "<application>",
   "language": "<language>",
   "resource": {
       "type": "<type>",
       "content": "<content>"
   },
   "datasets" : ["<dataset>"],
   "params": {
       "area": "<idArea>"
   }
  }'
```

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
   }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }'
```

## Confirm subscription

All subscriptions are created unconfirmed. The user needs confirm his subscription with this endpoint.

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/:id/confirm
```

## Obtain the subscriptions of a user

To get the user subscriptions:

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

With the same body that creates the subscription.

## Unsubscribe

To unsubscribe a subscription:

```shell
curl -X GET https://api.resourcewatch.org/v1/subscriptions/:id/unsubscribe \
-H "Authorization: Bearer <your-token>"
```

## Delete subscription

To delete a subscription (same that unsubscribe):

```shell
curl -X DELETE https://api.resourcewatch.org/v1/subscriptions/:id/unsubscribe \
-H "Authorization: Bearer <your-token>"
```
