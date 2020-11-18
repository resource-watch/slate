# Metadata

## What is metadata?

If you are new to the RW API, or want to learn more about the concept of metadata, we strongly encourage you to read the [metadata concept](#metadata) documentation first. It gives you a brief and clear description of what metadata is, and why it is useful.

Once you've read that section, you can come back here to learn more details about using the RW API Metadata feature, which aims to provide summary information about [Datasets](#dataset), [Layers](#layer), and [Widgets](#widget).

[Metadata objects](#metadata-objects) describe things like the name, spatial and temporal coverage, usage rights, and contact information of datasets as well as their associated layers and widgets, uploaded by [WRI](https://www.wri.org/), its partner organizations, or by API users like you.

They are particularly useful for allowing users to find relevant datasets, layers and widgets, understand their context, and for providing useful extra information, such as descriptions, licensing, and citations.

***As such, if you really want people to be able to use your datasets, widgets or layers, it is crucial that it has metadata!***

To find out more about accessing metadata objects already available on the RW API, check out the documentation on [getting metadata objects](#getting-metadata). If you'd like to share your data with the world, you can also [create your own metadata](#creating-metadata) on the RW API, as well as [update](#updating-metadata) and [delete](#deleting-metadata) existing metadata objects.

## Metadata objects

RW API's [approach to metadata](#metadata) is designed to offer flexibility; both in terms of the information contained and languages. Hence, when working with metadata objects it is important to understand a few key concepts. 

The first of which is that metadata objects contains information about another RW API entity - a dataset, a layer or a widget. Thus, each metadata object belongs to a single `resource`, identified by its `type` and `id`. As this `type` + `id` pair directly or indirectly references a dataset, and for convenience, each metadata object also has the dataset identifier to which it's associated.

Another important concept to keep in mind is that each metadata object concerns a single combination of `language` and `application`. If you want to provide translations of your metadata, or if you'd like it to tailor a resource's metadata to better fit different applications, you should create multiple metadata objects for the different combinations of application and language.

Building on top of the two concepts above, it's important to highlight that while each resource can have multiple metadata, it cannot have multiple metadata for the same combination of `language` and `application`. For example, metadata about a tree cover dataset for the [Global Forest Watch](https://www.globalforestwatch.org/) application might be available in both English and Spanish (each a different metadata object), and these may be different compared to metadata objects in the same languages associated with [Resource Watch](https://resourcewatch.org/) application. This example would then represent a total of 4 different metadata objects, all associated with the same dataset.

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
| 400          | Bad request            | "Metadata of resource dataset: `<dataset-id>`, application: `<application>` and language: `<language>` already exists". |
| 401          | Unauthorized           | The token provided is not recognized or is invalid. |
| 403          | Authorization failed.  | Your user account does not have an `ADMIN` or `MANAGER` role or belong to the same `application` group as the resource associated with the metadata object. |


## Getting metadata

There are 2 main ways to retrieve metadata objects from the RW API: using the "get all" endpoint (and optionally adding some filters), or loading metadata by their resource id (either a single element at a time, or multiple in one go) and type.
 
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

#### Application and language filters

> Getting a list of all metadata belonging to the RW application, written in either English or Spanish

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/metadata?application=rw&language=en,es' \
-H 'Content-Type: application/json' \
```

You can filter by `application` and `language` of the metadata by passing query arguments with the same name in your call to this endpoint. You can filter by multiple values at the same time, separating them using using commas.

#### Type filter

> Getting a list of all metadata for widgets

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/metadata?type=widget' \
-H 'Content-Type: application/json' \
```

Using the `type` query parameter you can specify the type of the metadata resource to load. Expected values are `dataset`, `widget` or `layer`, and any other values will produce no results.


#### Limit

> Getting a list of up to 10 metadata

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/metadata?limit=10' \
-H 'Content-Type: application/json' \
```

Using the `limit` query parameter you can specify the maximum number of metadata to load in a single response.

#### Sorting

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


### Getting metadata for a dataset, layer or widget

> Getting metadata associated with a dataset

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata' \
-H 'Content-Type: application/json'
```

> Getting metadata associated with a layer

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer_id>/metadata' \
-H 'Content-Type: application/json'
```

> Getting metadata associated with a widget

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget_id>/metadata' \
-H 'Content-Type: application/json'
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
                "description": "The Percentage of Urban Population with Access to an Improved Water Source is derived by ...",
                "source": "UN WHO/WHO UNICEF JMP WSS",
                "info": {
                    "data_download_link": "null",
                    "frequency_of_updates": "Annual",
                    "date_of_content": "1990-present",
                    "spatial_resolution": "Tabular: National",
                    "geographic_coverage": "Global",
                    "link_to_linense": "http://data.worldbank.org/summary-terms-of-use",
                    "license": "Open: You are free to copy, distribute, adapt, display, or include ...",
                    "citation": "World Bank. 2015. \"World Development Indicators: Improved Water Source (% of Population with Access).\" Retrieved from http://data.worldbank.org/indicator/SH.H2O.SAFE.ZS. Accessed through Resource Watch on [date]. www.resourcewatch.org.",
                    "cautions": "The data on access to an improved water source measure the ...",
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

These endpoints allow you to get metadata for a single dataset, widget or layer. By default, metadata for all languages and applications is returned, but you can use optional query parameters to filter that result.

#### Application and language filters

> Getting a list of all metadata for a given dataset, belonging to the RW application and written in either English or Spanish

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata?application=rw&language=en,es' \
-H 'Content-Type: application/json' \
```

You can filter by `application` and `language` of the metadata by passing query arguments with the same name in your call to this endpoint. You can filter by multiple values at the same time, separating them using using commas.

#### Limit

> Getting a list of all metadata for a given dataset, up to 10 results

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata?limit=10' \
-H 'Content-Type: application/json' \
```

Using the `limit` query parameter you can specify the maximum number of metadata to load in a single response.


### Getting metadata for multiple datasets, layers or widgets

> Getting metadata associated with multiple datasets

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<dataset ids>]
  }'
```

> Getting metadata associated with multiple widgets

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/layer/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<layer ids>]
  }'
```

> Getting metadata associated with multiple widgets

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/widget/metadata/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<widget ids>]
  }'
