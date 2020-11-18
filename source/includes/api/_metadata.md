# Metadata

## TODO LIST

+ check if a vocab is used for language, and application
+ check how parameter `sort` works
+ check if `type` filters in `/dataset/<dataset_id>/metadata`
+ combine overview table; make description of CRUD per common endpoint?

## What is metadata?

If you are new to the RW API, or want to learn more about the concept of a metadata, we strongly encourage you to read the [metadata concept](#metadata) documentation first. It gives you a brief and clear description of what a metadata is, and why it is useful.

Once you've read that section, you can come back here to learn more details about using the RW API Metadata feature, which aims to provide summary information about [Datasets](#dataset), [Layers](#layer), and [Widgets](#widget).

[Metadata objects](#metadata-objects) describe things like the name, spatial and temporal coverage, usage rights, and contact information of datasets as well as their associated layers and widgets, uploaded by [WRI](https://www.wri.org/), its partner organizations, or by API users like you.

They are particularly useful for allowing users to find relevant datasets, layers and widgets, understand their context, and for providing useful extra information, such as descriptions, licensing, and citations.

***As such, if you really want people to be able to use your datasets, widgets or layers, it is crucial that it has metadata!***

To find out more about accessing metadata objects already available on the RW API, check out the documentation on [getting metadata objects](#getting-metadata-objects). If you'd like to share your data with the world, you can also [create your own metadata objects](#create-metadata-objects) on the RW API, as well as [update](#update-metadata-objects) and [delete](#delete-metadata-objects) existing metadata objects.

## Metadata objects

RW API's [approach to metadata](#metadata) is designed to offer flexibility; both in terms of the information contained and languages. Hence, when working with metadata objects it is important to understand a few key concepts. 

The first of which is that a metadata object contains information about another RW API entity - a dataset, a layer or a widget. Thus, each metadata object belongs to a single `resource`, identified by its `type` and `id`. As this `type` + `id` pair directly or indirectly references a dataset, and for convenience, each metadata object also has the dataset identifier to which it's associated.

Another important concept to keep in mind is that each metadata object concerns a single `language` and `application`. If you want to provide translations of your metadata, or if you'd like it to tailor a resource's metadata to better fit different applications, you should create multiple metadata objects for the different combinations of application and language.

Building on top of the two concepts above, it's important to highlight that while each resource can have multiple metadata, it cannot have multiple metadata for the same language + application combination. For example, metadata about a tree cover dataset for the [Global Forest Watch](https://www.globalforestwatch.org/) application might be available in both English and Spanish (each a different metadata object), and these may be different compared to metadata objects in the same languages associated with [Resource Watch](https://resourcewatch.org/) application. This example would then represent a total of 4 different metadata objects, all associated with the same dataset.

When it comes to its internal structure, metadata objects have a balance of structured and free-format fields that promote a common base across all objects, while allowing different applications and use cases to have their own specific structure and details. You can learn more about the available fields in the [metadata reference](#metadata-reference) section.

Last but not least, it's important to keep in mind that the behavior of metadata objects and endpoints aims to be, as much as possible, independent from the target resource it references. In the detailed endpoint documentation below we'll cover the different endpoints in depth, and highlight the differences in behavior when handling different resource types, but you can safely assume that, for most of it, behavior described for a type of resource will be the same for all 3 types.

## Metadata endpoints overview

As covered above, each metadata object directly concerns a single dataset, widget or layer. The endpoint structure mostly reflects that, with each metadata action (getting, creating, modifying or deleting metadata) being available through 3 different endpoints, one for each type of resource. These endpoints will be documented as a single element, as they behave in exactly the same way, with the only difference between them being the actual endpoint URL. Any differences that may exist will be pointed out, but those will be rare. The only exceptions are the endpoints to load all metadata (which ignores resource type) and to clone a dataset's metadata, which doesn't have a widget or layer equivalent.

Any user can retrieve metadata objects, however to create, update or delete and object the appropriate [authentication](#authentication) credentials are required:

- You must be a user with role:
    - `ADMIN`, or
    - `MANAGER` and own the metadata resource you are trying to manage.
- You must belong to the same `application` as the resource associated with the metadata object.

> Overview of error messages

| Error code   | Error message          | Description |
-------------- | ---------------------- | --------------
| 400          | Bad request            | Query or body parameters are not valid. |
| 400          | Bad request            | "Metadata of resource dataset: `<dataset_id>`, application: `<application>` and language: `<language>` already exists". |
| 401          | Unauthorized           | The token provided is not recognized or is invalid. |
| 403          | Authorization failed.  | Your user account does not have an `ADMIN` or `MANAGER` role or belong to the same `application` group as the resource associated with the metadata object. |


## Getting metadata

There are 2 main ways to retrieve metadata objects from the RW API: using the "get all" endpoint (and optionally adding some filters), or loading metadata by their id (either a single element at a time, or multiple in one go) and resource type.
 
Remembering that each resource [may have many metadata objects](#metadata-objects) associated with it. In general, you will usually want to use the filter parameters `application` and `language`, which may be one or many of valid RW API applications and languages.
 
### Getting all metadata

> Getting a list of all metadata

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/metadata?application=rw,gfw&language=en,es&type=dataset&limit=1' \
-H 'Content-Type: application/json' \
```

> Getting a list of all metadata with optional parameters

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/metadata?application=rw,gfw&language=en,es&type=dataset&limit=1' \
-H 'Content-Type: application/json' \
```

> Example response

```json
{
    "data": [
        {
            "id": "57cfffd6129c3c100054c383",
            "type": "metadata",
            "attributes": {
                "dataset": "0ffe5ad6-c920-421b-b69c-bc8893155df4",
                "application": "gfw",
                "resource": {
                    "id": "0ffe5ad6-c920-421b-b69c-bc8893155df4",
                    "type": "dataset"
                },
                "language": "en",
                "name": "",
                "description": "",
                "source": "",
                "citation": "",
                "license": "",
                "info": {
                    "organization": "",
                    "license": "",
                    "source": "",
                    "citation": "",
                    "description": "",
                    "short-description": "",
                    "subtitle": "",
                    "title": ""
                },
                "createdAt": "2016-12-13T10:02:28.337Z",
                "updatedAt": "2016-12-13T10:03:02.445Z",
                "status": "published"
            }
        }
    ]
}
```

This endpoint will allow you to get the list of the metadata available in the API, and it's the only endpoint that will allow you to load metadata for multiple resources at once.

It's worth pointing out that, unlike other similar endpoints on the RW API, this endpoint does NOT have pagination by default. If you query it without any of the optional parameters, you will get a list of all metadata objects for all datasets, widgets and layers. This is strongly discouraged, and you should not rely on this behavior - when using this endpoint, you should aim to use a combination of parameters to narrow down your response pool. You should also expect a future update to this endpoint to introduce pagination on all responses, so try to keep this in mind when using this endpoint on your application.

For a detailed description of each field, check out the [Metadata reference](#metadata-reference) section.

In the sections below, we’ll explore the optional parameters supported by this, which we strongly recommend you use.

### Application and language filters

> Getting a list of all metadata belonging to the RW application, written in either English or Spanish

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/metadata?application=rw&language=en,es' \
-H 'Content-Type: application/json' \
```

You can filter by `application` and `language` of the metadata by passing query arguments with the same name in your call to this endpoint. You can filter by multiple values at the same time, separating them using using commas.

### Type filter

> Getting a list of all metadata for widgets

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/metadata?type=widget' \
-H 'Content-Type: application/json' \
```

Using the `type` query parameter you can specify the type of the metadata resource to load. Expected values are `dataset`, `widget` or `layer`, and any other values will produce no results.


### Limit

> Getting a list of up to 10 metadata

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/metadata?limit=10' \
-H 'Content-Type: application/json' \
```

Using the `limit` query parameter you can specify the maximum number of metadata to load in a single response.

### Sorting

> Sorting metadata

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata?sort=name
```

> Sorting metadata by multiple criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata?sort=name,description
```

> Sort by name descending, description ascending

```shell
curl -X GET https://api.resourcewatch.org/v1/metadata?sort=-name,+description
```

The API currently supports sorting by means of the `sort` query parameter. Sorting can be done using any field from the [metadata model](#metadata-reference). Sorting by nested fields is not supported at the moment.

Multiple sorting criteria can be used, separating them by commas.

You can also specify the sorting order by prepending the criteria with either `-` for descending order or `+` for ascending order. By default, ascending order is assumed.

### Getting metadata by id

> Request pattern for finding metadata providing an array of dataset ids

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Request pattern for finding metadata providing an array of layer ids

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/layer/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Request pattern for finding metadata providing an array of widget ids

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/layer/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Example URL request

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
            "id": "57a21d19aee6c90e0029deca",
            "type": "metadata",
            "attributes": {
                "dataset": "b000288d-7037-43ba-aa34-165eab549613",
                "application": "prep",
                "resource": {
                    "id": "b000288d-7037-43ba-aa34-165eab549613",
                    "type": "dataset"
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
            "id": "5881c5593d81e10b00e6a599",
            "type": "metadata",
            "attributes": {
                "dataset": "942b3f38-9504-4273-af51-0440170ffc86",
                "application": "rw",
                "resource": {
                    "id": "942b3f38-9504-4273-af51-0440170ffc86",
                    "type": "dataset"
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

### Getting metadata for a specific dataset, layer or widget

> Request pattern for finding metadata associated with a dataset

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset_id>/metadata?application=<application>&language=<language>&type=<types>' \
-H 'Content-Type: application/json'
```

> Request pattern for finding metadata associated with a layer

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset_id>/layer/<layer_id>/metadata?application=<application>&language=<language>' \
-H 'Content-Type: application/json'
```

> Request pattern for finding metadata associated with a widget

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget/<widget_id>//metadata?application=<application>&language=<language>' \
-H 'Content-Type: application/json'
```

> Example URL request

```shell
curl -L -X GET 'http://api.resourcewatch.org/v1/dataset/f2fe7588-6d1b-400e-b79c-0c86bf1273ea/metadata?application=rw&language=en&type=datset' \
-H 'Content-Type: application/json' \
```

> Example response

```json
{
    "data": [
        {
            "id": "595f836c0d9ed1000bc29a91",
            "type": "metadata",
            "attributes": {
                "dataset": "f2fe7588-6d1b-400e-b79c-0c86bf1273ea",
                "application": "rw",
                "resource": {
                    "id": "f2fe7588-6d1b-400e-b79c-0c86bf1273ea",
                    "type": "dataset"
                },
                "language": "en",
                "name": "Urban Population with Access to an Improved Water Source",
                "description": "The Percentage of Urban Population with Access to an Improved Water Source is derived by the WHO/UNICEF Joint Monitoring Programme based on national censuses and nationally representative household surveys. The coverage rates for water and sanitation are based on information from service users on the facilities their households actually use rather than on information from service providers, which may include nonfunctioning systems. WHO/UNICEF define an improved drinking-water source as one that, by nature of its construction or through active intervention, is protected from outside contamination, in particular from contamination with fecal matter. Improved water sources include piped water into dwelling, plot, or yard; piped water into a neighbor's plot; public tap/standpipe; tube well/borehole; protected dug well; protected spring; and rainwater. These data are produced annually; for additional information, please see http://data.worldbank.org/indicator/SH.H2O.SAFE.UR.ZS.",
                "source": "UN WHO/WHO UNICEF JMP WSS",
                "info": {
                    "data_download_link": "null",
                    "frequency_of_updates": "Annual",
                    "date_of_content": "1990-present",
                    "spatial_resolution": "Tabular: National",
                    "geographic_coverage": "Global",
                    "link_to_linense": "http://data.worldbank.org/summary-terms-of-use",
                    "license": "Open: You are free to copy, distribute, adapt, display, or include the data in other products for commercial and noncommercial purposes at no cost subject to the following limitations: You must include attribution for the data you use in the manner indicated in the metadata included with the data. You must not claim or imply that the World Bank endorses your use of the data or use the World Bank’s logo(s) or trademark(s) in conjunction with such use.",
                    "citation": "World Bank. 2015. \"World Development Indicators: Improved Water Source (% of Population with Access).\" Retrieved from http://data.worldbank.org/indicator/SH.H2O.SAFE.ZS. Accessed through Resource Watch on [date]. www.resourcewatch.org.",
                    "cautions": "The data on access to an improved water source measure the percentage of the population with ready access to water for domestic purposes. Access to drinking water from an improved source does not ensure that the water is safe or adequate, as these characteristics are not tested at the time of survey. But improved drinking water technologies are more likely than those characterized as unimproved to provide safe drinking water and to prevent contact with human excreta. While information on access to an improved water source is widely used, it is extremely subjective, and such terms as \"safe,\" \"improved,\" \"adequate,\" and \"reasonable\" may have different meanings in different countries despite official WHO definitions. Even in high-income countries, treated water may not always be safe to drink. Access to an improved water source is equated with connection to a supply system; it does not take into account variations in the quality and cost (broadly defined) of the service.",
                    "learn_more_link": "http://data.worldbank.org/indicator/SH.H2O.SAFE.ZS",
                    "source_organization_link": "null",
                    "source_organization": "United Nations World Health Organization (UN WHO)/World Health Organization and United Nations Children's Fund Joint Monitoring Programme for Water Supply and Sanitation (WHO UNICEF JMP WSS)",
                    "function": "This data set displays the percentage of urban population with access to an improved drinking water source in a dwelling or located within a convenient distance from the user's dwelling.",
                    "functions": "This data set displays the percentage of urban population with access to an improved drinking water source in a dwelling or located within a convenient distance from the user's dwelling.",
                    "name": "Urban Population with Access to an Improved Water Source",
                    "technical_title": "Percentage of Urban Population with Access to an Improved Water Source (WHO/UNICEF)"
                },
                "columns": {
                    "year": {
                        "description": "Measured year",
                        "alias": "Year"
                    },
                    "value": {
                        "alias": "Value"
                    },
                    "country": {
                        "alias": "Country Name"
                    },
                    "iso": {
                        "alias": "ISO-3 Country Code"
                    }
                },
                "createdAt": "2017-07-07T12:49:48.721Z",
                "updatedAt": "2017-08-28T14:30:17.701Z",
                "status": "published"
            }
        }
    ]
}
```


## Create a metadata object

To associate a metadata object with a dataset, and it's layers or widgets you need to provide your authorization token (`<auth_token>`) in the header, and POST a JSON object that must contain valid values for the fields `application` and `language` to the appropriate `/dataset/<dataset_id>` endpoint. If the object is correctly added to the entity a `200` response is returned, as well as the new metadata object. If the user is not authorized to create metadata objects a `403` error is returned; see the required [credentials](#overview-of-available-endpoints).

> Example request pattern dataset

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata' \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json" \
-d '{
  "application": <app>,
  "language": <language>
}'
```

> Example request pattern dataset layer

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/metadata' \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json" \
-d '{
  "application": <app>,
  "language": <language>
}'
```

> Example request pattern dataset widget

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/metadata' \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json" \
-d '{
  "application": <app>,
  "language": <language>
}'
```

> Example dataset URL request

```shell
curl -X POST 'http://api.resourcewatch.org/v1/dataset/44c7fa02-391a-4ed7-8efc-5d832c567d57/metadata' \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json" \
-d '{
  "application": "gfw",
  "language": "es"
}'
```

> Example response

```json
{
    "data": [
        {
            "id": "5f99b9317fe3c8001be2f272",
            "type": "metadata",
            "attributes": {
                "dataset": "44c7fa02-391a-4ed7-8efc-5d832c567d57",
                "application": "gfw",
                "resource": {
                    "id": "44c7fa02-391a-4ed7-8efc-5d832c567d57",
                    "type": "dataset"
                },
                "language": "es",
                "createdAt": "2020-10-28T18:32:17.464Z",
                "updatedAt": "2020-10-28T18:32:17.464Z",
                "status": "published"
            }
        }
    ]
}
```


## Updating a metadata object

As for creation, the endpoints for updating metadata objects follow the `dataset/<dataset_id>`, `layer/<layer_id>`, and `widget/<widget_id>` style. You need to provide your authorization token (`<auth_token>`) in the header, have the correct RW API [credentials](#overview-of-available-endpoints), and PATCH a JSON object that must contain valid values for the fields `application` and `language`. If the object is correctly updated a `200` response is returned, as well as the updated metadata object. 

> Error codes

If the user is not authorized to update metadata objects a `403` error is returned; see the required [credentials](#overview-of-available-endpoints). If the request is invalid a `400` error is returned; potentially with a more detailed error message.

> Request pattern for updating the metadata of a dataset by its id

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Request pattern for updating the metadata of a layer by its id

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Request pattern for updating the metadata of a widget by its id

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>metadata \
-H "Content-Type: application/json"  -d \
 '{
   "application": <app>,
   "language": <language>
  }'
```

> Example URL request

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

> Example response

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

## Deleting a metadata object

As for creation and updating, the endpoints for deleting metadata objects follow the `dataset/<dataset_id>`, `layer/<layer_id>`, and `widget/<widget_id>` style. You need to provide your authorization token (`<auth_token>`) in the header, and you must provide valid values for the parameters `application` and `language`. If the object is correctly deleted a `200` response is returned. If the user is not authorized to delete metadata objects a `403` error is returned; see the required [credentials](#overview-of-available-endpoints). If the request is invalid a `400` error is returned; potentially with a more detailed error message.

> Request pattern for deleting the metadata of a dataset by its id

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata?application=<app-id>&language=<language>
```

> Request pattern for deleting the metadata of a layer by its id

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/metadata?application=<app-id>&language=<language>
```

> Request pattern for deleting the metadata of a widget by its id

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/metadata?application=<app-id>&language=<language>
```

> Example URL request

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/metadata?application=rw&language=en \
```

  
## Metadata reference

This section gives you a complete view at the properties that are maintained as part of a metadata object. When interacting with a metadata object (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/resource-watch/rw_metadata/blob/dev/app/src/models/metadata.model.js).

Field name              | Type           | Required             | Default value              | Description                                                                  
----------------------- | -------------- | -------------------- |----------------------------| ---------------------------------------------------------------------------- 
id                      | String         | Yes (autogenerated)  |                            | Unique Id of the metadata. Auto generated on creation. Cannot be modified by users.   
dataset                 | String         | Yes                  |                            | Id of the dataset to which the metadata object corresponds. Set on metadata creation, cannot be modified.   
application             | Array          | Yes                  |                            | Applications associated with this metadata. Read more about this field [here](/index-rw.html#applications).
resource.id             | String         | Yes                  |                            | Id of the resource associated with the metadata.                                                         
resource.type           | String         | Yes                  |                            | Type of the resource associated with the metadata.                                                         
userId                  | String         | Yes (autopopulated)  |                            | Id of the user who created the metadata. Set automatically on creation. Cannot be modified by users.
language                | String         | Yes                  |                            | Language in which the metadata details are written. While not enforced, we strongly recommend using 2 character language codes.
name                    | String         | No                   |                            | Name of the metadata.
description             | String         | No                   |                            | User defined description of the metadata.   
status                  | String         | No                   | published                  | Publication status of the metadata. Defaults to `published`, can alternatively be set to `unpublished`.
source                  | String         | No                   |                            | Source information about the associated resource
citation                | String         | No                   |                            | Citation information about the associated resource
license                 | String         | No                   |                            | License named used for the associated resource
units                   | Object         | No                   |                            | Free-form object mapping each of the associated resource's fields to a unit
info                    | Object         | No                   |                            | Free-form object for custom information about the associated resource 
columns                 | Object         | No                   |                            | Free-form object mapping each of the associated resource's fields to a free-form object containing more details. 
applicationProperties   | Object         | No                   |                            | Free-form object containing application-specific information about the associated resource
createdAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the metadata was created. Cannot be modified by users.                     
updatedAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the metadata was last updated. Cannot be modified by users.                
