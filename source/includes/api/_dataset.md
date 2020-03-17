# Dataset

## What is a dataset?

If you are new to the RW API, or want to learn more about the concept of a dataset, we strongly encourage you to read the [dataset concept](#dataset) documentation first. It gives you a brief and clear description of what a dataset is, and what it can do for you.

Once you've read that section, you can come back here to learn more details about using the RW API's datasets feature. The RW API is home to many datasets uploaded by [WRI](https://www.wri.org/), its partner organizations, or by API users like you. These datasets contain a lot of information about a wide range of topics that you may want to learn about or build on top of. To find out more about finding and accessing the datasets already available on the RW API, check out the documentation on [getting datasets](#getting-all-datasets). A nice, visual way to explore existing datasets is by using the [Resource Watch](https://resourcewatch.org/) website. 

You can also [create you own datasets](#creating-a-dataset) on the RW API, if you'd like to share your data with the world, or 
 if you are looking to use the RW API and its features to gain insights into your data.

## Getting all datasets

This endpoint will allow you to get the list of the datasets available in the API, and it's a great place for new users to start exploring the RW API. By default, this endpoint will give you a paginated list of 10 datasets. In the sections below, we'll explore how you can customize this endpoint call to match your needs. 

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
            "verified": false,
            "blockchain": {},
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

The dataset list provides a wide range of parameters that you can use to tailor your dataset listing. Most of these parameters reflect fields you'll find in a dataset itself, while others are convenience filters for things like user role or favourites. These parameters can be combined into a complex `and` logic query.

Here's the comprehensive list of filters supported by datasets:
 

Filter         | Description                                                                  | Type        | Expected values
-------------- | ---------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------
name           | Filter returned datasets by the name of the dataset.                         | String      | any valid text
slug           | Filter returned datasets by the slug of the dataset.                         | String      | any valid text
type           | Filter returned datasets by dataset type.                                    | String      | any valid text
subtitle       | Filter returned datasets by dataset subtitle.                                | String      | any valid text
application    | Applications associated to this dataset.                                     | Array       | any valid text
applicationConfig |                                                                           | Object      | `true` or `false`
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
verified       | If this dataset contains data that is verified using blockchain              | Boolean     | `true`or `false`
errorMessage   | If this dataset contains data that is verified using blockchain              | String      | any valid text
mainDateField  | If this dataset contains data that is verified using blockchain              | String      | any valid text
published      | If the dataset is published or not.                                          | Boolean     | `true`or `false`
env            | Environment to which the dataset belongs. Multiple values can be combined using `,` as a separator. Does not support regexes. | String      | any valid text. Defaults to `production`. 
geoInfo        | If it contains interceptable geographical info                               | Boolean     | `true`or `false`
protected      | If the dataset is protected.                                                 | Boolean     | `true`or `false`
taskId         | Id of the latest task associated with this dataset. Typically only present in `document` connectorType datasets | String      | any valid text
blockchain.id  |                                                                              | String      | any valid text
blockchain.hash |                                                                             | String      | any valid text
blockchain.time |                                                                             | String      | any valid text
blockchain.backupUrl |                                                                        | String      | any valid text
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
subscribable   | If the dataset is subscribable (i.e. contains a non-empty object in the subscribable field) | Boolean     | `true` or `false`
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

> Explicit order of sorting

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-name,+description
```

> Sorting datasets by the role of the user who owns the dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=user.role
```

The API currently supports sorting by means of the `sort` query parameter. Sorting can be done using any field from the dataset data model, as well as `user.name` and `user.role` (sorting by user data is restricted to ADMIN users). Sorting by nested fields is not supported at the moment.

Multiple sorting criteria can be used, separating them by commas.

You can also specify the sorting order by prepending the criteria with either `-` or `+`. By default, `asc` order is assumed.

#### Special sorting criteria

> Sorting datasets with special criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-most-favorited
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=relevance&status=saved&search=agriculture
```

Special search criteria must be used as sole sorting criteria, as it's not possible to combine any of them with any other search criteria. The following criteria can be used for special sorting in datasets:

* `metadata`: delegates sorting to the metadata component, sorting by the name field of the metadata.
* `most-viewed` delegates sorting to the graph component, sorting by the datasets that have been queried more frequently. Supports ascending/descending order.
* `most-favorited`: delegates sorting to the graph component, sorting by the datasets that have been more favorited. Supports ascending/descending order.
* `relevance`: delegates sorting to the metadata component, sorting by the datasets which metadata better match the search criteria. Can only be used in conjunction with a `search` parameter. Does not support ascending order.

### Include related entities

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
                "type": "tabular",
                "subtitle": null,
                "application": [
                    "prep"
                ],
                "dataPath": null,
                "attributesPath": null,
                "connectorType": "document",
                "provider": "csv",
                "userId": "586bc76036aacd381cb92b3a",
                "connectorUrl": "https://raw.githubusercontent.com/fgassert/PREP-washington-observed-data/master/observed_precip.csv",
                "sources": [],
                "tableName": "index_06c44f9aaae7401e874cde13b7764959",
                "status": "saved",
                "published": false,
                "overwrite": false,
                "verified": false,
                "blockchain": {},
                "mainDateField": null,
                "env": "production",
                "geoInfo": false,
                "protected": false,
                "legend": {
                    "date": [],
                    "region": [],
                    "country": [],
                    "nested": [],
                    "integer": [],
                    "short": [],
                    "byte": [],
                    "double": [],
                    "float": [],
                    "half_float": [],
                    "scaled_float": [],
                    "boolean": [],
                    "binary": [],
                    "text": [],
                    "keyword": []
                },
                "clonedHost": {},
                "errorMessage": null,
                "taskId": null,
                "createdAt": "2016-08-01T15:28:15.050Z",
                "updatedAt": "2018-01-05T18:15:23.266Z",
                "dataLastUpdated": null,
                "metadata": [
                    { metadata props }
                ],
                "widget": [
                    { widget props },
                ],
                "widgetRelevantProps": [],
                "layerRelevantProps": []
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

> Loading all layers for the given dataset, not just the ones with env set to production

```shell
curl -X GET http://api.resourcewatch.org/dataset?includes=layer&env=production
```

> Loading the information about the user who authored the dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?includes=user
```

> Example response:

```json
{
    "data":  [{
        "id": "8afcf415-ee0b-4d19-96f8-c7304c152e1b",
        "type": "dataset",
        "attributes": {
            "name": "[delete] cit.005 Probabilities of Urban Expansion",
            "slug": "Possibilities-of-Urban-Expansion",
            "type": "raster",
            "subtitle": "(SEDAC)",
            "application": [
                "rw"
            ],
            "dataPath": "",
            "attributesPath": null,
            "connectorType": "rest",
            "provider": "cartodb",
            "userId": "72a0aa1071e394dd3287e137",
            "connectorUrl": "https://example.carto.com/tables/global_grid_prob_urban_expansion/public",
            "sources": [],
            "tableName": "global_grid_prob_urban_expansion",
            "status": "saved",
            "published": false,
            "overwrite": false,
            "verified": false,
            "blockchain": {},
            "subscribable": {},
            "mainDateField": null,
            "env": "production",
            "geoInfo": true,
            "protected": false,
            "legend": {
                "date": [],
                "region": [],
                "country": [],
                "nested": [],
                "integer": [],
                "short": [],
                "byte": [],
                "double": [],
                "float": [],
                "half_float": [],
                "scaled_float": [],
                "boolean": [],
                "binary": [],
                "text": [],
                "keyword": [],
                "long": null,
                "lat": null
            },
            "clonedHost": {},
            "errorMessage": null,
            "taskId": null,
            "createdAt": "2017-04-06T11:09:56.242Z",
            "updatedAt": "2018-01-18T15:41:48.408Z",
            "dataLastUpdated": null,
            "user": {
                "name": "John",
                "email": "john.doe@vizzuality.com",
                "role": "MANAGER"
            },
            "widgetRelevantProps": [],
            "layerRelevantProps": [
                "the_raster_webmercator"
            ]
        }
    }]
}
```

When fetching the dashboards, you can request additional entities to be loaded with the datasets. The following entities are available:

* `widget` - loads all widgets associated with a given dataset.
* `layer` - loads all layers associated with a given dataset.
* `vocabulary` - loads all vocabulary entities associated with a given dataset.
* `metadata` - loads all metadata associated with a given dataset.
* `user` - loads the name, email address and role of the author of the dataset. If you do not issue this request as an ADMIN user, or if no user data is available, the `user` object will be empty.

**Note:** If you include related entities (e.g. layers) with query filters, the filters will not cascade to the related entities.

### Verification

> Get verification information for a dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/:datasetID/verification
```

> Example response

```shell
[
    {
        "id": "string",
        "hash": "string"
    }
]
```

When available, the content of the `blockchain` field is used to validate the dataset's information using [Stampery](https://stampery.com/).

### Flush dataset cache

> Flush dataset's cache

```shell
curl -X POST https://api.resourcewatch.org/v1/:datasetID/flush \
-H "Authorization: Bearer <your-token>"
```

> Response:

```shell
OK
```

Flushes the cache for the specified dataset. Take into account that only the dataset itself, query results and fields will be flushed. Any other relation, like metadata, layers or widgets linked to the specified dataset will not be affected by this action.

*Note: Flushing a dataset's cache requires authentication by an ADMIN user.*

### Recover

> Recover dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/:datasetID/recover \
-H "Authorization: Bearer <your-token>"
```

> Response:

```shell
OK
```

Resets a dataset's `status` to `saved` and clears its errors. Keep in mind that this does NOT modify the dataset in any other way - if the underling dataset's data was inconsistent for any reason, this endpoint will not change it, and it's up to you to fix it using a `data-overwrite` or other endpoints.

*Note: Recover a dataset's status requires authentication by an ADMIN user.*

## Getting a dataset by id

> Getting a dataset by its id:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/51943691-eebc-4cb4-bdfb-057ad4fc2145
```

> Response:

```shell
{
    "data": {
        "id": "51943691-eebc-4cb4-bdfb-057ad4fc2145",
        "type": "dataset",
        "attributes": {
            "name": "Timber Production RDC (test)",
            "slug": "Timber-Production-RDC-test-1490086842132",
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

> To get the dataset including its relationships:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/06c44f9a-aae7-401e-874c-de13b7764959?includes=metadata,vocabulary,widget,layer
```

## Getting multiple datasets by ids

> Getting multiple dataset by its ids:

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

```shell
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
              "application": [
                "prep"
              ],
              "dataPath": null,
              "attributesPath": null,
              "connectorType": "rest",
              "provider": "featureservice",
              "userId": "586bc76036aacd381cb92b3a",
              "connectorUrl": "https://coast.noaa.gov/arcgis/rest/services/sovi/sovi_tracts2010/MapServer/19?f=pjson",
              "tableName": "sovisovi_tracts2010MapServer19",
              "status": "saved",
              "published": false,
              "overwrite": false,
              "verified": false,
              "blockchain": {},
              "mainDateField": null,
              "env": "production",
              "geoInfo": false,
              "protected": false,
              "legend": {
                "date": [],
                "region": [],
                "country": [],
                "nested": [],
                "integer": [],
                "short": [],
                "byte": [],
                "double": [],
                "float": [],
                "half_float": [],
                "scaled_float": [],
                "boolean": [],
                "binary": [],
                "text": [],
                "keyword": []
              },
              "clonedHost": {},
              "errorMessage": null,
              "taskId": null,
              "createdAt": "2016-09-01T08:18:39.006Z",
              "updatedAt": "2017-12-01T22:17:59.585Z",
              "dataLastUpdated": null,
              "widgetRelevantProps": [],
              "layerRelevantProps": []
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
              "application": [
                "prep"
              ],
              "dataPath": null,
              "attributesPath": null,
              "connectorType": "wms",
              "provider": "wms",
              "userId": "586bc76036aacd381cb92b3a",
              "connectorUrl": "https://raster.nationalmap.gov/arcgis/rest/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/25?f=pjson",
              "tableName": "LandCoverUSGS_EROS_LandCover_NLCDMapServer25",
              "status": "saved",
              "published": false,
              "overwrite": false,
              "verified": false,
              "blockchain": {},
              "mainDateField": null,
              "env": "production",
              "geoInfo": false,
              "protected": false,
              "legend": {
                "date": [],
                "region": [],
                "country": [],
                "nested": [],
                "integer": [],
                "short": [],
                "byte": [],
                "double": [],
                "float": [],
                "half_float": [],
                "scaled_float": [],
                "boolean": [],
                "binary": [],
                "text": [],
                "keyword": []
              },
              "clonedHost": {},
              "errorMessage": null,
              "taskId": null,
              "createdAt": "2016-09-01T16:59:30.294Z",
              "updatedAt": "2018-01-03T17:36:18.509Z",
              "dataLastUpdated": null,
              "widgetRelevantProps": [],
              "layerRelevantProps": []
            }
          }
        ]
    }
```

## Creating a Dataset

To create a dataset, you will need to be authenticated. Additionally, your user account needs to be associated with all `application` you specify for the dataset.

Depending on the provider you use for your dataset, your data may be copied to the API (ie: if you create a JSON-based dataset) or may be accessed by the RW API at the provided source (ie: carto datasets). Also: all RW API datasets are public, and will be visible and accessible to all users. It's also important to keep in mind that, depending on your user role, you may have permissions to create but not delete datasets. 

You must provide all of the required fields in the request body. The fields that compose a dataset are:

Field               |                                                      Description                                                       |    Type |                                                                                                                Values |                                          Required
------------------- | :--------------------------------------------------------------------------------------------------------------------: | ------: | --------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------:
name                |                                                      Dataset name                                                      |    Text |                                                                                                              Any Text |                                               Yes
type                |                                                      Dataset type                                                      |    Text |                                                                                                              Any Text |                                                No
subtitle            |                                                    Dataset subtitle                                                    |    Text |                                                                                                              Any Text |                                                No
application         |                                          Applications the dataset belongs to                                           |   Array |                                                                                         Any valid application name(s) |                                               Yes
connectorType       |                                                     Connector type                                                     |    Text |                                                                                                   rest, document, wms |                                               Yes
provider            |                                               The connectorType provider                                               |    Text |                                                           cartodb, feature service, gee, csv, tsv, xml, json, nexgddp |                                               Yes
connectorUrl        |                                                 Url of the data source                                                 |     Url |                                                                                                               Any url | Yes (except for gee, nexgddp and document type datasets)
sources             |                                                Urls of the data sources                                                |   Array |                                                                                                         Array of URLs |       No (recommended for document type datasets)
tableName           |                                                       Table name                                                       |    Text |                                                                                                  Any valid table name |            No (just for GEE and nexgddp datasets)
data                |                             JSON DATA only for json connector if connectorUrl not present                              |    JSON |                                                                                                            [{},{},{}] | No (just for json if connectorUrl is not present)
dataPath            |                                           Path to the data in a json dataset                                           |    Text |                                                                                                    Any valid JSON key | No (just for json if connectorUrl is not present)
legend              |                                      Legend for dataset. Keys for special fields                                       |  Object | "legend": {"long": "123", "lat": "123", "country": ["pais"], "region": ["barrio"], "date": ["startDate", "endDate"]}} |                                                No
overwrite           |                                          It allows to overwrite dataset data                                           | Boolean |                                                                                                            true/false |                                                No
published           |                                           To set a public or private dataset                                           | Boolean |                                                                                                            true/false |                                                No
protected           |                           If it's a protected layer (not is possible to delete if it's true)                           | Boolean |                                                                                                            true/false |                                                No
verified            |                                    To generate a verified blockchain of the dataset                                    | Boolean |                                                                                                            true/false |                                                No
vocabularies        |                                                    Cluster of tags                                                     |  Object |                                           `{"vocabularyOne": {"tags": [<tags>]},"vocabularyTwo": {"tags": [<tags>]}}` |                                                No
widgetRelevantProps |                                          Group of relevant props of a widget                                           |   Array |                                                                                                              Any Text |                                                No
layerRelevantProps  |                                           Group of relevant props of a layer                                           |   Array |                                                                                                              Any Text |                                                No
subscribable        | Available dataset queries for subscriptions parameters accepted: `{{begin}}` for date begin and `{{end}}` for date end |  Object |                                                                             `{" <queryname>": "<querybodytemplate>"}` | No (just for json if connectorUrl is not present)
env                 | The environment you want the dataset to be accessible on. Defaults to production |  Text | `staging`, `production` or `preproduction` | No


Once created, datasets have an auto-generated and unique slug and id that allows the user to get, create, update, query or clone that dataset. The dataset slug and the id cannot be modified.

When a dataset is created, the `status` is set to "pending" by default, meaning the dataset is not ready for usage just yet. Once the creation process is finished, the status will change to "saved", meaning you can now access the dataset and its data. This process is asynchronous and its duration will depend on the provider of the dataset as well as the amount of data it contains. You should use [check your dataset](#getting-a-dataset-by-id) manually to see when the `status` is updated.

In case the dataset creation process fails, the `status` value will be set to `failed`, and the `errorMessage` field will have a short description of what went wrong.

When creating a dataset, depending on the provider you are using, there are slight differences that must be reflected in your request:

### Carto datasets

> Example of creating a dataset based on CartoDB data

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "connectorType":"rest",
    "provider":"cartodb",
    "connectorUrl":"https://wri-01.carto.com/tables/wdpa_protected_areas/table",
    "application":[
     "gfw", "forest-atlas"
    ],
    "name":"World Database on Protected Areas -- Global"
}'
```

To create a dataset connected to a CartoDB data source, you should provide the following data:

Field           | Description                                                                            | Example value |
--------------- | :------------------------------------------------------------------------------------: | ------------: |
`connectorType` | The type of connector should be set to 'rest'.                                         | rest          |
`provider`      | The provider should be set to 'cartodb'.                                               | cartodb       |
`connectorUrl`  | The URL for the CartoDB table that this dataset will be using.                         | https://wri-01.carto.com/tables/wdpa_protected_areas/table |

*Note: Remember that creating datasets requires authentication.*

### ArcGIS feature Service

> Example of creating a dataset based on ArcGIS feature service data

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "connectorType":"rest",
    "provider":"featureservice",
    "connectorUrl":"https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0?f=json",
    "application":[
     "prep"
    ],
    "name":"Uncontrolled Public-Use Airports -- U.S."
}'
```

To create a dataset using ArcGIS Feature Service as data source, you should provide the following data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector should be set to 'rest'.                                         | rest           |
`provider`      | The provider should be set to 'featureservice'.                                        | featureservice |
`connectorUrl`  | The URL for the JSON data in ArcGIS services this dataset will be using.               | https://services.arcgis.com/uuid/arcgis/rest/services/example/FeatureServer/0?f=json |

*Note: Remember that creating datasets requires authentication.*

### Google Earth Engine

> Example of creating a dataset based on Google Earth Engine data

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "connectorType":"rest",
    "provider":"gee",
    "tableName": "JRC/GSW1_0/GlobalSurfaceWater"
    "application":[
     "rw"
    ],
    "name":"Water occurrence"
}'
```

To create a dataset using Google Earth Engine as data source, you should provide the following data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector should be set to 'rest'.                                         | rest           |
`provider`      | The provider should be set to 'gee'.                                                   | gee            |
`tableName`     | The name of the data table in GEE this dataset will be using.                          | JRC/GSW1_0/GlobalSurfaceWater |

*Note: Remember that creating datasets requires authentication.*

### NEXGDDP

> Example of creating a dataset based on NEXGDDP data

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "connectorType":"rest",
    "provider":"nexgddp",
    "tableName": "historical/ACCESS1_0"
    "application":[
     "rw"
    ],
    "name":"Nexgddp"
}'
```

To create a dataset using NEXGDDP as data source, you should provide the following data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector should be set to 'rest'.                                         | rest           |
`provider`      | The provider should be set to 'nexgddp'.                                               | nexgddp        |
`tableName`     | The name of the data table in NEXGDDP this dataset will be using.                      | historical/ACCESS1_0 |

*Note: Remember that creating datasets requires authentication.*

### Rasdaman

> Example of creating a dataset based on Rasdaman data

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset' -d \
-H 'Authorization: Bearer <your-token>'  \
-H 'Content-Type: application/json' -d \
'{
    "connectorType":"rest",
    "provider":"rasdaman",
    "connectorUrl":"rw.dataset.raw/1508321309784_test_rasdaman_1b.tiff",
    "application":[
     "rw"
    ],
    "name":"rasdaman dataset"
}'
```

