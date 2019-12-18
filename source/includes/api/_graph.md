# Graph

The following graph endpoints are available

## List concepts

Returns a list including all the concepts present in the graph

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts
```

### Query example

```json
{
  "data": [
    {
      "id": "europe",
      "label": "Europe",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ],
      "numberOfDatasetsTagged": 0
    },
    {
      "id": "damage",
      "label": "Damage",
      "synonyms": [
        "destruction"
      ],
      "labels": [
        "CONCEPT",
        "TOPIC"
      ],
      "numberOfDatasetsTagged": 2
    },
    {
      "id": "guernsey",
      "label": "Guernsey",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ],
      "numberOfDatasetsTagged": 0
    }
  ]
}
```

## Get inferred concepts

This endpoint returns the set of concepts that are inferred from the set passed as a parameter

### Parameters

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
concepts         |           List of concepts            |    Text |                                        Any Text, values separated by commas |      Yes


```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/concepts-inferred?concepts=<concept_list>
```

### Example

Concepts inferred from the set: ['spain', 'raster']

```url
https://api.resourcewatch.org/v1/graph/query/concepts-inferred?concepts=spain,raster
```

```json
{
  "data": [
    {
      "id": "location",
      "label": "Location",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "TOPIC"
      ]
    },
    {
      "id": "eu",
      "label": "EU",
      "synonyms": [
        "European Union"
      ],
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "raster",
      "label": "Raster",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "DATA_TYPE"
      ]
    },
    {
      "id": "oecd",
      "label": "OECD",
      "synonyms": [
        "Organisation for Economic Co-operation and Development"
      ],
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "schengen_area",
      "label": "Schengen Area",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "country",
      "label": "Country",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "continent",
      "label": "Continent",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "global",
      "label": "Global",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "general",
      "label": "General",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "TOPIC"
      ]
    },
    {
      "id": "spain",
      "label": "Spain",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "dataset",
      "label": "Dataset",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "DATA_TYPE"
      ]
    },
    {
      "id": "europe",
      "label": "Europe",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    }
  ]
}
```

## Concepts' ancestors

This endpoint returns the ancestors from the list of concepts provided

### Parameters

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
concepts         |           List of concepts            |    Text |                                        Any Text, values separated by commas |      Yes

```shell
https://api.resourcewatch.org/v1/graph/query/concepts-ancestors?concepts=<concept_list>
```

### Example

Ancestors of the concepts from the set: ['forest_cover', 'landslide']

```url
https://api.resourcewatch.org/v1/graph/query/concepts-ancestors?concepts=forest_cover,landslide
```

```json
{
  "data": [
    {
      "id": "indicator",
      "label": "Indicator",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "TOPIC"
      ]
    },
    {
      "id": "forest",
      "label": "Forest",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "TOPIC"
      ]
    },
    {
      "id": "natural_disaster",
      "label": "Natural disaster",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "TOPIC"
      ]
    },
    {
      "id": "natural_phenomena",
      "label": "Natural phenomena",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "TOPIC"
      ]
    }
  ]
}
```

## Similar datasets

Returns a set of datasets that are similar to the dataset provider sorted by their degree of similarity.

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset/<dataset-id>
```

### Parameters available

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
published         |   Include only published datasets            |    Boolean |                                        true/false |      No
app  |   List of applications datasets should belong to (at least one of them)      |    Text |     Any text, values separated by commas |       No
env  |   Include only datasets with at least one of the specified environments | Text | One or more values from ['production', 'preproduction'] |       No
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
app  |   List of applications datasets should belong to (at least one of them)      |    Text |     Any text, values separated by commas |       No
env  |   Include only datasets with at least one of the specified environments | Text | One or more values from ['production', 'preproduction'] |       No
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
app  |   List of applications datasets should belong to (at least one of them)      |    Text |     Any text, values separated by commas |       No
env  |   Include only datasets with at least one of the specified environments | Text | One or more values from ['production', 'preproduction'] |       No
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

