# Dataset

## What is a Dataset?

A dataset abstracts the data that can be obtained from several sources into a common interface. There are several data providers supported in the API, and each of those has a different provider. Datasets can belong to several applications.

## Supported dataset sources
### Carto
**(connectorType: 'rest', provider: 'cartodb')**
<a href="https://www.carto.com"><img src="images/dataset/carto.png" class="logo-third"/></a>
CARTO is an open, powerful, and intuitive platform for discovering and predicting the key insights underlying the location data in our world.

### ArcGIS
**(connectorType: 'rest', provider: 'featureservice')**
<a href="https://www.arcgis.com/features/index.html"><img src="https://www.arcgis.com/features/img/logo-esri.png" class="logo-third"/></a>
ArcGIS Online is a Complete, Cloud-Based Mapping Platform.

### Google Earth Engine
**(connectorType: 'rest', provider: 'gee')**
<a href="https://earthengine.google.com/"><img src="https://earthengine.google.com/static/images/GoogleEarthEngine_Grey_108.png" class="logo-third"/></a>
Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth's surface.

### NEX-GDDP
**(connectorType: 'rest', provider: 'nexgddp')**
The NASA Earth Exchange Global Daily Downscaled Projections (NEX-GDDP) dataset is comprised of downscaled climate scenarios for the globe that are derived from the General Circulation Model (GCM) runs conducted under the Coupled Model Intercomparison Project Phase 5 (CMIP5) and across two of the four greenhouse gas emissions scenarios known as Representative Concentration Pathways (RCPs).

### Rasdaman
**(connectorType: 'rest', provider: 'rasdaman')**
Rasdaman ('raster data manager') is a database with capabilities for storage, manipulation and retrieval of multidimensional arrays.


### CSV
**(connectorType: 'document', provider: 'csv')**
Arbitrary Comma-Separated Values datasets 

### JSON
**(connectorType: 'document', provider: 'json')**

### TSV
**(connectorType: 'document', provider: 'tsv')**

### XML
**(connectorType: 'document', provider: 'xml')**

### WMS
**(connectorType: 'wms', provider: 'wms')**

## Getting all datasets

To get all datasets:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset
```

<aside class="success">
Remember — the response is in JSONApi format.
</aside>

> Response:

```json
{
	"data": {
		"id": "c4ee894f-2a9f-4681-9c3d-d94cf106f796",
		"type": "dataset",
		"attributes": {
			"name": "World Price",
			"slug": "World-Price-1490086842551",
			"type": null,
			"subtitle": null,
			"application": ["aqueduct"],
			"dataPath": null,
			"attributesPath": null,
			"connectorType": "rest",
			"provider": "cartodb",
			"userId": "58333dcfd9f39b189ca44c75",
			"connectorUrl": "https://wri-01.carto.com/tables/combined01_prepared",
			"tableName": "combined01_prepared",
			"status": "saved",
			"published": true,
			"overwrite": false,
			"legend": {
				"date": [],
				"region": [],
				"country": []
			},
			"clonedHost": {},
			"errorMessage": null,
			"createdAt": "2017-01-31T11:47:27.811Z",
			"updatedAt": "2017-01-31T13:05:17.359Z"
		}
	}
}
```

### Slug

Datasets have an auto-generated and unique slug that allows the user to get, create, update or clone a dataset.
The dataset slug cannot be updated even if the name changes.

### Error Message

When a dataset is created the status is set to “pending” by default. Once the adapter validates the dataset, the status is changed to “saved”. If the validation fails, the status will be set to “failed” and the adapter will also set an error message indicating the reason.

### Filters

Available filters: Any dataset property

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?name=birds&provider=cartodb
```

Inclusive filtering with array props using '@'

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?app=gfw@rw@prep
```

### Sorting

Available sorting: Any dataset property (desc: -)

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-provider,slug
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=slug,-provider,userId&status=saved
```

### Relationships

Available relationships: Any dataset relationship ['widget', 'layer', 'vocabulary', 'metadata']

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=slug,-provider,userId&status=saved&includes=metadata,vocabulary,widget,layer
```

### Advanced filters

By vocabulary-tag matching

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=slug,-provider,userId&status=saved&includes=metadata,vocabulary,widget,layer&vocabulary[legacy]=umd
```

