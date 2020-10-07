# Dataset

## What is a dataset?

If you are new to the RW API, or want to learn more about the concept of a dataset, we strongly encourage you to read the [dataset concept](#dataset) documentation first. It gives you a brief and clear description of what a dataset is, and what it can do for you.

Once you've read that section, you can come back here to learn more details about using the RW API's datasets feature. The RW API is home to many datasets uploaded by [WRI](https://www.wri.org/), its partner organizations, or by API users like you. These datasets contain a lot of information about a wide range of topics that you may want to learn about or build on top of. To find out more about finding and accessing the datasets already available on the RW API, check out the documentation on [getting datasets](#getting-all-datasets). A nice, visual way to explore existing datasets is by using the [Resource Watch](https://resourcewatch.org/) website. 

You can also [create you own datasets](#creating-a-dataset) on the RW API, if you'd like to share your data with the world, or 
 if you are looking to use the RW API and its features to gain insights into your data.

## Getting all datasets

This endpoint will allow you to get the list of the datasets available in the API, and it's a great place for new users to start exploring the RW API. By default, this endpoint will give you a paginated list of 10 datasets. In the sections below, we'll explore how you can customize this endpoint call to match your needs. 

For a detailed description of each field, check out the [Dataset reference](#dataset-reference) section.

> Getting a list of datasets

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset
```

> Response:

```json
{
    "data": [
        {
        "id": "00f2be42-1ee8-4069-a55a-16a988f2b7a0",
        "type": "dataset",
        "attributes": {
            "name": "Glad points",
            "slug": "Glad-points-1490086842129",
            "type": null,
            "subtitle": null,
            "application": ["data4sdgs"],
            "dataPath": null,
            "attributesPath": null,
            "connectorType": "document",
            "provider": "csv",
            "userId": "58333dcfd9f39b189ca44c75",
            "connectorUrl": "http://gfw2-data.s3.amazonaws.com/alerts-tsv/glad_headers.csv",
            "sources": [],
            "tableName": "data",
            "status": "pending",
            "published": true,
            "overwrite": false,
            "env": "production",
            "geoInfo": false,
            "legend": {
                "date": [],
                "region": [],
                "country": []
                },
            "clonedHost": {},
            "errorMessage": null,
            "updatedAt": "2017-01-13T10:45:46.368Z",
            "widgetRelevantProps": [],
            "layerRelevantProps": []
            }
        }
  ],
  "links": {
    "self": "http://api.resourcewatch.org/v1/dataset?page[number]=1&page[size]=10",
    "first": "http://api.resourcewatch.org/v1/dataset?page[number]=1&page[size]=10",
    "last": "http://api.resourcewatch.org/v1/dataset?page[number]=99&page[size]=10",
    "prev": "http://api.resourcewatch.org/v1/dataset?page[number]=1&page[size]=10",
    "next": "http://api.resourcewatch.org/v1/dataset?page[number]=2&page[size]=10"
  },
  "meta": {
    "total-pages": 99,
    "total-items": 990,
    "size": 10
  }
}
```

### Pagination

The RW API lists many of its resources as pages, as opposed to showing all results at once. By default, datasets are listed in pages of 10 datasets each, and the first page is loaded. However, you can customize this behavior using the following query parameters:  

> Custom pagination: load page 2 using 25 results per page

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?page[number]=2&page[size]=25
```

Field        |         Description          |   Type |   Default
------------ | :--------------------------: | -----: | ----------:
page[size]   | The number elements per page. Values above 100 are not officially supported. | Number | 10
page[number] |       The page number        | Number | 1


### Search

> Search for datasets

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?search=wind
```

The dataset service offers a simple yet powerful search mechanism that will help you look for datasets. The query argument `search` allows you to specify a search string that will match:

- The dataset name.
- The dataset's metadata name.
- The dataset's metadata description.
- The [relational graph](#graph) node list.


### Filters

> Filtering datasets

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?name=birds&provider=cartodb
```

> Matching vocabulary tags

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?vocabulary[legacy]=umd
```

The dataset list provides a wide range of parameters that you can use to tailor your dataset listing. Most of these parameters reflect fields you'll find in a dataset itself (which you can learn more about in the [Dataset reference](#dataset-reference) section), while others are convenience filters for things like user role or favourites. These parameters can be combined into a complex `and` logic query.

Here's the comprehensive list of filters supported by datasets:
 

Filter         | Description                                                                  | Type        | Expected values
-------------- | ---------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------
name           | Filter returned datasets by the name of the dataset.                         | String      | any valid text
slug           | Filter returned datasets by the slug of the dataset.                         | String      | any valid text
type           | Filter returned datasets by dataset type.                                    | String      | any valid text
subtitle       | Filter returned datasets by dataset subtitle.                                | String      | any valid text
application    | Applications associated to this dataset. Read more about this field [here](/index-rw.html#applications). | Array       | any valid text
applicationConfig | If the dataset has `applicationConfig` data (i.e. contains a non-empty object in the `applicationConfig` field) | Boolean | `true` or `false`
dataPath       |                                                                              | String      | any valid text
attributesPath |                                                                              | String      | any valid text
connectorType  | Filter returned datasets by the type of connector used.                      | String      | `rest`, `document` or `wms`
provider       | Dataset provider this include inner connectors and 3rd party ones            | String      | [Check the available providers when creating a dataset](index-rw.html#creating-a-dataset)
connectorUrl   |                                                                              | String      | any valid text
sources        |                                                                              | Array       | any valid text
tableName      |                                                                              | String      | any valid text
userId         | Filter results by the owner of the dataset. Does not support regexes.        | String      | valid user id
status         | Filter results by the current status of the dataset.                         | String      | `pending`, `saved` or `failed`
overwrite      | If the data can be overwritten (only for being able to make dataset updates) | Boolean     | `true`or `false`
errorMessage   | If this dataset is in `error` state, this field may contain additional details about the error. | String      | any valid text
mainDateField  |                                                                              | String      | any valid text
published      | If the dataset is published or not.                                          | Boolean     | `true`or `false`
env            | Environment to which the dataset belongs. Multiple values can be combined using `,` as a separator. Does not support regexes. | String      | any valid text. Defaults to `production`. 
geoInfo        | If it contains interceptable geographical info                               | Boolean     | `true`or `false`
protected      | If the dataset is protected.                                                 | Boolean     | `true`or `false`
taskId         | Id of the latest task associated with this dataset. Typically only present in `document` connectorType datasets | String      | any valid text
legend.lat     |                                                                              | String      | any valid text
legend.long    |                                                                              | String      | any valid text
legend.date    |                                                                              | Array       | any valid text
legend.region  |                                                                              | Array       | any valid text
legend.country |                                                                              | Array       | any valid text
legend.nested  |                                                                              | Array       | any valid text
legend.integer |                                                                              | Array       | any valid text
legend.short   |                                                                              | Array       | any valid text
legend.byte    |                                                                              | Array       | any valid text
legend.double  |                                                                              | Array       | any valid text
legend.byte    |                                                                              | Array       | any valid text
legend.float   |                                                                              | Array       | any valid text
legend.half_float |                                                                           | Array       | any valid text
legend.scaled_float |                                                                         | Array       | any valid text
legend.boolean |                                                                              | Array       | any valid text
legend.binary  |                                                                              | Array       | any valid text
legend.text    |                                                                              | Array       | any valid text
legend.keyword |                                                                              | Array       | any valid text
clonedHost.hostProvider |                                                                     | String      | any valid text
clonedHost.hostUrl |                                                                          | String      | any valid text
clonedHost.hostId |                                                                           | String      | any valid text
clonedHost.hostType |                                                                         | String      | any valid text
clonedHost.hostPath |                                                                         | String      | any valid text
widgetRelevantProps |                                                                         | Array       | any valid text
layerRelevantProps |                                                                          | Array       | any valid text
subscribable   | If the dataset is subscribable (i.e. contains a non-empty object in the `subscribable` field) | Boolean     | `true` or `false`
user.role      | Filter results by the role of the owner of the dataset. If the requesting user does not have the ADMIN role, this filter is ignored. | String      | `ADMIN`, `MANAGER` or `USER`
vocabulary[name]| Filter returned datasets by vocabulary tags. Does not support regexes.       | String      | any valid text
collection     | Filter returned datasets collection id. Does not support regexes.            | String      | any valid text
favourite      | Filter by favourited datasets. See [this section](#favorites) for more info. Does not support regexes. | String      | any valid text


Please keep in mind the following:

- String types support and expect a regex value, unless detailed otherwise on the `Description` field. Although typically they will match exact strings, you may have to escape certain characters (PCRE v8.42 spec).
- Array types support multiple values. Use `,` as an `or` multi-value separator, or `@` as a multi-value, exact match separator.
- Object types expect a boolean value, where `true` matches a non-empty object, and `false` matches an empty object.


### Sorting

#### Basics of sorting

> Sorting datasets

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=name
```

> Sorting datasets by multiple criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=name,description
```

> Sort by name descending, description ascending

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-name,+description
```

> Sorting datasets by the role of the user who owns the dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=user.role
```

The API currently supports sorting by means of the `sort` query parameter. Sorting can be done using any field from the [dataset model](#dataset-reference), as well as `user.name` and `user.role` (sorting by user data is restricted to ADMIN users). Sorting by nested fields is not supported at the moment.

Multiple sorting criteria can be used, separating them by commas.

You can also specify the sorting order by prepending the criteria with either `-` for descending order or `+` for ascending order. By default, ascending order is assumed.

#### Special sorting criteria

> Sorting datasets with special criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-most-favorited
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=relevance&status=saved&search=agriculture
```

Special search criteria must be used as sole sorting criteria, as it's not possible to combine any of them with any other search criteria. The following criteria can be used for special sorting in datasets:

* `most-viewed` delegates sorting to the graph component, sorting by the datasets that have been queried more frequently. Supports ascending/descending order.
* `most-favorited`: delegates sorting to the graph component, sorting by the datasets that have been more favorited. Supports ascending/descending order.
* `relevance`: delegates sorting to the metadata component, sorting by the datasets which metadata better match the search criteria. Can only be used in conjunction with a `search` parameter. Does not support ascending order.

You can specify the sorting order by prepending the criteria with either `-` for descending order or `+` for ascending order. By default, ascending order is assumed.

### Include entities associated with the datasets

> Loads metadata and widgets associated with each dataset:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?includes=metadata,widget
```

```json
{
    "data": [
        {
            "id": "06c44f9a-aae7-401e-874c-de13b7764959",
            "type": "dataset",
            "attributes": {
                "name": "Historical Precipitation -- U.S. (Puget Sound Lowlands)",
                "slug": "Historical-Precipitation-US-Puget-Sound-Lowlands-1490086842133",
                ...
                "metadata": [
                    {  
                    
                        "id": "57a2251d5cd6980a00e054d9",
                        "type": "metadata",
                        "attributes": { ... }
                    }
                ],
                "widget": [
                    {  
                        "id": "73f00267-fe34-42aa-a611-13b102f38d75",
                        "type": "widget",
                        "attributes": { ... }
                    }
                ]
            }
        }
    ],
    "links": {
        "self": "http://api.resourcewatch.org/v1/dataset?includes=widget%2Cmetadata&page[number]=1&page[size]=10",
        "first": "http://api.resourcewatch.org/v1/dataset?includes=widget%2Cmetadata&page[number]=1&page[size]=10",
        "last": "http://api.resourcewatch.org/v1/dataset?includes=widget%2Cmetadata&page[number]=223&page[size]=10",
        "prev": "http://api.resourcewatch.org/v1/dataset?includes=widget%2Cmetadata&page[number]=1&page[size]=10",
        "next": "http://api.resourcewatch.org/v1/dataset?includes=widget%2Cmetadata&page[number]=2&page[size]=10"
    },
    "meta": {
        "total-pages": 223,
        "total-items": 2228,
        "size": 10
    }
}
```

> Loading layers for the given dataset

```shell
curl -X GET http://api.resourcewatch.org/dataset?includes=layer
```

> Loading the information about the user who authored the dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?includes=user
```

When fetching datasets, you can request additional entities to be loaded. The following entities are available:

* `widget` - loads all widgets associated with each dataset.
* `layer` - loads all layers associated with each dataset.
* `vocabulary` - loads all vocabulary entities associated with each dataset.
* `metadata` - loads all metadata associated with each dataset.
* `user` - loads the name, email address and role of the author of the dataset. If you do not issue this request as an `ADMIN` user, or if no user data is available, the `user` object will be empty.

**Note:** If you include related entities (e.g. layers) with query filters, the filters will not cascade to the related entities.

## Getting a dataset by id or slug

> Getting a dataset by id:

```shell
curl -X GET "https://api.resourcewatch.org/v1/dataset/51943691-eebc-4cb4-bdfb-057ad4fc2145"
```


> Getting a dataset by slug:

```shell
curl -X GET "https://api.resourcewatch.org/v1/dataset/Timber-Production-RDC"
```

> Response (equal for both cases):

```shell
{
    "data": {
        "id": "51943691-eebc-4cb4-bdfb-057ad4fc2145",
        "type": "dataset",
        "attributes": {
            "name": "Timber Production RDC",
            "slug": "Timber-Production-RDC",
            "type": null,
            "subtitle": null,
            "application": ["forest-atlas"],
            "dataPath": null,
            "attributesPath": null,
            "connectorType": "document",
            "provider": "csv",
            "userId": "58750a56dfc643722bdd02ab",
            "connectorUrl": "http://wri-forest-atlas.s3.amazonaws.com/COD/temp/annual%20timber%20production%20DRC%20%28test%29%20-%20Sheet1.csv",
            "sources": [],
            "tableName": "index_51943691eebc4cb4bdfb057ad4fc2145",
            "status": "saved",
            "overwrite": false,
            "legend": {
                "date": ["year"],
                "region": [],
                "country": [],
                "long": "",
                "lat": ""
            },
            "clonedHost": {},
            "errorMessage": null,
            "createdAt": "2017-01-25T21:48:27.535Z",
            "updatedAt": "2017-01-25T21:48:28.675Z"
        }
    }
}
```

If you know the id or the `slug` of a dataset, then you can access it directly. Both id and `slug` are case-sensitive.

Using this endpoint, you can also [include entities associated with the dataset](#include-entities-associated-with-the-datasets), in the same way you do when loading multiple datasets. 

> Getting a dataset by its including its relationships:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/06c44f9a-aae7-401e-874c-de13b7764959?includes=metadata,vocabulary,widget,layer
```

## Getting multiple datasets by ids

This endpoint allows you to load multiple datasets by id in a single request.



#### Errors for getting multiple datasets by ids

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | ids: ids can not be empty. | The required `ids` field is missing in the request body.


> Getting multiple datasets by their ids:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/find-by-ids \
-H "Content-Type: application/json"  -d \
'{
    "ids": [
        "0706f039-b929-453e-b154-7392123ae99e",
        "0c630feb-8146-4fcc-a9be-be5adcb731c8",
    ]
}'
```

> Response

```json
    {
        "data": [
          {
            "id": "0706f039-b929-453e-b154-7392123ae99e",
            "type": "dataset",
            "attributes": {
              "name": "Social Vulnerability Index (2006-2010) -- U.S. (New Hampshire)",
              "slug": "Social-Vulnerability-Index-2006-2010-US-New-Hampshire-1490086842541",
              "type": "tabular",
              "subtitle": null,
              ...
            }
          },
          {
            "id": "0c630feb-8146-4fcc-a9be-be5adcb731c8",
            "type": "dataset",
            "attributes": {
              "name": "USGS Land Cover - Impervious Surface (2001) -- U.S. (Alaska)",
              "slug": "USGS-Land-Cover-Impervious-Surface-2001-US-Alaska-1490086842439",
              "type": "raster",
              "subtitle": null,
              ...
            }
          }
        ]
    }
```

## Creating a dataset

So you are ready to create your first dataset on the RW API? Great, welcome aboard! These instruction will help you create your dataset on the RW API, so you can start sharing your data with the world and taking full advantage of all the RW API features on your projects.

Before creating a dataset, there are a few things you must know and do:

- In order to be able to create a dataset, you need to be [authenticated](#authentication).
- Depending on your user account's role, you may have permission to create a dataset but not delete it afterwards.
- All data uploaded to the RW API will be publicly visible and available to other users. 

The first thing to consider when creating a dataset is where your data currently is - this will determine the [Dataset provider](#dataset-providers) you will need to use and, with it, a set of things you need to take into account - we'll cover each provider in detail shortly. When building your request to the RW API to create your dataset, you will need to take into account both the general details that follow, plus the details for the `provider` you are using. Be sure to review both sections when creating your datasets, to avoid any pitfalls.

Creating a dataset is done using a POST request and passing the relevant data as body files. The supported body fields are as defined on the [dataset reference](#dataset-reference) section, but the minimum field list you must specify for all datasets is:


- name
- application
- connectorType
- provider 

Additionally, depending on the data provider you will be using, other fields may be required - we'll cover those in detail in each provider's specific documentation.

A successful dataset creation request will return a 200 HTTP code, and the dataset details as stored on the RW API. PAy special attention to the `id` or the `slug`, as those will allow you to [access your dataset](#getting-a-dataset-by-id-or-slug) later.


**There's one aspect of the dataset creation process that you need to keep in mind: it is an asynchronous process.** This means that a successful call to the create dataset endpoint will *start* the process, but the dataset may not be immediately available to be used. The `status` field will tell you if the dataset creation process is in progress (status set to `pending`), if something went wrong (`failed`, in which case the `errorMessage` field will have a short description of what went wrong) or if the dataset is available to be used (when status is `saved`). The amount of time it takes for a newly created dataset to go from `pending` to `saved` depends on the provider and amount of data. Just keep in mind that you need to wait for the status to be set to `saved` before starting to use your datasets. You should [check your dataset](#getting-a-dataset-by-id-or-slug) manually to see when the `status` is updated.

#### Errors for creating a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | `<field>`: `<field>` can not be empty | Your are missing a required field value.
400            | `<field>`: empty or invalid `<field>` | The provided value for `<field>` is invalid. This is usually happens if an invalid value type is provided, but certain fields use more advanced validation rules, that may produce this error message if validation fails (ie: on a carto dataset, the `connectorUrl` must contain a valid carto URL). 
400            | provider: must be valid <list of valid providers> | Your `provider` value is invalid. The `<list of valid providers>` will contain the list of providers that are supported for the `connectorType` you specified.
401            | Unauthorized  | You are not authenticated. If creating a BigQuery dataset, you may also see this message if you are authenticated. Refer to the [BigQuery documentation](#bigquery49) for more details.
403            | Forbidden - User does not have access to this dataset's application  | You are trying to create a dataset with one or more `application` values that are not associated with your user account. 

### Carto datasets

> Example of creating a dataset based on CartoDB data with the minimum fields required

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
  "dataset": {
    "name":"World Database on Protected Areas -- Global",
    "connectorType":"rest",
    "provider":"cartodb",
    "connectorUrl":"https://wri-01.carto.com/tables/wdpa_protected_areas/table",
    "application":[
      "gfw", 
      "forest-atlas"
    ]
  }
}'
```

To create a dataset connected to a Carto data source, besides the common required fields, you must provide the following required data:

Field           | Description                                                                            | Example value   |
--------------- | :------------------------------------------------------------------------------------: | --------------: |
`connectorType` | The type of connector. Must be set to `rest`.                                          | `rest`          |
`provider`      | The provider should be set to `cartodb`.                                               | `cartodb`       |
`connectorUrl`  | The URL for the CartoDB table that this dataset will be using.                         | `https://wri-01.carto.com/tables/wdpa_protected_areas/table` |

The RW API will use the information above to directly query the Carto account specified on the `connectorUrl` field whenever this dataset is accessed on the RW API. This has a few implications that you should be aware of:

- The Carto URL provided will be publicly visible to all RW API users.
- The Carto account will see increased traffic.
- Any changes made to the data hosted on Carto will be automatically reflected on the data served by the RW API for this dataset.
- If you restructure or delete your Carto table, the corresponding RW API dataset will be in an invalid state, and you should delete it.

The `tableName` value of a carto-based dataset will automatically be filled with the name of the carto table corresponding to the dataset.

When creating a Carto based-dataset, the RW API will try to validate the `connectorUrl` by trying to connect to the corresponding Carto table - the result of this will determine if the dataset's status will be set to `saved` or `error`.

### ArcGIS feature layer

> Example of creating a dataset based on ArcGIS feature layer data with the minimum fields required

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
  "dataset": {
    "connectorType":"rest",
    "provider":"featureservice",
    "connectorUrl":"https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0?f=json",
    "application":[
     "prep"
    ],
    "name":"Uncontrolled Public-Use Airports -- U.S."
  }
}'
```

To create a dataset using ArcGIS feature layer as data source, besides the common required fields, you must provide the following required data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector. Must be set to `rest`.                                          | `rest`         |
`provider`      | The provider should be set to `featureservice`.                                        | `featureservice` |
`connectorUrl`  | The URL for the JSON data in ArcGIS services this dataset will be using.               | https://services.arcgis.com/uuid/arcgis/rest/services/example/FeatureServer/0?f=json |

The RW API will use the information above to directly query the ArcGIS feature layer server specified on the `connectorUrl` field whenever this dataset is accessed on the RW API. This has a few implications that you should be aware of:

- The ArcGIS feature layer URL provided will be publicly visible to all RW API users.
- The ArcGIS feature layer server will see increased traffic.
- Any changes made to the data hosted on ArcGIS feature layer will be automatically reflected on the data served by the RW API for this dataset.
- If you restructure or delete your ArcGIS feature layer dataset, the corresponding RW API dataset will be in an invalid state, and you should delete it.

The `tableName` value of a ArcGIS-based dataset will automatically be filled with the name of the ArcGIS feature layer table corresponding to the dataset.

When creating a ArcGIS-based dataset, the RW API will try to validate the `connectorUrl` by trying to connect to the corresponding ArcGIS Feature Layer - the result of this will determine if the dataset's status will be set to `saved` or `error`.

### Google Earth Engine

> Example of creating a dataset based on Google Earth Engine data with the minimum fields required

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
  "dataset": {
    "connectorType":"rest",
    "provider":"gee",
    "tableName": "JRC/GSW1_0/GlobalSurfaceWater"
    "application":[
     "rw"
    ],
    "name":"Water occurrence"
  }
}'
```

To create a dataset using Google Earth Engine (GEE) as data source, besides the common required fields, you must provide the following required data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector. Must be set to `rest`.                                          | `rest`         |
`provider`      | The provider should be set to `gee`.                                                   | `gee`          |
`tableName`     | Relative path of the dataset within GEE.                                               | users/resourcewatch_wri/dataset_name |

The RW API will use the information above to directly query the GEE dataset specified on the `tableName` field whenever this dataset is accessed on the RW API. This has a few implications that you should be aware of:

- The GEE resource name provided will be publicly visible to all RW API users.
- Any changes made to the data hosted on GEE will be automatically reflected on the data served by the RW API for this dataset.
- If you restructure or delete your GEE dataset, the corresponding RW API dataset will be in an invalid state, and you should delete it.

When creating a GEE-based dataset, the RW API will try to validate it by connecting to the corresponding dataset GEE - the result of this will determine if the dataset's status will be set to `saved` or `error`.



### WMS

> Example of creating a dataset based on WMS data with the minimum fields required

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset' -d \
-H 'Authorization: Bearer <your-token>'  \
-H 'Content-Type: application/json' -d \
'{
   "dataset": {
     "application": [
       "rw"
     ],
     "name": "Seasonal variability",
     "connectorType": "wms",
     "provider":"wms",
     "connectorUrl":"http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson"
   }
 }
'
```

To create a dataset using WMS as data source, you should provide the following data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector. Must be set to `wms`.                                           | `wms`          |
`provider`      | The provider should be set to `wms`.                                                   | `wms`          |
`connectorUrl`  | URL of the server hosting the data in WMS format.                                      | `https://maps.heigit.org/osm-wms/service?request=GetCapabilities&service=WMS` |


The RW API will use the information above to directly query the WMS dataset specified on the `connectorUrl` field whenever this dataset is accessed on the RW API. This has a few implications that you should be aware of:

- The WMS server URL provided will be publicly visible to all RW API users.
- Any changes made to the data hosted on the WMS server data will be automatically reflected on the data served by the RW API for this dataset.
- If you restructure or delete your WMS server data, the corresponding RW API dataset will be in an invalid state, and you should delete it.

When creating a WMS-based dataset, no validation is done - the dataset is automatically created in a `saved` state.


### Document based datasets: JSON, CSV, TSV or XML

> Creating a CSV dataset with data provided by externally hosted files:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
  "dataset": {
    "connectorType":"document",
    "provider":"csv",
    "sources": [
      "https://gfw2-data.s3.amazonaws.com/alerts-tsv/glad_headers_1.csv",
      "https://gfw2-data.s3.amazonaws.com/alerts-tsv/glad_headers_2.csv",
      "https://gfw2-data.s3.amazonaws.com/alerts-tsv/glad_headers_3.csv"
    ],
    "application":[
     "gfw"
    ],
    "name":"Glad points"
  }
}'
```

> Creating a JSON dataset with data provided on the request body:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
  "dataset": {
    "connectorType":"document",
    "provider":"json",
    "application":[
     "your", "apps"
    ],
    "data": {"myData":[
            {"name":"nameOne", "id":"random1"},
            {"name":"nameTow", "id":"random2"}
          ]},
    "name":"Example JSON Dataset"
  }
}'
```

This dataset hosts data from files in JSON, CSV, TSV or XML format.

Here's a breakdown of the fields you need to specify when creating a document type dataset, besides the common required fields:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector. Must be set to `document`.                                      | `document`     |
`provider`      | The type of data you are uploading. Must be one of the following: `csv`, `tsv`, `json` or `xml`. | `csv`, `tsv`, `json` or `xml` |
`connectorUrl`  | URL from which to source data.                                                         | http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson |
`sources`       | List of URLs from which to source data.                                                | ['http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson','http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/7?f=pjson'] |
`data`          | JSON DATA only for json connector if connectorUrl not present.                         | [{"key":"value1"},{"key":"value2"}]] |


When creating a document based dataset, you have multiple ways of providing your data to the API, of which you should use only one:

- The `sources` field expects a list of URL containing files in the format matching your `provider` value. This is the recommended way of uploading data.
- The `connectorUrl` field is similar to `sources`, but it only accepts a single value. **Deprecation notice**: The previously used `connectorUrl` field should be considered deprecated when creating document-based datasets.
- If creating a dataset based on JSON data, you can upload the data on the actual request you issue to the API, inside the `data` field.


The data passed in `sources` or `connectorUrl` must be available on a publicly accessible URLs, specified in the `sources` array field or the `connectorUrl` single value field. The URLs must be an accessible CSV, TSV or XML file, non-compressed - zip, tar, tar.gz, etc are not supported. `sources` allows you to specify multiple URLs for a single dataset, provided all files have the same format and data structure. This is particularly useful when creating very large datasets, as it will allow the creation process to be parallelized. No warranties are provided about the order in which the files or their parts are imported.

*Notice: If you want to create a dataset from a file you have, but that it's not available on a public URL, check out our docs for [uploading a dataset](#uploading-a-dataset).*

  
Unlike with other dataset types, when the dataset is created, the data is copied from the provided source into the API's internal Elasticsearch instance, which is the source used for subsequent queries or other operations. This has a few implications that you should be aware of:

- The URLs provided in `sources` or `connectorUrl` will be publicly visible to all RW API users.
- On dataset creation, those URLs will be visited as the API loads and copies your data.
- Queries to the dataset will use the API's internal copy of your data. If you wish to update that data, see the documentation below on how to update your data.
- If the URLs provided become unavailable after the creation process is over, the dataset will continue to work normally - your data will still be available online.

*Notice: When creating a document-based dataset, if any of the fields has a numerical name (for example, column: `3`), a string named `col_` will be appended to the beginning of the name of the column. This way, an uploaded column named `3` will become `col_3`.*

*Tip: If you want to periodically and automatically update your document based dataset with new data, check out the [dataset automatic synchronization](#dataset-automatic-synchronization) functionality.*

When creating a document-based dataset, the RW API will start a complex process that copies your data into the API's internal database, and perform certain indexing actions. This process is called a **Task**, and is given a `taskId` that is stored on the dataset's field with the same name. Depending on the size of your dataset, this may take from a few seconds to a few hours to complete. The result of this import process will determine if the dataset's status will be set to `saved` or `error`. You can follow this process by using the `taskId` value with the [Tasks API](#get-a-single-task).

#### Using the legend fields to define field types

By default, when creating a document based dataset, the data is ingested by the API and the field types are automatically determined by the underlying Elasticsearch [dynamic mapping API](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/mapping.html#_dynamic_mapping).
However, in some scenarios, it may be desirable to specify some or all of these mappings manually, to match each field type to its Elasticsearch equivalent.

When defining manual mappings, you don't need to map every single field. When processing the data, if a field is found for which there isn't a manual mapping, Elasticsearch will fallback to its dynamic mapping algorithm to try and guess that field's type. This API only supports a single explicit mapping per field, meaning you cannot declare a given field as both `text` and `keyword` for example.

Field mapping can only be defined on dataset creation. Should you want to change these mappings, you can only do so by creating a new dataset with the new mapping structure.

The `legend` field allows explicitly identifying the following mappings:

Mapping  |                  Notes                   |
---------| :--------------------------------------------: |
lat      | If `lat` and `long` are both provided, a `the_geom` mapping is added |
long     | If `lat` and `long` are both provided, a `the_geom` mapping is added |
date     |  Name of columns with date values (ISO Format)  |
country   | Name of columns with country values (ISO3 code)  |
region   | Name of columns with region values (ISO3 code)  |
 | |
nested   | [Nested objects](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/nested.html) need to be explicitly identified in order to be indexed.  |
 | |
integer  | In beta, not fully supported |
short    | In beta, not fully supported |
byte     | In beta, not fully supported |
double   | In beta, not fully supported |
float    | In beta, not fully supported |
half_float    | In beta, not fully supported |
scaled_float  | In beta, not fully supported |
boolean  | In beta, not fully supported |
binary   | In beta, not fully supported |
text     | In beta, not fully supported |
keyword  | In beta, not fully supported |

For more details on the characteristics of each of the basic data types, refer to the [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/mapping.html#_field_datatypes).

#### Uploading a dataset file

> Upload raw data for using in a dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/upload \
-H "Authorization: Bearer <your-token>" \
-F provider=csv,
-F dataset=@<your-file>
```

> Example response

```json
{
  "connectorUrl": "rw.dataset.raw/some-file.csv",
  "fields": [
    "Country (region)",
    "Positive affect",
    "Negative affect",
    "Social support",
    "Freedom",
    "Corruption",
    "Generosity"
  ]
}
```

> Using the returned connectorUrl to create a new dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
'{
  "dataset": {
    "connectorType":"document",
    "provider":"csv",
    "connectorUrl":"rw.dataset.raw/some-file.csv",
    "application":[
     "your", "apps"
    ],
    "name":"Example RAW Data Dataset"
  }
}'
```

The `upload` endpoint allows you to create datasets on the API from local files that aren't available online. 
If your file is up to 4MB in size, you can upload it to the API by using the `upload` endpoint. 
This endpoint accepts a file in the "dataset" field of your POST request, and a `provider` that matches your file type and extension. 
The supported formats/extensions are: csv, json, tsv, xml, tif, tiff and geo.tiff.
The request uploads the file to the API, and returns a specially crafted `connectorUrl` value, and a list of fields found in your file.
With this data, you can create a document type dataset by passing it to the `connectorUrl` value of a [new document type dataset](#document-based-datasets-json-csv-tsv-or-xml).

#### Errors for upload a dataset file

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | - no file to check - | A file was not provided, or was provided in the wrong request field.
400            | - dataset: file dataset can not be a empty file - | A file was not provided, or was provided in the wrong request field.
400            | provider: provider must be in [csv,json,tsv,xml,tif,tiff,geo.tiff]. | A file was not provided, or was provided in the wrong request field.
400            | - dataset: file too large -  | Your file is larger than 4MB.
400            | - dataset: file <your file name> is bad file type. -  | The `provider` value must match the extension of the uploaded file.
401            | Unauthorized   | You need to be logged in to be able to upload a file.


## Updating a dataset

There are multiple options to update a dataset, depending on what modification you are trying to achieve, and the underlying data provider of the dataset itself. This section covers the different endpoints that allow you to modify a dataset, their details, and helps you pick the option that best fits your scenario. We recommend reviewing all of them before proceeding, so you can find the endpoint that best matches your needs.

### Updating the fields of a dataset

> Example request for updating the name of a dataset

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id-or-slug> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
'{
    "name": "Another name for the dataset"
}'
```

In order to modify the fields of a dataset, you can use the patch dataset endpoint. 
This endpoint allows you to modify most of your dataset's details, like the name or publishing status, but can also be used to modify internal fields of a dataset, like `connectorType`. 
When making these changes, be mindful that some of these fields are critical to the correct behavior of the dataset, and providing incorrect values may break your dataset. 
There are other endpoints documented in this page that allow you to perform certain update-like operations (ie. update data on a document-type dataset), so refer to those first before using this endpoint. 
Also important to keep in mind is the fact that this endpoint does not perform validation on things like `connectorUrl`/`sources` URLs.

All the fields in the [dataset reference](#dataset-reference) can be modified, except the following:

- `slug`
- `userId`
- `createdAt`
- `updatedAt`

Additionally, certain fields have special behavior associated with them:

- `status` can only be modified by users with `ADMIN` role or by other microservices.
- `taskId` and `errorMessage` can only be modified by other microservices.
- `published` can only be modified by users with `ADMIN` role.
- `env` changes will not only affect the dataset, but also related widgets and layers. Refer to the PATCH `/widget/change-environment/<dataset id>/<env>` and the the PATCH `/layer/change-environment/<dataset id>/<env>` endpoints respectively for more details.

When passing new values for Object type fields, the new value will fully overwrite the previous one. It's up to you, as an API user, to build any merging logic into your application.

To perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the dataset
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)

Use this endpoint when:

- Modifying the fields of a dataset, like name, and not the data itself.
- Modifying the source of data for any dataset that's not document based (`connectorType` values other than `document`).
- Making advanced changes to a dataset.


#### Errors for updating the fields of a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You need to be logged in to be able to update a dataset.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset).
403            | Forbidden      | You are trying to update a dataset with one or more `application` values that are not associated with your user account. 
404            | Dataset with id <id> doesn't exist   | A dataset with the provided id does not exist.


### Concatenate and append data to a document based dataset

> Concatenate data using external data source:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/concat \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "provider": "json",
    "sources": ["<csv1Url>", "<csv2Url>", "<csv3Url>"],
    "dataPath": "data... etc"
}'
```

> Append data using external data source:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/append \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "provider": "json",
    "sources": ["<csvUrl>"],
    "dataPath": "data... etc"
}'
```

> Concatenate data using JSON array in post body:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/concat \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "provider": "json",
    "data": [{},{}]
}'
```

Using these endpoints, you can add more data to an already existing dataset. They are exclusively available for document based datasets - you'll get a `404` error if you use them on a dataset of a different type. You can either provide the URL for the file containing the data you wish to add, or simply provide that data in the body of your request, as a JSON object.

These process are asynchronous and not instantaneous. Immediately when triggered, these requests will cause the dataset's `status` to be set to `pending`, meaning you will not be able to issue new overwrite, concatenate or append requests. Once the request has been fully processed, the status will be automatically set to `saved`. Depending on factors like API load or the size of the data being uploaded, this may take from a few minutes to a few hours to occur. The API does not issue any notification when the asynchronous operation is finished.

In order to perform these operation, the following conditions must be met:

- the dataset's `overwrite` property must be set to `true`.
- the dataset's `status` property must be set to `saved`.
- the user must be logged in and match one of the following:
  - have role `ADMIN` and belong to the same application as the dataset
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)

While they ultimately achieve a very similar end result, concatenate and append rely on different internal processes, each with its own characteristics.

- The concatenate process relies on a slower approach to ensure the operation is atomic. Until the operation is completed, you will see the dataset data as it was before the concatenate operation was triggered. If the operation fails, the old version of the data is kept accessible as it was before the concatenation process was started. There's a known issue where concatenating new data to already existing large datasets may result in failure.
- The append operation relies on a faster process that does not offer atomicity. The new data is simply added to the current dataset, and any queries done while this process is taking place may produce results based on the preexisting data mixed with parts of the newly added values. Should the operation fail halfway, your dataset may contain all the preexisting records as well as part (but not all) of the newly added ones.

<aside class="notice">
    Using the previous <code class="prettyprint">url</code> field to pass the url of a single file is still permitted but is now deprecated in favor of <code class="prettyprint">sources</code>.
</aside>

Here's a more detailed description of the request's body fields:

Field        |                        Description                                |   Type |        Values | Required
------------ | :-----------------------------------------------------------:     | -----: | ------------: | -------:
provider     | Dataset provider this include inner connectors and 3rd party ones | String | A valid dataset provider | Yes
sources      | List of URLs from which to source data                            |  Array |     URL array | Yes, unless JSON data is provided using the `data` field
data         | JSON DATA only for json connector if connectorUrl not present     |  Array |    [{},{},{}] | Yes for JSON if `sources` is not present
dataPath     | Path to the data in a JSON file-based datasets                    | String |            '' | No

*Tip: If you want to periodically and automatically concatenate data to your document based dataset, check out the [dataset automatic synchronization](#dataset-automatic-synchronization) functionality.*
        
Use this endpoint when:

- Adding new data to an existing document based dataset, without modifying/removing the existing one.

#### Errors for concatenating and appending data to a document based dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Dataset is not in saved status   | The dataset's `status` value is not set to `saved`. Refer to [dataset reference](#dataset-reference) for more details on this field and its values.
401            | Unauthorized   | You need to be logged in to be able to update a dataset.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset).
403            | Forbidden      | You are trying to update a dataset with one or more `application` values that are not associated with your user account. 
404            | Endpoint not found  | A dataset with the provided id does not exist, or does not have `connectorType` with value `document`.
409            | Dataset locked. Overwrite false. | The dataset you're trying to modify has `overwrite` value set to `false`, to explicitly prevent data modifications.


### Overwrite data for a document based dataset

> Overwrite data using external data source:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/data-overwrite \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
   "sources": ["<url of the data source>"],
   "provider": "csv"
}'
```

> Overwrite data using JSON array in post body:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/data-overwrite \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
   "data": [{},{}],
   "provider": "csv"
}'
```

Using this endpoint, you can add or completely replace the data of an already existing dataset. 
It's exclusively available for document based datasets - you'll get a `404` error if you use it on a dataset of a different type. 
All previously existing data will be permanently deleted. 
You can either provide the URL(s) for the file(s) containing the data you wish to add, or simply provide that data in the body of your request, as a JSON object. 
There are no requirements regarding similarity of the data structure between existing and new data - your overwrite data can have a completely different data schema.

This process is asynchronous and not instantaneous. Immediately when triggered, this request will cause the dataset's `status` to be set to `pending`, meaning you will not be able to issue new overwrite or concat requests, and will not yet be able to access the new data yet. Once the request has been fully processed, the status will be automatically set to `saved` and the new data will be accessible. Depending on factors like API load or the size of the data being uploaded, this may take from a few minutes to a few hours to occur. The API does not issue any notification when the asynchronous operation is finished.

In order to perform this operation, the following conditions must be met:

- the dataset's `overwrite` property must be set to `true`.
- the dataset's `status` property must be set to `saved`.
- the user must be logged in and match one of the following:
  - have role `ADMIN` and belong to the same application as the dataset
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)

Here's a more detailed description of the request's body fields:

Field        |                        Description                                |   Type |        Values | Required
------------ | :-----------------------------------------------------------:     | -----: | ------------: | -------:
provider     | Dataset provider this include inner connectors and 3rd party ones | String | A valid dataset provider | Yes
sources      | List of URLs from which to source data                            |  Array |     URL array | Yes, unless JSON data is provided using the `data` field
data         | JSON DATA only for json connector if connectorUrl not present     |  Array |    [{},{},{}] | Yes for JSON if `sources` is not present
legend       | The schema of the new data. If none is provided, a guessing mechanism will be used. The existing `legend` value of the dataset will be ignored and overwritten in all `overwrite` operations. See [the legend section](#legend) above for more details.                                                | Object |               |       No

*Tip: If you want to periodically and automatically overwrite the data on your document based dataset, check out the [dataset automatic synchronization](#dataset-automatic-synchronization) functionality.*

#### Errors for overwriting data for a document based dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Dataset is not in saved status   | The dataset's `status` value is not set to `saved`. Refer to [dataset reference](#dataset-reference) for more details on this field and its values.
401            | Unauthorized   | You need to be logged in to be able to update a dataset.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset).
403            | Forbidden      | You are trying to update a dataset with one or more `application` values that are not associated with your user account. 
404            | Endpoint not found  | A dataset with the provided id does not exist, or does not have `connectorType` with value `document`.
409            | Dataset locked. Overwrite false. | The dataset you're trying to modify has `overwrite` value set to `false`, to explicitly prevent data modifications.

Use this endpoint when:

- Fully replacing the data of an existing document based dataset, while keeping other values like id or name.
- Modifying the structure of the data for a document based dataset.


## Cloning a dataset

> Example request for cloning a dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/5306fd54-df71-4e20-8b34-2ff464ab28be/clone \
-H "Authorization: Bearer <your-token>"
-H "Content-Type: application/json" -d \
'{
  "dataset": {
    "datasetUrl": "/query/5306fd54-df71-4e20-8b34-2ff464ab28be?sql=select%20%2A%20from%20data%20limit%2010",
    "application": [
      "your",
      "apps"
    ],
    "legend": {...},
    "applicationConfig" : {...}
  }
}'
```

This endpoint allows you to create a new, json based dataset, from the result of a RW API endpoint call. The basic usage example would be to create a new dataset based on a custom query to an existing dataset - this is illustrated in the example `curl` call in this section. Other use cases could be converting the result of an analysis endpoint into a dataset, or capturing the result of a query to a REST based dataset (cartodb, arcgis, etc) to an internal json representation of the same data, that is kept in the API database.   

In order to perform this operation, the following conditions must be met:

- the user must belong to the applications specified in the request body.
- the user must be logged in and match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)


The request requires two fields to be present:

- `datasetUrl`: the URL from where to load the data to populate the new dataset. Must be RW API, relative path, like `/query/5306fd54-df71-4e20-8b34-2ff464ab28be?sql=select%20%2A%20from%20data%20limit%2010`.
- `application`: the array of applications to which the new dataset will belong.

Additionally, you can optionally specify these fields:

- `legend`: field structure and type of the new dataset. Refer to [dataset reference](#dataset-reference) for more details.
- `applicationConfig`: application-specific configuration. Refer to [dataset reference](#dataset-reference) for more details. If not provided, it will be copied from the original dataset.
- `published`: if the user has `ADMIN` role, they can set this value to `true`. 


For the fields in the following list, values will be copied from the original dataset to the new one, unless specified:

- `name`: copied from the original dataset, with a timestamp appended, to ensure uniqueness.
- `subtitle`
- `dataPath`: will always be set to `data`, matching the expected response structure of RW API responses like `/query` that encapsulate the "real" data in a `data` json object.
- `connectorType`: will be set to `document`
- `provider`: will be set to `json`
- `attributesPath`
- `tableName`
- `dataLastUpdated`
- `overwrite`
- `published`: if the user has role `ADMIN` and does not explicitly set `published` to `true` on the request body, this value is inherited. Otherwise, it's set to `false`.

Datasets created through a cloning operation will have a specific `clonedHost` object, with additional data. Refer to [dataset reference](#dataset-reference) for more details on the content of this field. 

The dataset cloning requests accepts an optional `full` boolean query parameter that, when set to `true`, will clone of vocabulary-related data and metadata from the original dataset to the new one.

#### Errors for cloning a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | <field>: <field> can not be empty. | The required field identified in the error message is missing in the request body.
400            | - application: must be a non-empty array -  | `application` must be specified as an array.
401            | Unauthorized   | You need to be logged in to be able to clone a dataset.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset).
403            | Forbidden - User does not have access to this dataset's application | You specified an `application` in your request body that is not associated with your user account. 
404            | Dataset with id <id> doesn't exist   | A dataset with the provided id does not exist.

## Deleting a dataset

Use this endpoint if you wish to delete a dataset. Deleting a dataset of type document (`connectorType` with value `document`) will cause the API's internal copy of said data to be deleted. Dataset types that proxy data from an external source (ie. carto, gee, etc) will be deleted without modifying said external source.

When deleting a dataset that is associated with multiple `application` values, the user issuing the request must be associated with all of them in order for the dataset to be deleted. If that's not the case, the `application` values associated with the user will be removed from the dataset's `application` list, and no further action will be taken - the dataset itself and its associated resources will continue to exist. The dataset is only actually deleted if the user has access to all of the `application` to which the dataset belongs. 

Besides deleting the dataset itself, this endpoint also deletes graph vocabularies, layers, widgets and metadata related to the dataset itself. These delete operations are issued in this order, and prior to deleting the dataset itself, but are not atomic - if one of them fails (for example, if attempting to delete a protected resource), the following ones are canceled, but the already deleted elements are not restored. 

In order to delete a dataset, the following conditions must be met:

- the dataset's `protected` property must be set to `false`.
- the user must be logged in and belong to the same application as the dataset
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)


> Example request for deleting a dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id> \
-H "Authorization: Bearer <your-token>"
-H "Content-Type: application/json"
```

#### Errors for deleting a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | Dataset is protected | You are attempting to delete a dataset that has `protected` set to prevent deletion.
401            | Unauthorized   | You need to be logged in to be able to delete a dataset.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)
403            | Forbidden      | You are trying to delete a dataset with one or more `application` values that are not associated with your user account. 
404            | Dataset with id <id> doesn't exist   | A dataset with the provided id does not exist.

## Dataset automatic synchronization

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
'{
    "connectorType":"document",
    "provider":"csv",
    "connectorUrl":"<csvUrl>",
    "application":[
     "your", "apps"
    ],
    "name":"Example SYNC Dataset",
    "overwrite": true,
    "sync": {
        "action":"concat",
        "cronPattern":"0 * * * * *",
        "url":"<updateCsvUrl>"
    }
}'
```

Certain datasets contain data that evolves frequently over time, and you, as the creator of this dataset, what to ensure that it's up-to-date. As we've seen before, if your data is hosted on one of the supported 3rd party data providers, like Carto or Arcgis, your data will be proxied, so users of the RW API will always see the latest version of your data. However, if you uploaded your data from a file, your data is copied to the RW API database at the time of the dataset's creation, so keeping it up-to-date requires a different approach. It's with scenario in mind that the RW API offers the automatic synchronization mechanism.

The automatic synchronization mechanism is available for document based datasets only, and you can configure it when [creating](#creating-a-dataset) or [updating](#updating-the-fields-of-a-dataset) a dataset. When enabled, it will schedule an automatic, periodic task, that will update your document based dataset's data, based on data from an URL you provide. This means that, once configured, you just have to make sure the automatic synchronization mechanism can find the newest version of the data at the specified URL, and the RW API will take care of the actual data update process for you.

To configure automatic synchronization on dataset creation or update, you need to pass a `sync` object on your calls to the respective endpoints, next to the other fields. See the included example for a clearer idea of how creating a dataset with automatic synchronization looks like.

There are 3 fields, all required, that you need to specify inside the `sync` object:

- `action`: choose either `concat` or `overwrite`. See more details above about [concatenating](#concatenate-and-append-data-to-a-document-based-dataset) and [overwriting](#overwrite-data-for-a-document-based-dataset) dataset data. Append operations, as documented in the section above, is not supported.
- `cronPattern`: [cron](https://en.wikipedia.org/wiki/Cron) expression representing when and how frequently the synchronization process should take place. The host executing these tasks use UTC timezone.
- `url`: publicly available URL from where the automatic synchronization mechanism will load the data to replace/concatenate to your dataset. 

Internally, the automatic synchronization mechanism will call either the [dataset concatenation](#concatenate-and-append-data-to-a-document-based-dataset) or [dataset overwrite](#overwrite-data-for-a-document-based-dataset) endpoint. 
If that internal request fails - for example, if `overwrite` is set to `false` - the sync process will fail silently. 
If you have the `ADMIN` role, you can use the `/v1/task` endpoint to see scheduled tasks and their error output, but otherwise this failure will be invisible to end users.

On the other hand, if the request goes through, but the concatenation/overwrite process fails - for example, if the URL provided is not available - then your dataset `status` will be set to `error` and the `errorMessage` field will give you a simple description of what happened.

To see the details (including the date) of the last operation performed on the dataset, use the link in the `taskId` field.

## Flush dataset cache

> Flush dataset's cache

```shell
curl -X POST https://api.resourcewatch.org/v1/0c630feb-8146-4fcc-a9be-be5adcb731c8/flush \
-H "Authorization: Bearer <your-token>"
```

> Response:

```shell
OK
```

Flushes the cache for the specified dataset. Take into account that only the dataset itself, query results and fields will be flushed. Any other relation, like metadata, layers or widgets linked to the specified dataset will not be affected by this action.

In order to flush a dataset's cache, the following conditions must be met:

- the user must be logged in.
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)
  
  
#### Errors for flushing a dataset's cache

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You need to be logged in to be able to delete a dataset.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)
403            | Forbidden      | You are trying to delete a dataset with one or more `application` values that are not associated with your user account. 
404            | Dataset with id <id> doesn't exist   | A dataset with the provided id does not exist.


## Recover

> Recover dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/0c630feb-8146-4fcc-a9be-be5adcb731c8/recover \
-H "Authorization: Bearer <your-token>"
```

> Response:

```shell
OK
```

Resets a dataset's `status` to `saved` and clears its errors. Keep in mind that this does NOT modify the dataset in any other way - if the underling dataset's data was inconsistent for any reason, this endpoint will not change it, and it's up to you to fix it using a `data-overwrite` or other endpoints.

In order to recover a dataset, the user must be logged in and have the `ADMIN` role.

#### Errors for recovering a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You need to be logged with to be able to delete a dataset.
403            | Forbidden      | You need to have the `ADMIN` role.
404            | Dataset with id <id> doesn't exist   | A dataset with the provided id does not exist.


  
## Dataset reference

This section gives you a complete view at the properties that are maintained as part of dataset. When interacting with a dataset (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/resource-watch/dataset/blob/master/app/src/models/dataset.model.js).

Field name              | Type           | Required             | Default value              | Description                                                                  
----------------------- | -------------- | -------------------- |----------------------------| ---------------------------------------------------------------------------- 
id                      | String         | Yes (autogenerated)  |                            | Unique Id of the dataset. Auto generated on creation. Cannot be modified by users.    
name                    | String         | Yes                  |                            | Name of the dataset.                                                         
slug                    | String         | Yes (autogenerated)  |                            | Slug of the dataset. Auto generated on creation. Cannot be modified by users.        
type                    | String         | No                   | null                       | Type of the dataset.                                                         
subtitle                | String         | No                   | null                       | Subtitle of the dataset.                                                     
application             | Array          | Yes                  |                            | Applications associated with this dataset. Read more about this field [here](/index-rw.html#applications).
applicationConfig       | Object         | No                   |                            | Key-value storage of application-specific data. Use the `application` value as key and a JSON Object as the value to store complex, extensible data. | Object      
dataPath                | String         | No                   | null                       | Path to the data in a JSON file-based datasets.                              
attributesPath          | String         | No                   | null                       |                                                                              
connectorType           | String         | Yes                  |                            | Type of connector. `wms` for WMS-based datasets, `rest` for datasets that rely on external data sources (carto, arcgis, etc) or `document` for file-based datasets (JSON, CSV, etc).                      
provider                | String         | Yes                  |                            | Dataset provider.                                                                 
userId                  | String         | Yes (autopopulated)  |                            | Id of the user who created the dataset. Set automatically on creation. Cannot be modified by users.                                           
connectorUrl            | String         | No                   | null                       | Path to the source of the data. On datasets with `document` connectorType, `sources` should be used instead.      
sources                 | Array          | No                   | null                       | Path to the source files of the data. Only used on datasets with `document` connectorType.      
tableName               | String         | No                   | null                       | Additional value used to locate the dataset within a given underlying provider. Refer to the documentation of the different connector for more details. 
status                  | String         | No                   | pending                    | Status of the dataset. `saved` means the dataset is available to use, `pending` means an operation is ongoing and the dataset is temporarily unavailable, `error` means the dataset is in an invalid state and requires further action before becoming available. 
overwrite               | Boolean        | No                   | false                      | If the data can be overwritten (only for being able to update dataset)            
errorMessage            | String         | No                   | null                       | If this dataset is in `error` state, this field may contain additional details about the error. 
mainDateField           | String         | No                   | null                       |                                                                                
published               | Boolean        | Yes                  | true                       | If the dataset is published or not.                                               
env                     | String         | Yes                  | production                 | Environment to which the dataset belongs.                                    
geoInfo                 | Boolean        | Yes                  | false                      | If it contains interceptable geographical info                                    
protected               | Boolean        | Yes                  | false                      | If the dataset is protected. A protected dataset cannot be deleted.               
taskId                  | String         | No                   | null                       | Id of the latest task associated with this dataset. Typically only present in `document` connectorType datasets      
subscribable            | Object         | No                   |                            | Information about the dataset being subscribable for alerts. More info about this can be found on the [Subscriptions](#subscriptions) section of the docs. 
legend.lat              | String         | No                   |                            | Dataset field representing a latitude value.                                      
legend.long             | String         | No                   |                            | Dataset field representing a longitude value.                                
legend.*                | Array          | No                   |                            | Different keys corresponding to data types. Each key may have an array of strings, referencing dataset fields that match that data type. Used functionally for document-based datasets, but may also be set by the user as reference for other types. See [this section](#using-the-legend-fields-to-define-field-types) for more details.
clonedHost.hostProvider | String         | No                   |                            | When cloning a dataset, this will retain the `provider` value of the original dataset.       
clonedHost.hostUrl      | String         | No                   |                            | When cloning a dataset, this will retain the `connectorUrl` value of the original dataset.      
clonedHost.hostId       | String         | No                   |                            | When cloning a dataset, this will retain the `Id` value of the original dataset.        
clonedHost.hostType     | String         | No                   |                            | When cloning a dataset, this will retain the `connectorType` value of the original dataset.        
clonedHost.hostPath     | String         | No                   |                            | When cloning a dataset, this will retain the `tableName` value of the original dataset.       
widgetRelevantProps     | Array          | No                   |                            | Group of relevant props of a widget.                                              
layerRelevantProps      | Array          | No                   |                            | Group of relevant props of a layer.                                               
dataLastUpdated         | Date           | No                   |                            | User defined date of when a dataset was last updated.                         
userName                | String         | No (autogenerated)   | null                       | Name of the user who created the dataset. This value is used only internally, and is never directly exposed through the API. Cannot be modified by users.        
userRole                | String         | No (autogenerated)   | null                       | Role of the user who created the dataset. This value is used only internally, and is never directly exposed through the API. Cannot be modified by users. 
createdAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the dataset was created. Cannot be modified by users.                     
updatedAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the dataset was last updated. Cannot be modified by users.                