To create a dataset using Rasdaman as data source, you should provide the following data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector should be set to 'rest'.                                         | rest           |
`provider`      | The provider should be set to 'rasdaman'.                                              | rasdaman       |
`connectorUrl`  | A URL pointing to a valid geotiff file.                                                | rw.dataset.raw/1508321309784_test_rasdaman_1b.tiff |

*Note: Remember that creating datasets requires authentication.*

### BigQuery

> Example of creating a dataset based on BigQuery data

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset' -d \
-H 'Authorization: Bearer <your-token>'  \
-H 'Content-Type: application/json' -d \
'{
    "connectorType": "rest",
    "provider": "bigquery",
    "tableName": "[bigquery-public-data:ghcn_m.ghcnm_tmax]",
    "application": ["rw"],
    "name": "BigQuery dataset"
}'
```

To create a dataset using BigQuery as data source, you should provide the following data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector should be set to 'rest'.                                         | rest           |
`provider`      | The provider should be set to 'bigquery'.                                              | bigquery       |
`tableName`     | The name of the data table in BigQuery this dataset will be using.                     | [bigquery-public-data:ghcn_m.ghcnm_tmax] |

*Note: Remember that creating datasets requires authentication.*

### Loca

> Example of creating a dataset based on Loca data

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset' -d \
-H 'Authorization: Bearer <your-token>'  \
-H 'Content-Type: application/json' -d \
'{
    "connectorType": "rest",
    "provider": "loca",
    "tableName": "loca_tasavg/rcp85_decadal",
    "application": ["rw"],
    "name": "Loca dataset"
}'
```

