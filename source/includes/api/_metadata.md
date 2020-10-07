# Metadata

## Metadata definition

Metadata is data concerning another resource available on this API. It only exists when associated with another resource - currently supported resource types are datasets, widgets or layers. Note that, although there might be several metadata per resource, each resource will have - at most - one metadata element per `application` and `language` pair. As such, the `application` and `language` attributes are required and it is mandatory to include them in when creating/updating metadata.

Some fields are important to identify the entity properly; others are just optional and give extra information about it.



| Field             | Description                                                       | Type
| ------------------|:-----------------------------------------:                        | -----:
| application       | The metadata application. Read more about this field [here](/index-rw.html#applications). | String
| language          | The metadata language                                             | String
| dataset           | The associated dataset id to the metadata                         | String
| resource          | The resource associated to the metadata                           | Object
| -- id             | Resource id                                                       | String
| -- type           | Resource type                                                     | String
| name              | The metadata name                                                 | String
| description       | The metadata description                                          | String
| source            | The metadata source                                               | String
| citation          | The metadata citation                                             | String
| license           | The metadata license type                                         | String
| info              | Some info about the metadata                                      | Object
| units             | Measurement units                                                 | Object

## Creating a metadata object

As previously discussed, a metadata entity is always associated with either a dataset, a widget or a layer resource, and the type of resource it is associated
to dictates which of 3 endpoints you should use when creating a new metadata entity.

In all scenarios, you must be authenticated to be able to create a metadata entity, and meet the following requirements:

- Have the `ADMIN` or `MANAGER` role.
- Belong to the same `application` as the metadata being created. 

Any of these conditions are not met, the API will generate a 403 `Forbidden` error message.


| Field             | Required/Optional                                                      
| ------------------|:-----------------------------------------:     
| application       | required                                                             
| language          | required                                          
| dataset           | required                                                                
| name              | optional                                            
| description       | optional                                        
| source            | optional                                             
| citation          | optional                                             
| license           | optional                                        
| info              | optional                                      
| units             | optional                                             

<aside class="notice">
Please, be sure that the request is properly authenticated and the current user has permission to the resource.
If you don't know how to do this, please go to the <a href="#authentication">Authentication section</a>
</aside>

> Create metadata for a dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Create metadata for a widget


```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Create metadata for a layer


```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Real example


```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": "rw",
   "language": "en"
  }'
```

> Response

```json
{
  "data": [
    {
      "id": "942b3f38-9504-4273-af51-0440170ffc86-dataset-942b3f38-9504-4273-af51-0440170ffc86-rw-en",
      "type": "metadata",
      "attributes": {
        "dataset": "942b3f38-9504-4273-af51-0440170ffc86",
        "application": "rw",
        "resource": {
          "type": "dataset",
          "id": "942b3f38-9504-4273-af51-0440170ffc86"
        },
        "language": "en",
        "createdAt": "2017-01-20T08:07:53.272Z",
        "updatedAt": "2017-01-20T08:07:53.272Z",
        "status": "published"
      }
    }
  ]
}
```


## Getting metadata

application filter:
```
application: gfw, gfw-climate, prep, rw, forest-atlas (select one or some of them)
```

language filter:
```
language: select between available languages (select one or some of them)
```

limit filter:
```
limit: the desired number
```

Custom param for /metadata endpoint:
```
type: [dataset, widget, layer]
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/metadata
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/metadata
```

> Real example

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/metadata
```

## Updating a metadata

As previously discussed, a metadata entity is always associated with either a dataset, a widget or a layer resource, and the type of resource it is associated
to dictates which of 3 endpoints you should use when updating a metadata entity.

In all scenarios, you must be authenticated to be able to update a metadata entity, and meet the following requirements:

- Have the `ADMIN` or `MANAGER` role.
- Belong to the same `application` as the metadata being created. 

Any of these conditions are not met, the API will generate a 403 `Forbidden` error message.

When updating a metadata, you must always specify both `language` and `application`, those will be used to determine which metadata entity will be updated.

> Update metadata for a dataset

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Update metadata for a widget

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Update metadata for a layer

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Real example

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": "rw",
   "language": "en",
   "name": "Cloud Computing Market - USA - 2016",
   "source": "http://www.forbes.com/",
   "info": {
       "summary": "These and many other insights are from the latest series of cloud computing forecasts and market estimates produced by IDC, Gartner, Microsoft and other research consultancies. Amazon’s decision to break out AWS revenues and report them starting in Q1 FY2015 is proving to be a useful benchmark for tracking global cloud growth.  In their latest quarterly results released on January 28, Amazon reported that AWS generated $7.88B in revenues and attained a segment operating income of $1.863B. Please see page 8 of the announcement for AWS financials.  For Q4, AWS achieved a 28.5% operating margin (% of AWS net sales).",
       "author": "Louis Columbus",
       "date": "MAR 13, 2016 @ 10:42 PM",
       "link": "http://www.forbes.com/sites/louiscolumbus/2016/03/13/roundup-of-cloud-computing-forecasts-and-market-estimates-2016/#5875cf0074b0"
   }
  }'
```

> Response

```json
{
  "data": [
    {
      "id": "942b3f38-9504-4273-af51-0440170ffc86-dataset-942b3f38-9504-4273-af51-0440170ffc86-rw-en",
      "type": "metadata",
      "attributes": {
        "dataset": "942b3f38-9504-4273-af51-0440170ffc86",
        "application": "rw",
        "resource": {
          "type": "dataset",
          "id": "942b3f38-9504-4273-af51-0440170ffc86"
        },
        "language": "en",
        "name": "Cloud Computing Market - USA - 2016",
        "source": "http://www.forbes.com/",
        "info": {
          "summary": "These and many other insights are from the latest series of cloud computing forecasts and market estimates produced by IDC, Gartner, Microsoft and other research consultancies. Amazon’s decision to break out AWS revenues and report them starting in Q1 FY2015 is proving to be a useful benchmark for tracking global cloud growth.  In their latest quarterly results released on January 28, Amazon reported that AWS generated $7.88B in revenues and attained a segment operating income of $1.863B. Please see page 8 of the announcement for AWS financials.  For Q4, AWS achieved a 28.5% operating margin (% of AWS net sales).",
          "author": "Louis Columbus",
          "date": "MAR 13, 2016 @ 10:42 PM",
          "link": "http://www.forbes.com/sites/louiscolumbus/2016/03/13/roundup-of-cloud-computing-forecasts-and-market-estimates-2016/#5875cf0074b0"
        },
        "createdAt": "2017-01-20T08:07:53.272Z",
        "updatedAt": "2017-01-20T08:40:30.190Z",
        "status": "published"
      }
    }
  ]
}
```

## Deleting a metadata

As previously discussed, a metadata entity is always associated with either a dataset, a widget or a layer resource, and the type of resource it is associated
to dictates which of 3 endpoints you should use when deleting a metadata entity.

In all scenarios, you must be authenticated to be able to delete a metadata entity, and meet the following requirements:

- Have the `ADMIN` or `MANAGER` role.
- Belong to the same `application` as the metadata being created. 

Any of these conditions are not met, the API will generate a 403 `Forbidden` error message.

When deleting a metadata, you must always specify both `language` and `application`, those will be used to determine which metadata entity will be deleted.

> Delete metadata for a dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata?application=<app-id>&language=<language>
```

> Delete metadata for a widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/metadata?application=<app-id>&language=<language>

```

> Delete metadata for a layer

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/metadata?application=<app-id>&language=<language>
```

> Real example

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/metadata?application=rw&language=en \
```

## Getting all


```shell
curl -X GET https://api.resourcewatch.org/v1/metadata
```

> Real examples

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata
```

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata?type=dataset
```

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata?type=widget
```

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata?application=rw&language=es,en&limit=20
```

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata?application=rw,gfw&language=en&type=dataset
```

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata?language=en
```

## Finding metadata by ids

The `ids` property is required in the body of the request. It can be either an array of ids or a string of comma-separated ids:

- `{"ids": ["112313", "111123"]}`
- `{"ids": "112313, 111123"}`


### Filters

The metadata list provided by the endpoint can be filtered with the following attributes:

Filter        | Description                                                                  | Accepted values
------------- | ---------------------------------------------------------------------------- | -------------------------------------------
application   | Application associated with the metadata entity. Read more about this field [here](/index-rw.html#applications). | any valid text
language      | Language of the metadata entity                                              | any valid text

> Finding metadata by ids for a dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Finding metadata by ids for a widget


```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/widget/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Finding metadata by ids for a layer


```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/layer/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Real example

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
     "ids": "b000288d-7037-43ba-aa34-165eab549613, 942b3f38-9504-4273-af51-0440170ffc86"
  }'
```

> Response

```json
{
  "data": [
    {
      "id": "b000288d-7037-43ba-aa34-165eab549613-dataset-b000288d-7037-43ba-aa34-165eab549613-prep-en",
      "type": "metadata",
      "attributes": {
        "dataset": "b000288d-7037-43ba-aa34-165eab549613",
        "application": "prep",
        "resource": {
          "type": "dataset",
          "id": "b000288d-7037-43ba-aa34-165eab549613"
        },
        "language": "en",
        "name": "Projected temperature change",
        "description": "The Puget Sound region is projected to warm rapidly during the 21st century. Prior to mid-century, the projected increase in air temperatures is about the same for all greenhouse gas scenarios, a result of the fact that a certain amount of warming is already “locked in” due to past emissions. After about 2050, projected warming depends on the amount of greenhouse gases emitted globally in the coming decades. For the 2050s (2040-2069, relative to 1970-1999), annual average air temperature is projected to rise +4.2°F to +5.9°F, on average, for a low (RCP 4.5) and a high (RCP 8.5) greenhouse gas scenario. These indicators are derived from the Multivariate Adaptive Constructed Analogs (MACA) CMIP5 Future Climate Dataset from the University of Idaho. For more information about this analysis, please see http://cses.washington.edu/picea/mauger/ps-sok/ps-sok_sec12_builtenvironment_2015.pdf. For more information about the MACA CMIP5 Future Climate Dataset please see http://maca.northwestknowledge.net/index.php",
        "source": "http://maca.northwestknowledge.net",
        "citation": "Abatzoglou, J. T.,   Brown, T. J. 2012. A comparison of statistical downscaling methods suited for wildfire applications. International Journal of Climatology, 32(5), 772-780. doi: http://dx.doi.org/10.1002/joc.2312 ",
        "license": "Public domain",
        "info": {
          "organization": "Joe Casola, University of Washington",
          "license": "Public domain",
          "source": "http://maca.northwestknowledge.net",
          "citation": "Abatzoglou, J. T.,   Brown, T. J. 2012. A comparison of statistical downscaling methods suited for wildfire applications. International Journal of Climatology, 32(5), 772-780. doi: http://dx.doi.org/10.1002/joc.2312 ",
          "description": "The Puget Sound region is projected to warm rapidly during the 21st century. Prior to mid-century, the projected increase in air temperatures is about the same for all greenhouse gas scenarios, a result of the fact that a certain amount of warming is already “locked in” due to past emissions. After about 2050, projected warming depends on the amount of greenhouse gases emitted globally in the coming decades. For the 2050s (2040-2069, relative to 1970-1999), annual average air temperature is projected to rise +4.2°F to +5.9°F, on average, for a low (RCP 4.5) and a high (RCP 8.5) greenhouse gas scenario. These indicators are derived from the Multivariate Adaptive Constructed Analogs (MACA) CMIP5 Future Climate Dataset from the University of Idaho. For more information about this analysis, please see http://cses.washington.edu/picea/mauger/ps-sok/ps-sok_sec12_builtenvironment_2015.pdf. For more information about the MACA CMIP5 Future Climate Dataset please see http://maca.northwestknowledge.net/index.php",
          "short-description": "Projected temperature change in the Puget Sound Lowlands relative to average temperature between 1950-2005. Light colored lines in the background show the range of projections. All climate scenarios project warming for the Puget Sound region during the 21st century.",
          "subtitle": "",
          "title": "Projected temperature change"
        },
        "createdAt": "2016-12-13T10:02:28.337Z",
        "updatedAt": "2016-12-13T10:03:02.445Z",
        "status": "published"
      }
    },
    {
      "id": "942b3f38-9504-4273-af51-0440170ffc86-dataset-942b3f38-9504-4273-af51-0440170ffc86-rw-en",
      "type": "metadata",
      "attributes": {
        "dataset": "942b3f38-9504-4273-af51-0440170ffc86",
        "application": "rw",
        "resource": {
          "type": "dataset",
          "id": "942b3f38-9504-4273-af51-0440170ffc86"
        },
        "language": "en",
        "name": "Cloud Computing Market - USA - 2016",
        "source": "http://www.forbes.com/",
        "info": {
          "link": "http://www.forbes.com/sites/louiscolumbus/2016/03/13/roundup-of-cloud-computing-forecasts-and-market-estimates-2016/#5875cf0074b0",
          "date": "MAR 13, 2016 @ 10:42 PM",
          "author": "Louis Columbus",
          "summary": "These and many other insights are from the latest series of cloud computing forecasts and market estimates produced by IDC, Gartner, Microsoft and other research consultancies. Amazon’s decision to break out AWS revenues and report them starting in Q1 FY2015 is proving to be a useful benchmark for tracking global cloud growth.  In their latest quarterly results released on January 28, Amazon reported that AWS generated $7.88B in revenues and attained a segment operating income of $1.863B. Please see page 8 of the announcement for AWS financials.  For Q4, AWS achieved a 28.5% operating margin (% of AWS net sales)."
        },
        "createdAt": "2017-01-20T08:07:53.272Z",
        "updatedAt": "2017-01-20T08:40:30.190Z",
        "status": "published"
      }
    }
  ]
}
```