### Pagination

| Field           | Description                | Type
| -------------   |:-------------:| -----:|
| page[size]      | The number elements per page   | Number
| page[number]    | The page number          | Number

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

```json
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

<aside class="success">
Remember — the response is in JSONApi format
</aside>

## Creating a Dataset
To create a dataset, you will need an authorization token. Follow the steps of this [guide](#generate-your-own-oauth-token) to get yours.

To create a dataset, you need to define all of the required fields in the request body. The fields that compose a dataset are:

| Field             | Description                                                   | Type   | Values                                          | Required |
| ------------------|:-------------------------------------------------------------:| ------:| -----------------------------------------------:|  -------:|
| name              | Dataset name                                                  | Text   | Any Text                                        | Yes
| type              | Dataset type                                                  | Text   | Any Text                                        | No
| subtitle          | Dataset subtitle                                              | Text   | Any Text                                        | No
| application       | Applications the dataset belongs to                           | Array  | Any valid application name(s)                   | Yes
| connectorType     | Connector type                                                | Text   | rest, document, wms                             | Yes
| provider          | The connectorType provider                                    | Text   | cartodb, feature service, gee, csv, tsv, xml, json, nexgddp  | Yes
| connectorUrl      | Url of the data source                                        | Url    | Any url                                         | Yes (except for gee, nexgddp and json formats)
| tableName         | Table name                                                    | Text   | Any valid table name                            | No (just for GEE and nexgddp datasets)
| data              | JSON DATA only for json connector if connectorUrl not present | JSON   | [{},{},{}]                                      | No (just for json if connectorUrl is not present)
| dataPath          | Path to the data in a json dataset                            | Text   | Any valid JSON key                              | No (just for json if connectorUrl is not present)
| dataAttributes    | Data fields - for json connector if data present              | Object | {"key1": {"type": "string"},... }               | No (just for json if connectorUrl is not present)
| legend            | Legend for dataset. Keys for special fields                   | Object | "legend": {"long": "123", "lat": "123", "country": ["pais"], "region": ["barrio"], "date": ["startDate", "endDate"]}} | No
| overwrite         | It allows to overwrite dataset data                           | Boolean| true/false                                      | No                                 
| published         | To set a public or private dataset                            | Boolean| true/false                                      | No                                 
| verified          | To generate a verified blockchain of the dataset              | Boolean| true/false                                      | No                                 
| vocabularies      | Cluster of tags                                               | Object | {"vocabularyOne": {"tags": [<tags>]},"vocabularyTwo": {"tags": [<tags>]}} | No
| widgetRelevantProps      | Group of relevant props of a widget					| Array  | Any Text 									   | No
| layerRelevantProps       | Group of relevant props of a layer					    | Array  | Any Text 									   | No
| subscribable      | Available dataset queries             						 | Object | {"<queryName>": "<queryBodyTemplate>"}          | No (just for json if connectorUrl is not present)


There are some differences between datasets types.

### Rest-Carto datasets

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

### Rest-ArcGIS

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

### Rest-GEE

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

### Rest-NEXGDDP

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
The `connectorUrl` must be a valid url that responds to a Web Coverage Service (WCS Core) DescribeCoverage call with a valid XML document.

```shell
curl -H 'Authorization: Bearer <your-token>'  -H 'Content-Type: application/json' -XPOST 'https://api.resourcewatch.org/v1/dataset' -d '{
    "connectorType":"rest",
    "provider":"rasdaman",
    "connectorUrl":"http://54.146.170.2:8080/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=DescribeCoverage&COVERAGEID=nightlights",
    "application":[
     "rw"
    ],
    "name":"nightlights"
}'
```

### Document-CSV, Document-TSV, Document-XML

The `connectorUrl` must be an accessible CSV, TSV or XML file, non-compressed - zip, tar, tar.gz, etc are not supported.

CSV datasets support some optional fields on the creation process. They are:

| Field             | Description                               | Type  | Values | Required |
| -------------     |:-----------------------------------------:| -----:| -----:|  -----:|
| legend            |                                                   | Object|               | No
| -- lat            | Name of column with latitude value                | Text  | Any word      | No
| -- long           | Name of column with longitude value               | text  | Any word      | No
| -- date           | Name of columns with date value (ISO Format)      | Array | Any list word | No
| -- region         | Name of columns with region value (ISO3 code)     | Array | Any list word | No
| -- country        | Name of columns with country value (ISO3 code)    | Array | Any list word | No
z

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "connectorType":"document",
    "provider":"csv",
    "connectorUrl":"<csvUrl>",
    "application":[
     "your", "apps"
    ],
    "legend": {
      "lat": "lat-column",
      "long": "long-column",
      "date": ["date1Column", "date2Column"],
      "region": ["region1Column", "region2Column"],
      "country": ["country1Column", "country2Column"]
    },
    "name":"Example CSV Dataset"
}'
```

