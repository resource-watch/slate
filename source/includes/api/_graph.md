# Graph

The following graph endpoints are available

## Similar datasets

Returns a set of datasets that are similar to the dataset provider sorted by their degree of similarity.

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset/<dataset-id>
```

### Parameters available

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
published         |   Include only published datasets            |    Boolean |                                        true/false |      No
app  |   List of applications datasets should belong to (at least one of them). Read more about this field [here](/index-rw.html#applications). |    Text |     Any text, values separated by commas |       No
env  |   Include only datasets with at least one of the specified environments - read more about this field in the [Environments concept section](/index-rw.html#environments). | Text | One or more values from ['production', 'preproduction'] |       No
limit | Maximum number of datasets returned by the endpoint | Integer | A positive integer (3 by default) | No

### Example

Datasets that are similar to the dataset with id `63a7a997-695d-4629-b6e9-9b169f5c69b` including only those that are **published** with a **limit of 6 results** in total, datasets from both `production` and `preproduction` environments are included.

```url
https://api.resourcewatch.org/v1/graph/query/similar-dataset/63a7a997-695d-4629-b6e9-9b169f5c69bf?published=true&env=production,preproduction&app=rw&limit=6
```

```json
{
  "data": [
    {
      "dataset": "0a59f415-ee0b-4d19-96f7-c7304c152e1b",
      "concepts": [
        "global",
        "raster",
        "geospatial"
      ]
    },
    {
      "dataset": "0087944f-871c-44bc-b4d9-cd5acfc27023",
      "concepts": [
        "global",
        "raster",
        "geospatial"
      ]
    },
    {
      "dataset": "0303127a-70b0-4164-9251-d8162615d058",
      "concepts": [
        "raster",
        "geospatial"
      ]
    },
    {
      "dataset": "05b7c688-09ba-4f33-90ea-185a1039df43",
      "concepts": [
        "global",
        "geospatial"
      ]
    },
    {
      "dataset": "050f4146-566c-4a6d-9aaa-b49ab66a3090",
      "concepts": [
        "global",
        "geospatial"
      ]
    },
    {
      "dataset": "00abb46f-34e2-4bf7-be30-1fb0b1de022f",
      "concepts": [
        "global",
        "geospatial"
      ]
    }
  ]
}
```

## Similar datasets including ancestors

Returns a set of datasets that are similar to the dataset provider sorted by their degree of similarity as well as taking into account ancestor concepts.

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset-including-descendent/<dataset-id>
```