To create a dataset using Loca as data source, you should provide the following data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector should be set to 'rest'.                                         | rest           |
`provider`      | The provider should be set to 'loca'.                                                  | loca           |
`tableName`     | The name of the data table in Loca this dataset will be using.                         | loca_tasavg/rcp85_decadal |

*Note: Remember that creating datasets requires authentication.*

### WMS

> Example of creating a dataset based on WMS data

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset' -d \
-H 'Authorization: Bearer <your-token>'  \
-H 'Content-Type: application/json' -d \
'{
    "connectorType": "wms",
    "provider": "wms",
    "connectorUrl": "https://raster.nationalmap.gov/arcgis/rest/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/25?f=pjson",
    "application": ["rw"],
    "name": "WMS dataset"
}'
```

To create a dataset using WMS as data source, you should provide the following data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector should be set to 'wms'.                                          | wms            |
`provider`      | The provider should be set to 'wms'.                                                   | wms            |
`connectorUrl`  | The URL for the WMS table that this dataset will be using.                             | https://raster.nationalmap.gov/arcgis/rest/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/25?f=pjson |

*Note: Remember that creating datasets requires authentication.*

### Document based datasets: JSON, CSV, TSV or XML

> Creating a CSV dataset with data provided by externally hosted files:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
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
    "legend": {
      "lat": "lat",
      "long": "lon"
    },
    "name":"Glad points"
}'
```

