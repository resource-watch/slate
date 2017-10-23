# Graph

The following graph endpoints are available

## List concepts

Returns a list including all the concepts present in the graph

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts
```

### Query example

```
{
  "data": [
    {
      "id": "azerbaijan",
      "label": "Azerbaijan",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "bahamas",
      "label": "Bahamas",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
    },
    {
      "id": "bahrain",
      "label": "Bahrain",
      "synonyms": "",
      "labels": [
        "CONCEPT",
        "GEOGRAPHY"
      ]
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

```
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

```
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

```
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