```


> Response

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
                "description": "The Percentage of Urban Population with Access to an Improved Water Source is derived by ...",
                "source": "UN WHO/WHO UNICEF JMP WSS",
                "info": {
                    "data_download_link": "null",
                    "frequency_of_updates": "Annual",
                    "date_of_content": "1990-present",
                    "spatial_resolution": "Tabular: National",
                    "geographic_coverage": "Global",
                    "link_to_linense": "http://data.worldbank.org/summary-terms-of-use",
                    "license": "Open: You are free to copy, distribute, adapt, display, or include ...",
                    "citation": "World Bank. 2015. \"World Development Indicators: Improved Water Source (% of Population with Access).\" Retrieved from http://data.worldbank.org/indicator/SH.H2O.SAFE.ZS. Accessed through Resource Watch on [date]. www.resourcewatch.org.",
                    "cautions": "The data on access to an improved water source measure the ...",
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


This group of endpoints allows you to access metadata for multiple resources of the same type with a single request. The result will be a flat list of metadata elements, not grouped by their associated resource - it's up to your application to implement this logic if it needs it.

#### Errors for getting metadata for multiple datasets, layers or widgets

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | Missing 'ids' from request body | The required `ids` field is missing in the request body.

#### Application and language filters

> Getting a list of all metadata for multiple widgets, belonging to the RW application and written in either English or Spanish

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset/widget/metadata/find-by-ids?application=rw&language=en,es \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<widget ids>]
  }'
```

You can filter by `application` and `language` of the metadata by passing query arguments with the same name in your call to this endpoint. You can filter by multiple values at the same time, separating them using using commas.


## Creating metadata

> Creating a new metadata for a given dataset

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata' \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json" \
-d '{
  "application": <application>,
  "language": <language>,
  "name": "metadata name"
}'
```

> Creating a new metadata for a given layer

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/metadata' \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json" \
-d '{
  "application": <application>,
  "language": <language>,
  "name": "metadata name"
}'
```