> Creating a JSON dataset with data provided on the request body:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "connectorType":"document",
    "provider":"json",
    "application":[
     "your", "apps"
    ],
    "data": {"myData":[
            {"name":"nameOne", "id":"random1"},
            {"name":"nameTow", "id":"random2"}
          ]},
    "legend": {
      "lat": "lat-column",
      "long": "long-column",
      "date": ["date1Column", "date2Column"],
      "region": ["region1Column", "region2Column"],
      "country": ["country1Column", "country2Column"]
    },
    "name":"Example JSON Dataset"
}'
```

This dataset hosts data from files in JSON, CSV, TSV or XML format. When creating the dataset, the data is copied from the provided
source into the API's internal Elasticsearch instance, which is the source used for subsequent queries or other operations.

The original data must be available on a publicly accessible URLs, specified in the `sources` array field. The URLs must be an accessible CSV, TSV or XML file, non-compressed - zip, tar, tar.gz, etc are not supported. The only exception to this rule is when creating a JSON-based dataset, in which case you can instead pass the actual data on the dataset creation request body - see the example below for more details. You can specify multiple URLs for a single dataset, provided all files have the same format and data structure. This is particularly useful when creating very large datasets, as it will allow the creation process to be parallelized. No warranties are provided about the order in which the files or their parts are imported.

Here's a breakdown of the fields specific to the creation of a document-based dataset:

Field        |                        Description                                |   Type |        Values | Required
------------ | :-----------------------------------------------------------:     | -----: | ------------: | -------:
connectorType| The connector type for this dataset.                              | String | `document`    | Yes
provider     | The type of provider for this dataset.                            | String | `csv`, `tsv`, `json` or `xml` | Yes
sources      | List of URLs from which to source data                            |  Array |     URL array | Yes, unless JSON data is provided using the `data` field
data         | JSON DATA only for json connector if connectorUrl not present     |  Array |    [{},{},{}] | Yes for JSON if `sources` is not present
legend       | See section below                                                 | Object |               |       No
connectorUrl | URL from which to source data. **Deprecated: use `sources` instead** | String |        URL |       No

**Deprecation notice: The previously used `connectorUrl` field should be considered deprecated when creating document-based datasets.**

*Note 1: Remember that creating datasets requires authentication.*

*Note 2: When creating a document-based dataset, if any of the fields has a numerical name (for example, column: `3`), a string named `col_` will be appended to the beginning of the name of the column. This way, an uploaded column named `3` will become `col_3`.*

#### Legend

By default, the data is ingested by the API and the field types are automatically determined by the underlying Elasticsearch [dynamic mapping API](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/mapping.html#_dynamic_mapping).
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

## Uploading a Dataset (Binary)

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
  "connectorUrl": "rw.dataset.raw/tmp/upload_75755182b1ceda30abed717f655c077d-observed_temp.csv"
}
```