> Real example:

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
<aside class="notice">
	This is an authenticated endpoint!
</aside>

### Document-JSON

The JSON dataset service supports data from external json file or data as json array send in request body.

The `connectorUrl` must be an accessible JSON file

JSON datasets support some optional fields in the creation process. They are:

| Field             | Description                               | Type  | Values | Required |
| ---------------   |:-----------------------------------------:| -----:| -----:|  -----:|
| data              | JSON DATA only for json connector if connectorUrl not present | Array | [{},{},{}]    | Yes for json if connectorUrl not present
| legend            |                                                               | Object|               | No
| -- lat            | Name of column with latitude value                            | Text  | Any word      | No
| -- long           | Name of column with longitude value                           | text  | Any word      | No
| -- date           | Name of columns with date value (ISO Format)                  | Array | Any list word | No
| -- region         | Name of columns with region value (ISO3 code)                 | Array | Any list word | No
| -- country        | Name of columns with country value (ISO3 code)                | Array | Any list word | No

<aside class="notice">
	This is an authenticated endpoint!
</aside>

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "connectorType":"document",
    "provider":"json",
    "connectorUrl":"<jsonURL>",
    "application":[
     "your", "apps"
    ],
    "legend": {
      "lat": "lat-column",
      "long": "long-column",
      "date": ["date1Column", "date2Column"],
      "region": ["region1Column", "region2Column"],
      "country": ["country1Column", "country2Column"]
    },
    "name":"Example JSON Dataset",
}'
```

Or it is also possible to create a JSON dataset setting the data directly in the request:

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

## Uploading a Dataset (Binary)
You can upload your raw data directly to S3 making use of the "upload" endpoint.
This endpoint accepts a file in the property "dataset" and returns a valid
connectorUrl. With this connectorUrl you can create or update a "document" dataset.

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/upload \
-H "Authorization: Bearer <your-token>" \
-F "dataset=@<your-file>"
```

It returns the following:

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

In order to modify the dataset, you can PATCH a request.
It accepts the same parameters as the _create dataset_ endpoint, and you will need an authentication token.

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

## Deleting a Dataset

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

## Concatenate Data
You can add more data to a dataset only if the overwrite dataset property has been set to true.

> Concatenate data using external data source:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/concat \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
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
   "data": [{},{}]
}'
```

<aside class="notice">
	This is an authenticated endpoint!
</aside>

## Overwrite Data
You can overwrite the data if the overwrite dataset property has been set to true.

> Overwrite data using external data source:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/data-overwrite \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
   "connectorUrl":"<url>",
   "dataPath": "data"
}'
```

> Overwrite data using JSON array in post body:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/data-overwrite \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
   "data": [{},{}]
}'
```

<aside class="notice">
	This is an authenticated endpoint!
</aside>


## Overwrite specific Data
You can overwrite specific data if the overwrite dataset property has been set to true.

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:dataset_id/data/:data_id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
   "data_id":":data_id",
   "data": {"a": 1}
}'
```

<aside class="notice">
	This is an authenticated endpoint!
</aside>

## Delete specific Data
You can delete specific data if the overwrite dataset property has been set to true.

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/:dataset_id/data/:data_id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

<aside class="notice">
	This is an authenticated endpoint!
</aside>

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
