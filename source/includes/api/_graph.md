# Graph

The following section details the endpoints you can use to interact with graph information about the RW API. If you are new to the RW API or want to learn more about what the RW API graph can do for you, we strongly encourage you to read the [graph concept](#graph) documentation first.

Before proceeding, let's look at some concepts that will be used across the graph endpoint documentation.

## What is a resource

Throughout this section, we'll refer multiple times to `resources`. Simply put, a `resource` is either a dataset, a widget, a layer, or a metadata entry. Graph nodes represent in a similar fashion these 4 types of RW API entity, so often we'll refer to resources instead, for convenience.

We assume that, at this point, you are already familiar with the concepts of [dataset](#dataset), [layer](#layer), [widget](#widget) or [metadata](#metadata) (ideally you are familiar with the 4). If that's not the case, we strongly encourage you to learn about those concepts first, and we also recommend you take some time to explore and experiment using actual [dataset](#dataset6), [layer](#layer8), [widget](#widget9), or [metadata](#metadata12) endpoints before proceeding. The RW API Graph service builds on top of these concepts and empowers your use cases of those resources, so it should only be used by applications and users that are already comfortable with the basics, and want to take their knowledge of the RW API to the next level.

In the context of the RW API Graph service, resources are represented as graph nodes. They can be associated (using graph edges) with concepts to create relationships of relevance between the two entities.

## What is a concept

Similarly, we'll refer multiple times to `concepts`. A `concept` is a keyword used to describe a resource (e.g. `health`, `society`, `solar_power`, etc.). It shares some similarities with [tags](#vocabularies-and-tags), in the sense it can be associated with resources of different types (datasets, layers, or widgets).

As with resources, in the context of the RW API Graph service, concepts are represented as graph nodes. They can be associated (using graph edges) with resources to create relationships of relevance between the two entities.

## List concepts

> Request to list concepts:

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

This endpoint returns the list of concepts available in the graph. If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the information about one concept. Check out the [Graph concept reference](#graph-concept-reference) for details on each of the fields of the returned response.

Please keep in mind this endpoint **does not return a paginated list** - instead, it returns all the concepts available in the graph, no matter how many they are. You should avoid using this specific endpoint since it might harm the performance of your application, should the graph increase significantly in size.

### Filters

> Filtering concepts by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

## List concepts for a dataset

> Request to list concepts for a dataset:

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

This endpoint returns the list of relationships between the dataset with id provided in the URL path and concepts. If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the information about one graph relationship. Check out the [Graph relationship reference](#graph-relationship-reference) for details on each of the fields of the returned response.

If the dataset id provided is not valid or not found, the response returned will contain an empty list in the `data` index.

### Filters

> Filtering concepts for a dataset by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts/:dataset?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

## List concepts for multiple datasets

> Request to list concepts for multiple datasets:

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

### Filters

> Filtering concepts for multiple datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/find-by-ids?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

### Errors for listing concepts for multiple datasets

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Bad Request   | The `ids` provided in the body of the request are not correctly formatted.

## Infer concepts from other concepts

> GET request to infer concepts related to the concepts passed as query parameters:

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

This endpoint lets API users discover concepts that have relationships in common with the list of concepts provided. You can use the GET version of the endpoint, providing the list of concepts as a comma-separated string query string parameter. Alternatively, you can use the POST version and provide the list of concepts in the `concepts` index of the POST request body.

If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the information about one concept. Check out the [Graph concept reference](#graph-concept-reference) for details on each of the fields of the returned response.

### Filters

> Filtering inferred concepts by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/concepts-inferred?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

### Errors for listing concepts for multiple datasets

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Concepts are required. | A list of concepts was not provided.

## Query similar datasets

> GET request to find out similar datasets to a dataset with id provided:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset/:dataset \
-H "Content-Type: application/json"
```

> Alternative syntax, providing the dataset id as query string parameter:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset?dataset=:dataset \
-H "Content-Type: application/json"
```

> Example response:

```json
{
  "data": [
    {
      "dataset": "1b97e47e-ca18-4e50-9aae-a2853acca3f0",
      "concepts": ["health", "urban"]
    },
    {
      "dataset": "51159bdb-4904-4101-a88e-ca7bd4f67cb0",
      "concepts": ["infrastructure"]
    }
  ]
}
```

This endpoint lets API users discover datasets that share concepts with the dataset with id provided in the URL path. If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the id of the dataset that is related and a list of concepts that are shared.

The results returned are sorted by their degree of similarity, meaning the datasets with the higher number of shared concepts are higher on the list.

### Filters

> Filtering similar datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset/:dataset?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

### Errors for querying similar datasets

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Dataset query param required | You must provide a valid dataset id.

## Query similar datasets including descendants

> GET request to find out similar datasets including descendants to a dataset with id provided:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset-including-descendant/:dataset \
-H "Content-Type: application/json"
```

> Alternative syntax, providing the dataset id as query string parameter:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset-including-descendant?dataset=:dataset \
-H "Content-Type: application/json"
```

> Example response:

```json
{
  "data": [
    {
      "dataset": "37d04efc-0ab2-4499-a891-54dca1013c74",
      "concepts": ["urban", "health", "sanitation"],
      "numberOfOcurrences": 1
    },
    {
      "dataset": "223b936e-06b8-4970-abd9-4f123904d95d",
      "concepts": [
          "hunger",
          "famine",
          "health"
      ],
      "numberOfOcurrences": 1
    }
  ]
}
```

This endpoint lets API users discover datasets that share concepts with the dataset with id provided in the URL path. The difference from the endpoint above is that this endpoint also looks at the ancestor concepts from the dataset with id provided - datasets returned might have ancestor concepts in common, but not necessarily the same exact concepts in common.

If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the id of the dataset that is related and a list of concepts that are shared. Each list item also contains a `numberOfOcurrences` field, containing the count of common concepts. The results returned are sorted by their degree of similarity, meaning the datasets with the higher number of shared concepts (`numberOfOcurrences`) are higher on the list.

### Filters

> Filtering similar datasets including descendants by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset-including-descendant/:dataset?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

### Errors for querying similar datasets

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Dataset query param required | You must provide a valid dataset id.

## Search datasets by concepts

> GET request to search datasets by concepts:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/search-datasets?concepts[0][0]=:concept \
-H "Content-Type: application/json"
```

> POST request to search datasets by concepts provided in the request body:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/query/search-datasets \
-H "Content-Type: application/json" \
-d '{ "concepts": [[":concept"]] }'
```

> Providing multiple sets of concepts as GET request:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/search-datasets?concepts[0][0]=spain,concepts[0][1]=europe,concepts[1][0]=water,concepts[2][0]=raster,concepts[2][1]=geospatial \
-H "Content-Type: application/json"
```

> Providing multiple sets of concepts as POST request:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/search-datasets \
-H "Content-Type: application/json" \
-d '{ 
  "concepts": [
    ["spain", "europe"],
    ["water"],
    ["raster", "geospatial"]
  ] 
}'
```

> Example response:

```json
{
  "data": [
    "11f43558-d703-4b9d-aff0-f2354a11b359",
    "12510410-1eb3-4af0-844f-8a05be50b1c1",
    "1b8f1592-2a92-4dd5-bd85-6d231c7d3229",
    "1b97e47e-ca18-4e50-9aae-a2853acca3f0",
    "371e700e-bc9a-4526-af92-335d888de309",
    "4b000ded-5f4d-4dbd-83c9-03f2dfcd36db",
    "5be16fea-5b1a-4daf-a9e9-9dc1f6ea6d4e",
    "60be01b0-99fb-459c-8a08-b934270f8c4b",
    "63a7a997-695d-4629-b6e9-9b169f5c69bf",
    "795a7ceb-ebc1-4479-95ad-76ea4d045ad3"
  ]
}
```

This endpoint lets API users discover datasets related to the lists of concepts provided. Note that, either in the GET or POST forms for this endpoint, **concepts must be provided as a list of sets**. *AND* logical operators (`&&`) are applied among the list of sets, while *OR* (`||`) is used for set elements. You can provide up to three sets of concepts to search for - the example on the side exemplifies a request to this endpoint given the following sets of concepts:

- Set 1: `['spain', 'europe']`
- Set 2: `['water']`
- Set 3: `['raster', 'geospatial']`

In this specific case, the datasets returned would be related with `"spain"` OR `"europe"`, `"water"`, and `"raster"` or `"geospatial"`. Or, expressed as a logical condition: `("spain" || "europe") && "water" && ("raster" || "geospatial")`.

If successful, the response will have status 200 OK, containing a list of dataset ids that are related to the concepts provided in the `data` index. Also, note that ancestor concepts are also taken into account in the search.

### Filters

> Filtering searched datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset-including-descendant/:dataset?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated with this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`
depth        | Limits the depth of the graph search. | Number | 15

### Errors for searching datasets by concepts

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Concepts query params are required | You must provide the list of sets of concepts.

## Search datasets by concepts and their synonyms

> GET request to search datasets by concepts and their synonyms:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/search-by-label-synonyms?search=:search \
-H "Content-Type: application/json"
```

> Example providing multiple concepts in one request:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/search-by-label-synonyms?search=health society \
-H "Content-Type: application/json"
```

> Example response:

```json
{
  "data": [
    "11f43558-d703-4b9d-aff0-f2354a11b359",
    "12510410-1eb3-4af0-844f-8a05be50b1c1",
    "1b8f1592-2a92-4dd5-bd85-6d231c7d3229",
    "1b97e47e-ca18-4e50-9aae-a2853acca3f0",
    "371e700e-bc9a-4526-af92-335d888de309",
    "4b000ded-5f4d-4dbd-83c9-03f2dfcd36db",
    "5be16fea-5b1a-4daf-a9e9-9dc1f6ea6d4e",
    "60be01b0-99fb-459c-8a08-b934270f8c4b",
    "63a7a997-695d-4629-b6e9-9b169f5c69bf",
    "795a7ceb-ebc1-4479-95ad-76ea4d045ad3"
  ]
}
```

This endpoint finds datasets in the graph that are related to the concepts provided or any of its synonyms. If successful, the response will have status 200 OK, containing a list of dataset ids in the `data` index. You can provide multiple concepts by splitting them with blank spaces.

### Filters

> Filtering searched datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/search-by-label-synonyms?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

### Errors for searching datasets by concepts and their synonyms

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Search query param required | You must provide the search query parameter.

## Most liked datasets

> GET request to find out which are the most liked datasets:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-liked-datasets \
-H "Content-Type: application/json"
```

> Example response:

```json
{
  "data": [
    {
      "id": "c36c3108-2581-4b68-852a-c929fc758001",
      "count": {
        "low": 6,
        "high": 0
      }
    },
    {
      "id": "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76",
      "count": {
        "low": 5,
        "high": 0
      }
    }
  ]
}
```

This endpoint returns a list of dataset sorted by the number of times these datasets were marked as favorite by users. The returned list is sorted descending, from the datasets with higher favorite count to the ones with a lower count.

If successful, this endpoint will return 200 OK, containing the list of sorted datasets in the `data` index of the response body. Each element of the list contains the dataset id in the `id` property and the number of times the dataset was marked as favorite by a user in the `count.low` property.

### Filters

> Filtering most liked datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-liked-datasets?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

## Most viewed datasets

> GET request to find out which are the most viewed datasets:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-viewed \
-H "Content-Type: application/json"
```

> Example response:

```json
{
  "data": [
    {
      "dataset": "0087944f-871c-44bc-b4d9-cd5acfc27023",
      "views": 76
    },
    {
      "dataset": "00abb46f-34e2-4bf7-be30-1fb0b1de022f",
      "views": 39
    }
  ]
}
```

This endpoint returns a list of dataset sorted by the number of times these datasets were viewed by users. The returned list is sorted descending, from the datasets with higher view count to the ones with a lower count.

If successful, this endpoint will return 200 OK, containing the list of sorted datasets in the `data` index of the response body. Each element of the list contains the dataset id in the `dataset` property and the number of times the dataset was viewed in the `views` property.

Note that the concept of view might differ from one application to another. In order to increase the view count of a dataset, an application has to explicitly increment the count for that dataset by calling the [increment view endpoint](#increment-dataset-view-count).

### Filters

> Filtering most viewed datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-viewed?application=gfw
```

> Limiting the number of returned results:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-viewed?limit=3
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated with this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`
limit        | Limits the number of results returned in the response. | Number | No limit applied - all results are returned.

## Most viewed datasets by user

> GET request to find out which are the most viewed datasets for the token user:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-viewed \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

> Example response:

```json
{
  "data": [
    {
      "dataset": "0087944f-871c-44bc-b4d9-cd5acfc27023",
      "views": 76
    },
    {
      "dataset": "00abb46f-34e2-4bf7-be30-1fb0b1de022f",
      "views": 39
    }
  ]
}
```

This endpoint returns a list of dataset sorted by the number of times these datasets were viewed by the user of the token provided in the request headers. The returned list is sorted descending, from the datasets with higher view count to the ones with a lower count.

If successful, this endpoint will return 200 OK, containing the list of sorted datasets in the `data` index of the response body. Each element of the list contains the dataset id in the `dataset` property and the number of times the dataset was viewed in the `views` property.

As in the case of the `most-viewed` endpoint, please keep in mind that the concept of view might differ from one application to another. In order to increase the view count of a dataset, an application has to explicitly increment the count for that dataset by calling the [increment view endpoint](#increment-dataset-view-count).

### Filters

> Filtering most viewed datasets by the token user by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-viewed-by-user?application=gfw
```

> Limiting the number of returned results:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-viewed-by-user?limit=3
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated with this concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`
limit        | Limits the number of results returned in the response. | Number | No limit applied - all results are returned.

### Errors for getting most viewed datasets by user

Error code | Error message | Description
---------- | ------------- | ---------------------------------
401        | Unauthorized  | You must provide your API user's token in the response headers.

## Increment dataset view count

> POST request to find out which are the most viewed datasets for the token user:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/dataset/:id/visited \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

Use this endpoint if you want to increment the view count of the dataset with id provided in the URL path. If successful, this endpoint will return 200 OK containing an empty object in the response body. 

You can optionally provide the authentication token for your API user in the request headers. If no token is provided, a dataset view is registered without being associated with any user. If a token is provided, the dataset view count for your API user will be incremented.

## Creating resources

**The creation of resources on the graph is performed automatically after the creation of each resource, so you don't need to explicitly do it yourself.** Because of this, creating resources on the graph is restricted to other RW API services, and requires authentication from a RW API service. Normal API users won't be able to call these endpoints successfully - if you try to do it with a "normal" API user token, you will receive a response with HTTP status code `403 Forbidden`.

For details on how these specific endpoints work, you should check out the developer docs for each of the resources supported. The following resources are currently supported as graph nodes:

* [dataset](/developer.html#creating-dataset-graph-nodes)
* [layer](/developer.html#creating-layer-graph-nodes)
* [widget](/developer.html#creating-widget-graph-nodes)
* [metadata](/developer.html#creating-metadata-graph-nodes)

## Deleting resources

**The deletion of resources on the graph is performed automatically after the deletion of each resource, so you don't need to explicitly do it yourself.** Because of this, deleting resources on the graph is restricted to other RW API services, and requires authentication from a RW API service. Normal API users won't be able to call these endpoints successfully - if you try to do it with a "normal" API user token, you will receive a response with HTTP status code `403 Forbidden`.

For details on how these specific endpoints work, you should check out the developer docs for each of the resources supported. The following resources are currently supported as graph nodes:

* [dataset](/developer.html#deleting-dataset-graph-nodes)
* [layer](/developer.html#deleting-layer-graph-nodes)
* [widget](/developer.html#deleting-widget-graph-nodes)
* [metadata](/developer.html#deleting-metadata-graph-nodes)

## Relationships between graph nodes and concepts

> Getting the list of concepts for a dataset:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts/:id
```

> Example response, containing the "urban" concept:

```json
{
  "data": [
    {
      "id": "37d04efc-0ab2-4499-a891-54dca1013c74",
      "type": "graph",
      "attributes": {
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

> Getting vocabulary for the same dataset:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/:id/vocabulary
```

> Example response, containing the "knowledge_graph" vocabulary with the "urban" tag associated:

```json
{
  "data": [
    {
      "id": "knowledge_graph",
      "type": "vocabulary",
      "attributes": {
        "tags": ["urban"],
        "name": "knowledge_graph",
        "application": "rw"
      }
    }
  ]
}
```

> Creating (if it doesn't exist yet) the association between the vocabulary "knowledge_graph" and a dataset:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/:id/vocabulary/knowledge_graph \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <your-token>' \
-d '{
  "application": "rw",
  "tags": ["urban", "society"]
}'
```

> Editing the association between the vocabulary "knowledge_graph" and a dataset:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/:id/vocabulary/knowledge_graph
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <your-token>' \
-d '{
  "application": "rw",
  "tags": ["urban"]
}'
```

> Deleting the association between the vocabulary "knowledge_graph" and a dataset:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/:id/vocabulary/knowledge_graph
```

**The management of connections between resources and concepts is handled by vocabulary endpoints, using the vocabulary `"knowledge_graph"`.** Using this vocabulary, you can add tags to your dataset. These tags will be added as concepts, and one (or more, accordingly) graph edges will be created, establishing a connection between your resource and the provided tags.

This section provides some examples of how you can use vocabulary endpoints to manage your resources' concepts. Keep in mind that you can always refer to the [vocabulary endpoint documentation](#vocabulary-and-tags) for more details on how to use these endpoints.

On the examples on the side, you'll be able to understand that you can map the tags associated with a given resource with the tags associated with the `"knowledge_graph"` vocabulary for the same resource. You can use vocabulary's endpoints to create (if it doesn't exist yet), edit, or delete the tags associated with that resource. Those changes will be reflected in the concepts that are associated with that same resource.

Lastly, keep in mind that, despite the examples on the side refer to datasets, you can use vocabulary's endpoints to update the tags associated with the `"knowledge_graph"` vocabulary for all supported resource types: datasets, layers, widgets, and metadata.

## Favorite relationships between graph nodes and users

As in the case of managing relationships between graph nodes and concepts, **the management of favorite relationships between resources and users is handled by vocabulary endpoints.** Please refer to the [favorite endpoint documentation](#favorites) for more details on how to use these endpoints.

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
`synonyms`               | String &#124; Array | The list of synonyms for this concept (or an empty string, if no synonyms exist).
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
`attributes.iso`            | String         | *Deprecated attribute - you should not rely on this attribute.*
`attributes.synonyms`       | Array          | A list of synonyms for this concept.
`attributes.id`             | String         | The concept unique identifier.
`attributes.label`          | String         | A readable version of the concept identifier.
`attributes.default_parent` | String         | The id of the parent concept, if existing.