> Creating a new metadata for a given widget

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/metadata' \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json" \
-d '{
  "application": <application>,
  "language": <language>,
  "name": "metadata name"
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

This group of endpoints allows you to associate metadata with an existing dataset, layer or widget. To help make your resources easier to find, understand and reuse, we recommend creating the associated metadata right after you create your new dataset, layer or widget, but you can do it at any time if you want.

As we covered before, the RW API implementation of metadata aims for flexibility, so the only hard requirements when creating a new metadata is that you specify the associate resource id and type, their corresponding dataset id, and the language and application of the metadata. Everything else is up to you to decide if you want to define or not, but the effectiveness of your metadata will increase if you provide more details about your resources. You can learn more about the available fields in the [metadata reference](#metadata-reference) section. 

If you want to create new metadata for your resources, you must have the necessary user account permissions. Specifically, you must:

- the user must be logged in and belong to the same application as the metadata you're creating
- the user must have role `ADMIN` or `MANAGER`


#### Errors for creating metadata

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | `<field>`: `<field>` can not be empty | Your are missing a required field value.
400            | `<field>`: empty or invalid `<field>` | The provided value for `<field>` is invalid. 
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create metadata for an `application` value that is not associated with your user account. 

## Updating metadata

> Updating metadata for a given dataset

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "language": <language>,
   "name": "updated metadata name"
  }'
```

> Updating metadata for a given layer

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/metadata \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "language": <language>,
   "name": "updated metadata name"
  }'
```

> Updating metadata for a given widget

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/metadata \
-H "Authorization: Bearer <auth_token>" \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "language": <language>,
   "name": "updated metadata name"
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


To update an existing metadata, you need to issue a PATCH request to the endpoint that matches your resource type and id, specify the new values you want to use. You can update most of the fields listed in the [metadata reference](#metadata-reference) section, apart from:

- `id`
- `userId`
- `createdAt` and `updatedAt`
- `language` and `application`
- `dataset`
- `resource`

One important detail is that you MUST specify, in your request body, both the `application` and `language` values of the metadata you're trying to update. These fields will not be used as new values, as you would expect, but are used to pinpoint exactly which metadata entry will be updated - remember that each resource may have multiple metadata associated with it, but only one per application-language pair.

Also keep in mind that, when updating object type fields, your new value will overwrite the previous value for that field entirely - it's up to you to implement any sort of data merge logic you'd like to see happen.

To perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the metadata that's being updated 
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the metadata owner (through the `userId` field of the metadata)


### Errors for updating metadata

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You need to be logged in to be able to update metadata.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the metadata owner (through the `userId` field of the metadata).
403            | Forbidden      | You are trying to update metadata with an `application` value that is not associated with your user account. 
404            | Metadata of resource <resource type>: <resource id> doesn't exist   | Metadata matching the provided resource data, language and application does not exist.


## Cloning dataset metadata

> Cloning metadata for a given dataset

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata/clone' 
-H 'Content-Type: application/json' \
-H "Authorization: Bearer <auth_token>" -d \
'{
    "newDataset": "<targer dataset>",
    "application": "<application>"
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

This endpoint allows you to clone all the existing metadata associated with a dataset, as new metadata associated with a different dataset. Note that this will not clone metadata for widgets or layers associated with the defined dataset; only dataset metadata will be cloned.

When calling this endpoint, you must provide two body parameters:

- `newDataset`: the id of the target dataset to which the cloned metadata will be associated.
- `application`: an application to which your user account is associated. This is not used in the cloning logic.

A successful cloning will return a list of all metadata created in this process.

To perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the metadata that's being updated 
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the metadata owner (through the `userId` field of the metadata)

### Errors for cloning metadata

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | - newDataset: newDataset can not be empty. -    | You need to specify the `newDataset` body parameter.
400            | Metadata of resource dataset: <new dataset>, application: <application> and language: <language> already exists    | The target dataset already has metadata associated with it, and cloning the metadata from the source dataset would cause it to have more than one metadata per language and application.
401            | Unauthorized   | You need to be logged in to be able to update metadata.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the metadata owner (through the `userId` field of the metadata).
403            | Forbidden      | You are trying to clone metadata with an `application` value that is not associated with your user account. 
404            | Metadata of resource <resource type>: <resource id> doesn't exist   | Metadata matching the provided resource data, language and application does not exist.


## Deleting metadata


> Deleting metadata for a given dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/metadata?application=<application>&language=<language> \
-H "Authorization: Bearer <auth_token>" 
```

> Deleting metadata for a given layer

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/metadata?application=<application>&language=<language> \
-H "Authorization: Bearer <auth_token>" 
```

> Deleting metadata for a given widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/metadata?application=<application>&language=<language> \
-H "Authorization: Bearer <auth_token>" 
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

The metadata delete endpoint allows you to delete a single metadata at a time, provided you have the necessary permissions. Besides the details provided in the URL itself, you must also specify, as query parameters, both the `application` and `language` values of the metadata you're trying to delete. These fields will be used to pinpoint exactly which metadata entry will be deleted - remember that each resource may have multiple metadata associated with it, but only one per application-language pair.

To perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the metadata that's being deleted
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the metadata owner (through the `userId` field of the metadata)

### Errors for deleting metadata

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | Bad request    | Your request does not include the `application` or `language` query parameters.
401            | Unauthorized   | You need to be logged in to be able to delete metadata.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the metadata owner (through the `userId` field of the metadata).
403            | Forbidden      | You are trying to delete metadata with an `application` value that is not associated with your user account. 
404            | Metadata of resource <resource type>: <resource id> doesn't exist   | Metadata matching the provided resource data, language and application does not exist.

  
## Metadata reference

This section gives you a complete view at the properties that are maintained as part of metadata objects. When interacting with metadata objects (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

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