### Parameters available

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
published         |   Include only published datasets            |    Boolean |                                        true/false |      No
app  |   List of applications datasets should belong to (at least one of them). Read more about this field [here](/index-rw.html#applications). |    Text |     Any text, values separated by commas |       No
env  |   Include only datasets with at least one of the specified environments - read more about this field in the [Environments concept section](/index-rw.html#environments). | Text | One or more values from ['production', 'preproduction'] |       No
limit | Maximum number of datasets returned by the endpoint | Integer | A positive integer (3 by default) | No

### Example

Datasets that are similar to the dataset with id `03bfb30e-829f-4299-bab9-b2be1b66b5d4` including only those that are **published** with a **limit of 6 results** in total, datasets from both `production` and `preproduction` environments are included.

```url
https://api.resourcewatch.org/v1/graph/query/similar-dataset-including-descendent/03bfb30e-829f-4299-bab9-b2be1b66b5d4?published=true&env=production,preproduction&app=rw&limit=6
```

```json
{
  "data": [
    {
      "dataset": "05b7c688-09ba-4f33-90ea-185a1039df43",
      "concepts": [
        "country",
        "forest",
        "geospatial",
        "table"
      ],
      "numberOfOcurrences": 1
    },
    {
      "dataset": "0448c79d-0ee0-42ff-9331-aeee70cef301",
      "concepts": [
        "forest_cover",
        "forest_gain",
        "forest_loss",
        "geospatial"
      ],
      "numberOfOcurrences": 1
    },
    {
      "dataset": "098b33df-6871-4e53-a5ff-b56a7d989f9a",
      "concepts": [
        "country",
        "geospatial"
      ],
      "numberOfOcurrences": 1
    },
    {
      "dataset": "0be2ce12-79b3-434b-b557-d6ea92d787fe",
      "concepts": [
        "geospatial",
        "table"
      ],
      "numberOfOcurrences": 1
    },
    {
      "dataset": "050f4146-566c-4a6d-9aaa-b49ab66a3090",
      "concepts": [
        "geospatial",
        "table"
      ],
      "numberOfOcurrences": 1
    },
    {
      "dataset": "00abb46f-34e2-4bf7-be30-1fb0b1de022f",
      "concepts": [
        "geospatial",
        "table"
      ],
      "numberOfOcurrences": 1
    }
  ]
}
```

## Search datasets by concepts

This endpoint performs a dataset search based on the concepts provided and the tags that have been associated to all the different datasets that are part of the
application. Ancestors of the tags directly associated to a datasets are taken into account in the search.

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/search-datasets?concepts[0][0]='water'
```

Up to three sets of concepts can be provided as shown in the example below.
Given the following sets of concepts:

- Set 1: `['spain', 'europe']`
- Set 2: `['water']`
- Set 3: `['raster', 'geospatial']`

The url should be formed as follows:

`https://api.resourcewatch.org/v1/graph/query/search-datasets?concepts[0][0]=spain,concepts[0][1]=europe,concepts[1][0]=water,concepts[2][0]=raster,concepts[2][1]=geospatial`

**AND** logical operators are applied among the sets while **OR** is used for set elements.

### Parameters available

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
published         |   Include only published datasets            |    Boolean |                                        true/false |      No
app  |   List of applications datasets should belong to (at least one of them). Read more about this field [here](/index-rw.html#applications). |    Text |     Any text, values separated by commas |       No
env  |   Include only datasets with at least one of the specified environments - read more about this field in the [Environments concept section](/index-rw.html#environments). | Text | One or more values from ['production', 'preproduction'] |       No
page[size] | Maximum number of results returned by the endpoint | Number | No

### Example

Search for datasets with the tag `global` and `water` and at least one of the two tags: `raster`, `geospatial`. The resulting datasets should also be published and be categorized either as `production` or `preproduction` and belong to the application `rw`. The total number of results returned won't be limited since a very high number has been provided as limit _(999999)_.

`https://api.resourcewatch.org/v1/graph/query/search-datasets?concepts[0][0]=global&concepts[1][0]=water&concepts[2][0]=raster&concepts[2][1]=geospatial&published=true&env=production,preproduction&app=rw&page[size]=999999`

```json
{
  "data": [
    "11f43558-d703-4b9d-aff0-f2354a11b359",
    "1b97e47e-ca18-4e50-9aae-a2853acca3f0",
    "20c70a51-4ddf-4f6c-ad2c-1a6729b95fa4",
    "21ac3cd2-9c19-47c7-ad18-4bcad118870f",
    "33bed1fb-9261-41bf-8b50-127a4d0c80c5",
    "3624554e-b240-4edb-9110-1f010642c3f3",
    "36803484-c413-49a9-abe2-2286ee99b624",
    "371e700e-bc9a-4526-af92-335d888de309",
    "60be01b0-99fb-459c-8a08-b934270f8c4b",
    "63a7a997-695d-4629-b6e9-9b169f5c69bf",
    "894f43a8-ce8e-43a5-a4c7-fa80faa43d63",
    "99075509-df36-461e-abb0-659cee555bd0",
    "9e9a5c50-b825-4f12-838f-1650943c2be1",
    "c17fab24-f71a-4c3e-bb87-6b753a944e6b",
    "c9eadefd-4a06-4f3b-a2eb-3e3f45624c24",
    "d7c3d954-ac86-4d1a-bb6a-c8c432a94e26",
    "e63bb157-4b98-4ecb-81d6-c1b15e79895a",
    "e7582657-9c16-4eb1-89e8-0211d94015c6",
    "e94f0e2d-2b5f-41ed-967f-d97e54dd81ea",
    "ede84747-0116-45c2-accb-1dfe141c00ff",
    "f717ac77-6f06-493f-8336-4e660a18f74c",
    "fa6443ff-eb95-4d0f-84d2-f0c91682efdf"
  ]
}
```

## Get most liked datasets

This endpoint returns the list of the most liked datasets in descending order.

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-liked-datasets
```

> Response:

```json
{
	"data": [
		{
			"id": "e2971008-029f-441b-97cd-ee0555728182",
			"count": {
				"low": 2,
				"high": 0
			}
		},
		{
			"id": "f6bb99af-541a-4d41-9e47-cc36cb479d4b",
			"count": {
				"low": 2,
				"high": 0
			}
		},
		{
			"id": "223b936e-06b8-4970-abd9-4f123904d95d",
			"count": {
				"low": 2,
				"high": 0
			}
		},
		{
			"id": "0b9f0100-ce5b-430f-ad8f-3363efa05481",
			"count": {
				"low": 2,
				"high": 0
			}
		}
	]
}
```

## Get most viewed datasets list

This endpoint returns the list of the most viewed datasets in descending order of total views.

### Parameters

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
limit         |           Maximum number of results            |    Number |                                        Any positive number |      No

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-viewed
```

> Response:

```json
{
  "data": [
    {
      "dataset": "0087944f-871c-44bc-b4d9-cd5acfc27023",
      "views": 172
    },
    {
      "dataset": "00abb46f-34e2-4bf7-be30-1fb0b1de022f",
      "views": 68
    },
    {
      "dataset": "01b0b8cf-6638-4a9b-9896-d919d0656a64",
      "views": 5
    },
    {
      "dataset": "01ae2fd7-b818-429f-a27e-a36c8def971a",
      "views": 2
    },
    {
      "dataset": "00b5c224-8a78-41c4-89a6-8299dec8609e",
      "views": 0
    }
  ]
}
```

## Update view counter for dataset and user

Updates the total view counter for the corresponding dataset. If the request is authenticated, it will also increment the counter of number of times the user has viewed the dataset. 

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/dataset/<dataset-id>/visited
-H "Authorization: Bearer <your-token>"
```









## List graph concepts

> Request to list graph concepts:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts
```

> Example response:

```json
{
    "data": [
        {
            "id": "society",
            "label": "Society",
            "synonyms": ["People"],
            "labels": ["CONCEPT", "TOPIC"],
            "numberOfDatasetsTagged": 1,
            "datasets": ["4458eb12-8572-45d1-bf07-d5a3ee097021"]
        },
    ]
}
```

This endpoint returns the list of concepts available in the graph. If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the information about one graph concept. Check out the [Graph concept reference](#graph-concept-reference) for details on each of the fields of the returned response.

Please keep in mind this endpoint **does not return a paginated list** - instead, it returns all the concepts available in the graph, no matter how many they are. You should avoid using this specific endpoint since it might harm the performance of your application, should the graph increase significantly in size.

## List graph concepts for a dataset

> Request to list graph concepts for a dataset:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts/:dataset
```

> Example response:

```json
{
    "data": [
        {
            "id": "4458eb12-8572-45d1-bf07-d5a3ee097021",
            "type": "graph",
            "attributes": {
                "iso": "",
                "synonyms": ["Habitat"],
                "id": "habitat",
                "label": "Habitats",
                "default_parent": "ecosystem"
            }
        },
        {
            "id": "4458eb12-8572-45d1-bf07-d5a3ee097021",
            "type": "graph",
            "attributes": {
                "iso": "",
                "synonyms": "",
                "id": "species",
                "label": "Species",
                "default_parent": "biodiversity"
            }
        }
    ]
}
```

This endpoint returns the list of relationships between the dataset with id provided in the URL path and graph concepts. If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the information about one graph relationship. Check out the [Graph relationship reference](#graph-relationship-reference) for details on each of the fields of the returned response.

If the dataset id provided is not valid or not found, the response returned with contain an empty list in the `data` index.

## List graph concepts for multiple datasets

> Request to list graph concepts for multiple datasets:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/find-by-ids \
-H "Content-Type: application/json" \
-d \
'{
    "ids": [
        "37d04efc-0ab2-4499-a891-54dca1013c74",
        "0448c79d-0ee0-42ff-9331-aeee70cef301"
    ]
}'
```

> Example response:

```json
{
    "data": [
        {
            "type": "concept",
            "attributes": {
                "dataset": "37d04efc-0ab2-4499-a891-54dca1013c74",
                "iso": "",
                "synonyms": "",
                "id": "sanitation",
                "label": "Sanitation",
                "default_parent": "health"
            }
        },
        {
            "type": "concept",
            "attributes": {
                "dataset": "37d04efc-0ab2-4499-a891-54dca1013c74",
                "iso": "",
                "synonyms": ["city", "urban"],
                "id": "urban",
                "label": "Cities",
                "default_parent": "settlements"
            }
        }
    ]
}
```

This endpoint returns the list of relationships between the datasets with ids provided in the body of the POST request. If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the information about one graph relationship. Check out the [Graph relationship reference](#graph-relationship-reference) for details on each of the fields of the returned response.

### Errors for listing concepts for multiple datasets

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Bad Request   | The `ids` provided in the body of the request are not correctly formatted.

## Infer concepts from other concepts

> GET request to infer concepts related with the concepts passed as query parameters:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/concepts-inferred?concepts=society,urban \
-H "Content-Type: application/json"
```

> POST request to infer concepts related with the concepts passed in the request body:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/query/concepts-inferred \
-H "Content-Type: application/json" \
-d \
'{ "concepts": ["society", "urban"] }'
```

> Example response:

```json
{
    "data": [
        {
            "id": "society",
            "label": "Society",
            "synonyms": ["People"],
            "labels": ["CONCEPT", "TOPIC"]
        },
        {
            "id": "urban",
            "label": "Cities",
            "synonyms": ["city", "urban"],
            "labels": ["CONCEPT", "TOPIC"]
        },
    ]
}
```

This endpoint lets API users discover concepts which have relationships in common with the list of concepts provided. You can use the GET version of the endpoint, providing the list of concepts as a comma-separated string query string parameter. Alternatively, you can use the POST version and provide the list of concepts in the `concepts` index of the POST request body.

If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the information about one graph concept. Check out the [Graph concept reference](#graph-concept-reference) for details on each of the fields of the returned response.

### Errors for listing concepts for multiple datasets

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Concepts are required. | A list of concepts was not provided.

<!-- ## Get ancestor concepts -- TODO: endpoint not working!!

> GET request to get ancestor concepts for the concepts passed as query parameters:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/concepts-ancestors?concepts=society,urban \
-H "Content-Type: application/json"
```

> POST request to get ancestor concepts for the concepts passed in the request body:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/query/concepts-ancestors \
-H "Content-Type: application/json" \
-d \
'{ "concepts": ["society", "urban"] }'
```

> Example response:

```json
{
    "data": [
        {
            "id": "society",
            "label": "Society",
            "synonyms": ["People"],
            "labels": ["CONCEPT", "TOPIC"]
        },
        {
            "id": "urban",
            "label": "Cities",
            "synonyms": ["city", "urban"],
            "labels": ["CONCEPT", "TOPIC"]
        },
    ]
}
```

This endpoint lets API users discover concepts which have relationships in common with the list of concepts provided. You can use the GET version of the endpoint, providing the list of concepts as a comma-separated string query string parameter. Alternatively, you can use the POST version and provide the list of concepts in the `concepts` index of the POST request body.

If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the information about one graph concept. Check out the [Graph concept reference](#graph-concept-reference) for details on each of the fields of the returned response.

### Errors for listing concepts for multiple datasets

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Concepts are required. | A list of concepts was not provided. -->

## Other endpoints

router.get('/query/similar-dataset', GraphRouter.querySimilarDatasets);
router.get('/query/similar-dataset-including-descendent', GraphRouter.querySimilarDatasetsIncludingDescendent);
router.get('/query/similar-dataset/:dataset', GraphRouter.querySimilarDatasets);
router.get('/query/similar-dataset-including-descendent/:dataset', GraphRouter.querySimilarDatasetsIncludingDescendent);
router.get('/query/search-datasets', GraphRouter.querySearchDatasets);
router.get('/query/search-datasets-ids', GraphRouter.querySearchDatasetsIds);
router.get('/query/most-liked-datasets', GraphRouter.mostLikedDatasets);
router.post('/query/search-datasets', GraphRouter.querySearchDatasets);
router.get('/query/most-viewed', GraphRouter.queryMostViewed);
router.get('/query/most-viewed-by-user', GraphRouter.queryMostViewedByUser);
router.get('/query/search-by-label-synonyms', GraphRouter.querySearchByLabelSynonymons);

router.post('/dataset/:id', isAuthorized, GraphRouter.createDataset);
router.post('/dataset/:id/visited', GraphRouter.visitedDataset);
router.post('/widget/:idDataset/:idWidget', isAuthorized, checkExistsDataset, GraphRouter.createWidgetNodeAndRelation);
router.post('/layer/:idDataset/:idLayer', isAuthorized, checkExistsDataset, GraphRouter.createLayerNodeAndRelation);
router.post('/metadata/:resourceType/:idResource/:idMetadata', isAuthorized, checkExistsResource, GraphRouter.createMetadataNodeAndRelation);
router.post('/:resourceType/:idResource/associate', isAuthorized, checkExistsResource, GraphRouter.associateResource);
router.put('/:resourceType/:idResource/associate', isAuthorized, checkExistsResource, GraphRouter.updateResource);
router.delete('/:resourceType/:idResource/associate', isAuthorized, checkExistsResource, GraphRouter.disassociateResource);
router.post('/favourite/:resourceType/:idResource/:userId', isAuthorized, checkExistsResource, GraphRouter.createFavouriteRelationWithResource);

router.delete('/favourite/:resourceType/:idResource/:userId', isAuthorized, checkExistsResource, GraphRouter.deleteFavouriteRelationWithResource);
router.delete('/dataset/:id', isAuthorized, GraphRouter.deleteDataset);
router.delete('/widget/:id', isAuthorized, GraphRouter.deleteWidgetNodeAndRelation);
router.delete('/layer/:id', isAuthorized, GraphRouter.deleteLayerNodeAndRelation);
router.delete('/metadata/:id', isAuthorized, GraphRouter.deleteMetadata);

## Graph concept reference

> Example concept entity structure:

```json
{
  "id": "society",
  "label": "Society",
  "synonyms": ["People"],
  "labels": ["CONCEPT", "TOPIC"],
  "numberOfDatasetsTagged": 1,
  "datasets": ["4458eb12-8572-45d1-bf07-d5a3ee097021"]
}
```

This section describes the attributes that are present on a graph concept entity:

Field name               | Type           | Description                                                                  
------------------------ | -------------- | ---------------------------------------------------------------------------- 
`id`                     | String         | The concept unique identifier.
`label`                  | String         | A readable version of the concept identifier.
`synonyms`               | String | Array | The list of synonyms for this concept (or an empty string, if no synonyms exist).
`labels`                 | Array          | The list of identifiers for the type of this graph node.
`numberOfDatasetsTagged` | Number         | The number of datasets that are currently tagged with this concept.
`datasets`               | Array          | The list of dataset ids that are currently tagged with this concept.

## Graph relationship reference

> Example relationship entity structure:

```json
{
  "id": "4458eb12-8572-45d1-bf07-d5a3ee097021",
  "type": "graph",
  "attributes": {
    "iso": "",
    "synonyms": ["Habitat"],
    "id": "habitat",
    "label": "Habitats",
    "default_parent": "ecosystem"
  }
}
```

This section describes the attributes that are present on a graph relationship entity:

Field name                  | Type           | Description                                                                  
--------------------------- | -------------- | ---------------------------------------------------------------------------- 
`id`                        | String         | The id of the relationship (usually the dataset id, if finding concepts related to a dataset).
`type`                      | String         | Always set to "graph".
`attributes.iso`            | String         | TODO: ???
`attributes.synonyms`       | Array          | A list of synonyms for this concept.
`attributes.id`             | String         | The concept unique identifier.
`attributes.id`             | String         | The concept unique identifier.
`attributes.label`          | String         | A readable version of the concept identifier.
`attributes.default_parent` | String         | The id of the parent concept, if existing. (TODO: explain hierarchy)