> Using the returned connectorUrl to create a new dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
'{
    "connectorType":"document",
    "provider":"csv",
    "connectorUrl":"rw.dataset.raw/tmp/upload_75755182b1ceda30abed717f655c077d-observed_temp.csv",
    "application":[
     "your", "apps"
    ],
    "name":"Example RAW Data Dataset"
}'
```

You can upload your raw data directly to S3 making use of the `upload` endpoint. This endpoint accepts a file in the property "dataset" and returns a valid connectorUrl. With this connectorUrl you can create or update a "document" dataset, or a raster dataset in the Rasdaman adapter.

*Note: Uploading raw data for using in a dataset requires authentication.*

## Updating a Dataset

To perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the dataset
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)

> Example request for updating the name of a dataset

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
'{
    "name": "Another name for the dataset"
}'
```

In order to modify the dataset, you can PATCH a request. The following fields are available (only the fields provided in the request body will be updated, the remaining fields will be left as they are) for updating the dataset, providing them in the request body:

Field               |                                                      Description                                                       |    Type | Values   |
------------------- | :--------------------------------------------------------------------------------------------------------------------: | ------: | -------: |
name                |                                                      Dataset name                                                      |    Text | Any Text |
type                |                                                      Dataset type                                                      |    Text | Any Text |
subtitle            |                                                    Dataset subtitle                                                    |    Text | Any Text |
application         |                     Applications the dataset belongs to                                           |   Array | Any valid application name(s) |
connectorType       |                                          Connector type                                                     |    Text | rest, document, wms |
provider            |      The connectorType provider                                     |    Text | cartodb, feature service, gee, csv, tsv, xml, json, nexgddp |
connectorUrl        |                                                 Url of the data source                                                 |     Url | Any url  |
sources             |                                                Urls of the data sources                                                |   Array | Array of URLs |
tableName           |                                                       Table name                                                       |    Text | Any valid table name |
data                |                             JSON DATA only for json connector if connectorUrl not present                              |    JSON | [{},{},{}] |
dataPath            |                                           Path to the data in a json dataset                                           |    Text | Any valid JSON key |
legend              |                                      Legend for dataset. Keys for special fields                                       |  Object | "legend": {"long": "123", "lat": "123", "country": ["pais"], "region": ["barrio"], "date": ["startDate", "endDate"]}} |
overwrite           |                                          It allows to overwrite dataset data                                           | Boolean | true/false |
published           |                                           To set a public or private dataset                                           | Boolean | true/false |
protected           |                           If it's a protected layer (not is possible to delete if it's true)                           | Boolean | true/false |
verified            |                                    To generate a verified blockchain of the dataset                                    | Boolean | true/false |
vocabularies        |                                                    Cluster of tags                                                     |  Object | `{"vocabularyOne": {"tags": [<tags>]},"vocabularyTwo": {"tags": [<tags>]}}` |
widgetRelevantProps |                                          Group of relevant props of a widget                                           |   Array | Any Text |
layerRelevantProps  |                                           Group of relevant props of a layer                                           |   Array | Any Text |
subscribable        | Available dataset queries for subscriptions parameters accepted: `{{begin}}` for date begin and `{{end}}` for date end |  Object | `{" <queryname>": "<querybodytemplate>"}` |
env                 | The environment you want the dataset to be accessible on. Defaults to production |  Text | `staging`, `production` or `preproduction` |

