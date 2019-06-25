# Dataset

## What is a Dataset?

A dataset abstracts the data that can be obtained from several sources into a common interface. There are several data providers supported in the API, and each of those has a different provider. Datasets can belong to several applications.

## Supported dataset sources

### Third party Dataset connectors

For data stored on third party services.

#### Carto

**`(connectorType: 'rest', provider: 'cartodb')`**<br>
[![](images/dataset/carto.png)](https://www.carto.com) CARTO is an open, powerful, and intuitive map platform for discovering and predicting the key insights underlying the location data in our world.

### ArcGIS Feature service

**`(connectorType: 'rest', provider: 'featureservice')`** [![](https://www.arcgis.com/features/img/logo-esri.png)](https://www.arcgis.com/features/index.html)<br>
ArcGIS for server is a Complete, Cloud-Based Mapping Platform.

### Google Earth Engine

**`(connectorType: 'rest', provider: 'gee')`** [![](https://earthengine.google.com/static/images/GoogleEarthEngine_Grey_108.png)](https://earthengine.google.com/)<br>
Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth's surface.

#### Web Map Services ([WMS](http://www.opengeospatial.org/standards/wms))

**`(connectorType: 'wms', provider: 'wms')`**

WMS connector provides access to data served through [OGC WMS](http://www.opengeospatial.org/standards/wms) protocol standard.

#### Rasdaman (Raster Data Manager)

**`(connectorType: 'rest', provider: 'rasdaman')`**<br>
[Rasdaman](http://www.rasdaman.com/) is a database with capabilities for storage, manipulation and retrieval of multidimensional arrays.

### Internal storage connectors

For data stored in our system.

#### NEX-GDDP

**`(connectorType: 'rest', provider: 'nexgddp')`**<br>
The NASA Earth Exchange Global Daily Downscaled Projections ([NEX-GDDP](https://nex.nasa.gov/nex/projects/1356/)) dataset is comprised of downscaled climate scenarios for the globe that are derived from the General Circulation Model (GCM) runs conducted under the Coupled Model Intercomparison Project Phase 5 (CMIP5) and across two of the four greenhouse gas emissions scenarios known as Representative Concentration Pathways (RCPs).

#### Comma-Separated Values (CSV)

**`(connectorType: 'document', provider: 'csv')`**<br>
Arbitrary Comma-Separated Values data

#### Tab-Separated Values (TSV)

**`(connectorType: 'document', provider: 'tsv')`**<br>
Arbitrary tab-Separated Values data

#### JavaScript Object Notation (JSON)

**`(connectorType: 'document', provider: 'json')`**<br>
Arbitrary [json](http://www.json.org/) structured data

#### XML

**`(connectorType: 'document', provider: 'xml')`**<br>
Arbitrary [XML](https://www.w3.org/TR/2006/REC-xml11-20060816/) data documents

## Getting all datasets

This endpoint will allow to get all datasets available in the API:


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
        },
    ...
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

### Slug & dataset-id

Datasets have an auto-generated and unique slug and id that allows the user to get, create, update, query or clone that dataset.

The dataset slug and the id cannot be updated even if the name changes.

### Error Message

When a dataset is created the status is set to "pending" by default. Once the adapter validates the dataset, the status is changed to "saved". If the validation fails, the status will be set to "failed" and the adapter will also set an error message indicating the reason.

### Filters

The dataset list provided by the endpoint can be filtered with the following attributes:

Filter        | Description                                                                  | Accepted values
------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
name          | Allow us to filter by name                                                   | any valid text
type          | Allow us to distinguish between tabular and raster datasets                  | `raster` or `tabular`
app           | Applications to which this dataset is being used                              | Available applications like: `["data4sdgs","gfw","rw","aqueduct","prep","forest-atlas","gfw-climate","aqueduct-water-risk","test","gfw-pro","globalforestwatch", "ghg-gdp"]`
connectorType |                                                                              | `rest` or `document`
provider      | Dataset provider this include inner connectors and 3rd party ones            | [A valid dataset provider](##supported-dataset-sources)
userId        | the user who registered the dataset                                          | valid id
status        | the internal dataset status at connection time                               | `pending`, `saved` or `failed`
published     |                                                                              | `true`or `false`
env           | If the dataset is in the staging, preproduction environment or in production one          | `staging`, `production` or `preproduction`. Defaults to `production`
overwritted   | If the data can be overwritten (only for being able to make dataset updates) | `true`or `false`
verify        | If this dataset contains data that is verified using blockchain              | `true`or `false`
protected     | If it's a protected layer                                                    | `true`or `false`
geoInfo       | If it contains interceptable geographical info                               | `true`or `false`

> Filtering datasets

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?name=birds&provider=cartodb
```

> For inclusive filtering with array props use '@'

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?app=gfw@rw@prep
```

### Sorting

#### Basics of sorting

The API currently supports sorting by means of the `sort` parameter.

> Sorting datasets

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=name
```

Multiple sorting criteria can be used, separating them by commas.


> Sorting datasets by multiple criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=name,description
```

You can specify the sorting order by prepending the criteria with either `-` or `+`. By default, `asc` order is assumed.

> Explicit order of sorting

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-name,+description
```

#### Special sorting criteria

There are four special sorting criteria:

- `metadata`: delegates sorting to the metadata component, sorting by the name field of the metadata.
- `most-viewed` delegates sorting to the graph component, sorting by the datasets that have been queried more frequently. Supports ascending/descending order.
- `most-favorited`: delegates sorting to the graph component, sorting by the datasets that have been more favorited. Supports ascending/descending order.
- `relevance`: delegates sorting to the metadata component, sorting by the datasets which metadata better match the search criteria. Can only be used in conjunction with a `search` parameter. Does not support ascending order.

Special search criteria must be used as sole sorting criteria, as it's not possible to combine any of them with any other search criteria.

> Sorting datasets with special criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-most-favorited
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=relevance&status=saved&search=agriculture
```

### Relationships

Available relationships: Any dataset relationship ['widget', 'layer', 'vocabulary', 'metadata']

> Including relationships

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=slug,-provider,userId&status=saved&includes=metadata,vocabulary,widget,layer
```

### Advanced filters

By vocabulary-tag matching

> Matching vocabulary tags

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=slug,-provider,userId&status=saved&includes=metadata,vocabulary,widget,layer&vocabulary[legacy]=umd
```

### Pagination

Field        |         Description          |   Type
------------ | :--------------------------: | -----:
page[size]   | The number elements per page | Number
page[number] |       The page number        | Number

> Paginating the output

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=slug,-provider,userId&status=saved&includes=metadata,vocabulary,widget,layer&vocabulary[legacy]=threshold&page[number]=1
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=slug,-provider,userId&status=saved&includes=metadata,vocabulary,widget,layer&vocabulary[legacy]=threshold&page[number]=2
```

## How to get a specific dataset

> To get a dataset:

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

## Creating a Dataset

To create a dataset, you will need an authorization token. Follow the steps of this [guide](#generate-your-own-oauth-token) to get yours.

To create a dataset, you need to define all of the required fields in the request body. The fields that compose a dataset are:

Field               |                                                      Description                                                       |    Type |                                                                                                                Values |                                          Required
------------------- | :--------------------------------------------------------------------------------------------------------------------: | ------: | --------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------:
name                |                                                      Dataset name                                                      |    Text |                                                                                                              Any Text |                                               Yes
type                |                                                      Dataset type                                                      |    Text |                                                                                                              Any Text |                                                No
subtitle            |                                                    Dataset subtitle                                                    |    Text |                                                                                                              Any Text |                                                No
application         |                                          Applications the dataset belongs to                                           |   Array |                                                                                         Any valid application name(s) |                                               Yes
connectorType       |                                                     Connector type                                                     |    Text |                                                                                                   rest, document, wms |                                               Yes
provider            |                                               The connectorType provider                                               |    Text |                                                           cartodb, feature service, gee, csv, tsv, xml, json, nexgddp |                                               Yes
connectorUrl        |                                                 Url of the data source                                                 |     Url |                                                                                                               Any url |    Yes (except for gee, nexgddp and json formats)
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
env                 | The environment you want the dataset to be accessible on. Defaults to production |  Text | staging, preproduction, production | No

There are some differences between datasets types.

### Carto datasets

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "connectorType":"rest",
    "provider":"cartodb",
    "connectorUrl":"<cartoUrl>",
    "application":[
     "your", "apps"
    ],
    "name":"Example Carto Dataset"
}'
```

> A real example:

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

<aside class="notice">
    This is an authenticated endpoint!
</aside>

### ArcGIS feature Service

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

<aside class="notice">
    This is an authenticated endpoint!
</aside>

### Google Earth Engine

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

### NEXGDDP

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

### Rasdaman

The `connectorUrl` must be a URL pointing to a valid geotiff file.

```shell
curl -XPOST 'https://api.resourcewatch.org/v1/dataset' -d \
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

### JSON, CSV, TSV or XML

This dataset hosts data from a file in JSON, CSV, TSV or XML format. When creating the dataset, the data is copied from the provided
source into the API's internal Elasticsearch instance, which is the source used for subsequent queries or other operations.

The original data must be available on a publicly accessible URL, specified in the `connectorUrl` field. The URL must be an accessible CSV, TSV or XML file, non-compressed - zip, tar, tar.gz, etc are not supported. The only exception to this rule is when creating a JSON-based dataset, in which case you can instead pass the actual data on the dataset creation request body - see the example below for more details.

Here's a breakdown of the fields specific to the creation of a document-based dataset:

Field      |                  Description                   |   Type |        Values | Required
---------- | :--------------------------------------------: | -----: | ------------: | -------:
connectorUrl |                                              |   Text |           URL | Yes, unless JSON data is provided using the `data` field.
data       | JSON DATA only for json connector if connectorUrl not present |  Array |    [{},{},{}] | Yes for JSON if connectorUrl not present
legend     | See section below                              | Object |               |       No



<aside class="notice">
When creating a dataset, if any of the fields has a numerical name (for example, column: `3`), a string named `col_` will be appended to the beginning of the name of the column. This way, an uploaded column named `3` will become `col_3`.
</aside>


```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "connectorType":"document",
    "provider":"csv",
    "connectorUrl":"https://gfw2-data.s3.amazonaws.com/alerts-tsv/glad_headers.csv",
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
    "connectorUrl":"",
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

<aside class="notice">
    This is an authenticated endpoint!
</aside>

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

You can upload your raw data directly to S3 making use of the "upload" endpoint. This endpoint accepts a file in the property "dataset" and returns a valid connectorUrl. With this connectorUrl you can create or update a "document" dataset, or a raster dataset in the Rasdaman adapter.

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/upload \
-H "Authorization: Bearer <your-token>" \
-F provider=csv,
-F dataset=@<your-file>
```

It returns the following information:

> Response

```json
{
  "connectorUrl": "rw.dataset.raw/tmp/upload_75755182b1ceda30abed717f655c077d-observed_temp.csv"
}
```

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

## Updating a Dataset

In order to modify the dataset, you can PATCH a request. It accepts the same parameters as the _create dataset_ endpoint, and you will need an authentication token.

> An example update request:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
'{
    "name": "Another name for the dataset"
}'
```

<aside class="notice">
    This is an authenticated endpoint!
</aside>

Note: When updating the `env` property of a dataset the change will cascade down to all associated layer and widget entities.

## Deleting a Dataset

**When a dataset is deleted the user's applications that were present on the dataset will be removed from it. If this results in a dataset without applications, the dataset itself will be then deleted.**

Datasets can be deleted either by with role ADMIN or by the user with role MANAGER that created them. 

In order to perform this operation, the following conditions must be met:
- the dataset's `protected` property must be set to `false`.
- the user must be logged in and belong to the same application as the dataset
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)

Note that the deletion process cascades in a non-atomic way; deleting a dataset will also attempt to remove all the layers, widgets, vocabularies, related knowledge graph elements, and metadata entities associated with it. However, if one of these deletes fails (ie. attempting to delete a protected layer will fail), the dataset will still be deleted, and those resources will be left orphaned.

<aside class="warning">
Deleting a dataset removes it permanently! It is recommended that you save a local copy before doing so.
</aside>

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id> \
-H "Authorization: Bearer <your-token>"
-H "Content-Type: application/json"
```

<aside class="notice">
    This is an authenticated endpoint!
</aside>

## Cloning a Dataset

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
    ]
  }
}'
```

<aside class="notice">
    This is an authenticated endpoint!
</aside>

## Concatenate and Append Data

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

> Concatenate data using external data source:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/concat \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "provider": "json",
    "connectorUrl":"<csvUrl>",
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
    "connectorUrl":"<csvUrl>",
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

<aside class="notice">
    These are authenticated endpoints.
</aside>

## Overwrite Data

Using this endpoint, you can add completely replace the data of an already existing dataset. All previously existing data will be permanently deleted. You can either provide the URL for the file containing the data you wish to add, or simply provide that data in the body of your request, as a JSON object.

This process is asynchronous and not instantaneous. Immediately when triggered, this request will cause the dataset's `status` to be set to `pending`, meaning you will not be able to issue new overwrite or concat requests, and will not yet be able to access the new data yet. Once the request has been fully processed, the status will be automatically set to `saved` and the new data will be accessible. Depending on factors like API load or the size of the data being uploaded, this may take from a few minutes to a few hours to occur. The API does not issue any notification when the asynchronous operation is finished.
 
In order to perform this operation, the following conditions must be met:
- the dataset's `overwrite` property must be set to `true`.
- the dataset's `status` property must be set to `saved`.
- the user must be logged in and match one of the following:
  - have role `ADMIN` and belong to the same application as the dataset
  - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)

> Overwrite data using external data source:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/data-overwrite \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
   "url":"<url>",
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

<aside class="notice">
    This is an authenticated endpoint!
</aside>

Who can use this endpoint?

* **MANAGER** users who are included in the `userId` field of the dataset entity.
* **ADMIN** users who belong to **at least one of the dataset's applications**.

## Dataset data sync

To sync the data of a dataset, you need to choose the action type (concat or overwrite), a cron pattern and a valid url. This configuration should be set in the 'sync' property when creating or updating a document dataset.

Please be sure that the 'overwrite' property is set to true. This could be used as a lock in order to not allow new updates even if the sync task is actually created.

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