*Note 1: Updating a dataset requires authentication.*

Note 2: When updating the `env` property of a dataset the change will cascade down to all associated layer and widget entities.

## Deleting a Dataset

> Example request for deleting a dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id> \
-H "Authorization: Bearer <your-token>"
-H "Content-Type: application/json"
```

In order to delete a dataset, the following conditions must be met:

- the dataset's `protected` property must be set to `false`.
- the user must be logged in and belong to the same application as the dataset
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)

**When a dataset is deleted, the user's applications that were present on the dataset will be removed from it. If this results in a dataset without applications, the dataset itself will be then deleted.**

**Note 1: Deleting a dataset might remove it permanently, so it is recommended that you save a local copy before doing so.**

*Note 2: the deletion process cascades in a non-atomic way; deleting a dataset will also attempt to remove all the layers, widgets, vocabularies, related knowledge graph elements, and metadata entities associated with it. However, if one of these deletes fails (ie. attempting to delete a protected layer will fail), the dataset will still be deleted, and those resources will be left orphaned.*

## Cloning a Dataset

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

This endpoint returns a new dataset that is a replica of the dataset provided. It can take the optional query parameter `fullCloning=true` to force the cloning of the metadata.

The following fields must/can be provided when cloning a dataset (check also the example on the side):

Field             |                         Description                  |    Type | Example value | Required    |
----------------- | :--------------------------------------------------- | ------: | ------------: | ----------: |
datasetUrl        | The connectorUrl for the new dataset.                |    Text | A valid URL   | Yes         |
application       | A list of the new dataset applications.              |   Array | Any valid application name(s) | Yes |
legend            | Legend for the dataset. If provided, it will override the original dataset values. |  Object | "legend": {"long": "123", "lat": "123", "country": ["pais"], "region": ["barrio"], "date": ["startDate", "endDate"]}} |
applicationConfig | Group of relevant props of a widget. If provided, it will override the original dataset values. |   Array | Any Text      |

The cloned dataset has the same attributes as the source one, except for the following ones:

* `name`: The current timestamp is added to the original dataset's name.
* `published`: will be false unless specified in the request body.

The field `clonedHost` will contain the host information about the original dataset.

*Note: Cloning a dataset requires authentication, and you will only be able to clone datasets from apps associated to your user.*

## Concatenate and Append Data

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

Using these endpoints, you can add more data to an already existing dataset. You can either provide the URL for the file containing the data you wish to add, or simply provide that data in the body of your request, as a JSON object.

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

## Overwrite Data

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

Using this endpoint, you can add completely replace the data of an already existing dataset. All previously existing data will be permanently deleted. You can either provide the URL(s) for the file(s) containing the data you wish to add, or simply provide that data in the body of your request, as a JSON object. There are no requirements regarding similarity of the data structure between existing and new data - your overwrite data can have a completely different data schema.

This process is asynchronous and not instantaneous. Immediately when triggered, this request will cause the dataset's `status` to be set to `pending`, meaning you will not be able to issue new overwrite or concat requests, and will not yet be able to access the new data yet. Once the request has been fully processed, the status will be automatically set to `saved` and the new data will be accessible. Depending on factors like API load or the size of the data being uploaded, this may take from a few minutes to a few hours to occur. The API does not issue any notification when the asynchronous operation is finished.

In order to perform this operation, the following conditions must be met:
- the dataset's `overwrite` property must be set to `true`.
- the dataset's `status` property must be set to `saved`.
- the user must be logged in and match one of the following:
  - have role `ADMIN` and belong to the same application as the dataset
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)


Field        |                        Description                                |   Type |        Values | Required
------------ | :-----------------------------------------------------------:     | -----: | ------------: | -------:
provider     | Dataset provider this include inner connectors and 3rd party ones | String | [A valid dataset provider](##supported-dataset-sources) | Yes
sources      | List of URLs from which to source data                            |  Array |     URL array | Yes, unless JSON data is provided using the `data` field
data         | JSON DATA only for json connector if connectorUrl not present     |  Array |    [{},{},{}] | Yes for JSON if `sources` is not present
legend       | The schema of the new data. If none is provided, a guessing mechanism will be used. The existing `legend` value of the dataset will be ignored and overwritten in all `overwrite` operations. See [the legend section](#legend) above for more details.                                                | Object |               |       No

*Note: Overwrite a dataset's data requires authentication, and the user making the request must meet one of the following conditions:*

* **MANAGER** users who are included in the `userId` field of the dataset entity.
* **ADMIN** users who belong to **at least one of the dataset's applications**.

## Dataset data sync

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

To sync the data of a dataset, you need to choose the action type (concat or overwrite), a cron pattern and a valid url. This configuration should be set in the 'sync' property when creating or updating a document dataset.

Please be sure that the 'overwrite' property is set to true. This could be used as a lock in order to not allow new updates even if the sync task is actually created.


## Dataset reference

This section gives you a complete view at the properties that are maintained as part of dataset. When interacting with a dataset (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/resource-watch/dataset/blob/master/app/src/models/dataset.model.js).

Filter         | Description                                                                  | Type        
-------------- | ---------------------------------------------------------------------------- | ---------------------------------------------
id             | Unique Id of the dataset. Auto generated on creation, cannot be modified.    | String      
name           | Name of the dataset.                                                         | String      
slug           | Slug of the dataset. Auto generated on creation, cannot be modified.         | String      
type           | Type of the dataset.                                                         | String      
subtitle       | Subtitle of the dataset.                                                     | String      
application    | Applications associated with this dataset.                                   | Array       
applicationConfig | Key-value storage of application-specific data. Use the `application` value as key and a JSON Object as the value to store complex, extensible data. | Object      
dataPath       | Path to the data in a JSON file-based datasets.                              | String      
attributesPath |                                                                              | String      
connectorType  | Type of connector. `wms` for WMS-based datasets, `rest` for datasets that rely on external data sources (carto, arcgis, etc) or `document` for file-based datasets (JSON, CSV, etc).                      | String      
provider       | Dataset provider.                                                            | String      
userId         | Id of the user who created the dataset.                                      | String      
connectorUrl   | Path to the source of the data. On datasets with `document` connectorType, `sources` should be used instead. | String      
sources        | Path to the source files of the data. Only used on datasets with `document` connectorType. | Array       
tableName      | Additional value used to locate the dataset within a given underlying provider. Refer to the documentation of the different connector for more details. | String
status         | Status of the dataset. `saved` means the dataset is available to use, `pending` means an operation is ongoing and the dataset is temporarily unavailable, `error` means the dataset is in an invalid state and requires further action before becoming available. | String      
overwrite      | If the data can be overwritten (only for being able to update dataset)       | Boolean     
verified       | If this dataset contains data that is verified using blockchain              | Boolean     
errorMessage   | If this dataset is in `error` state, this field may contain additional details about the error. | String      
mainDateField  |                                                                              | String      
published      | If the dataset is published or not.                                          | Boolean     
env            | Environment to which the dataset belongs.                                    | String
geoInfo        | If it contains interceptable geographical info                               | Boolean     
protected      | If the dataset is protected. A protected dataset cannot be deleted.          | Boolean     
taskId         | Id of the latest task associated with this dataset. Typically only present in `document` connectorType datasets | String      
subscribable   | Information about the dataset being subscribable for alerts. More info about this can be found on the [Subscriptions](#subscriptions) section of the docs. | Object     
blockchain.id  |                                                                              | String      
blockchain.hash |                                                                             | String      
blockchain.time |                                                                             | String      
blockchain.backupUrl |                                                                        | String      
legend.lat     | Dataset field representing a latitude value.                                 | String      
legend.long    | Dataset field representing a longitude value.                                | String
legend.*       | Different keys corresponding to data types. Each key may have an array of strings, referencing dataset fields that match that data type. | Array             
clonedHost.hostProvider | When cloning a dataset, this will retain the `provider` value of the original dataset. | String      
clonedHost.hostUrl | When cloning a dataset, this will retain the `connectorUrl` value of the original dataset. | String      
clonedHost.hostId | When cloning a dataset, this will retain the `Id` value of the original dataset.  | String      
clonedHost.hostType | When cloning a dataset, this will retain the `connectorType` value of the original dataset.  | String      
clonedHost.hostPath | When cloning a dataset, this will retain the `tableName` value of the original dataset.  | String      
widgetRelevantProps | Group of relevant props of a widget.                                    | Array       
layerRelevantProps | Group of relevant props of a layer.                                      | Array       
dataLastUpdated | User defined date of when a dataset was last updated.                       | Date    
userName       | Name of the user who created the dataset. This value is used only internally, and is never directly exposed through the API | String       
userRole       | Role of the user who created the dataset. This value is used only internally, and is never directly exposed through the API | String       
createdAt      | Automatically maintained date of when the dataset was created.               | Date       
updatedAt      | Automatically maintained date of when the dataset was last updated.          | Date       
