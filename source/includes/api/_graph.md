# Graph

The following section details the endpoints you can use to interact with graph information about the RW API. If you are new to the RW API, or want to learn more about what the RW API graph can do for you, we strongly encourage you to read the [graph concept](#graph) documentation first.

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

### Filters

> Filtering graph concepts by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

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

### Filters

> Filtering graph concepts for a dataset by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/list-concepts/:dataset?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

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

### Filters

> Filtering graph concepts for multiple datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/find-by-ids?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

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

### Filters

> Filtering inferred graph concepts by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/concepts-inferred?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

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

This endpoint lets API users discover datasets which share concepts with the dataset with id provided in the URL path. If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the id of the dataset that is related and a list of concepts that are shared.

The results returned are sorted by their degree of similarity, meaning the datasets with the higher number of shared concepts are higher on the list.

### Filters

> Filtering similar datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset/:dataset?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

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

This endpoint lets API users discover datasets which share concepts with the dataset with id provided in the URL path. The difference from the endpoint above is that this endpoint also looks at the ancestor concepts from the dataset with id provided - datasets returned might have ancestor concepts in common, but not necessarily the same exact concepts in common.

If successful, the response will have status 200 OK, containing a list of elements in the `data` index, each containing the id of the dataset that is related and a list of concepts that are shared. Each list item also contains a `numberOfOcurrences` field, containing the count of common concepts. The results returned are sorted by their degree of similarity, meaning the datasets with the higher number of shared concepts (`numberOfOcurrences`) are higher on the list.

### Filters

> Filtering similar datasets including descendants by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset-including-descendant/:dataset?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

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

This endpoint lets API users discover datasets related with the lists of concepts provided. Note that, either in the GET or POST forms for this endpoint, **concepts must be provided as a list of sets**. *AND* logical operators (`&&`) are applied among the list of sets, while *OR* (`||`) is used for set elements. You can provide up to three sets of concepts to search for - the example on the side exemplifies a request to this endpoint given the following sets of concepts:

- Set 1: `['spain', 'europe']`
- Set 2: `['water']`
- Set 3: `['raster', 'geospatial']`

In this specific case, the datasets returned would be related with `"spain"` OR `"europe"`, `"water"`, and `"raster"` or `"geospatial"`. Or, expressed as a logical condition: `("spain" || "europe") && "water" && ("raster" || "geospatial")`.

If successful, the response will have status 200 OK, containing a list of dataset ids that are related with the concepts provided in the `data` index. Also, note that ancestor concepts are also taken into account in the search.

### Filters

> Filtering searched datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/similar-dataset-including-descendant/:dataset?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`
depth        | Limits the depth of the graph search. | Number | 15

### Errors for searching datasets by concepts

Error code | Error message | Description
---------- | ------------- | ---------------------------------
400        | Concepts query params is required | You must provide the list of sets of concepts.

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

This endpoint searches datasets in the graph that are related with the concepts provided or any of its synonyms. If successful, the response will have status 200 OK, containing a list of dataset ids in the `data` index. You can provide multiple concepts by splitting them with blank spaces.

### Filters

> Filtering searched datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/search-by-label-synonyms?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

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

This endpoint returns a list of dataset sorted by the number of times these datasets were marked as favorite by users. The returned list is sorted descending, from the datasets with higher favorite count to the ones with lower count.

If successful, this endpoint will return 200 OK, containing the list of sorted datasets in the `data` index of the response body. Each element of the list contains the dataset id in the `id` property, and the number of times the dataset was marked as favorite by a user in the `count.low` property.

### Filters

> Filtering most liked datasets datasets by application:

```shell
curl -X GET https://api.resourcewatch.org/v1/graph/query/most-liked-datasets?application=gfw
```

This endpoint supports the following filters as query string parameters:

Filter       | Description                   | Type        | Default value
------------ | ----------------------------- | ----------- | ----------------
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`

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

This endpoint returns a list of dataset sorted by the number of times these datasets were viewed by users. The returned list is sorted descending, from the datasets with higher view count to the ones with lower count.

If successful, this endpoint will return 200 OK, containing the list of sorted datasets in the `data` index of the response body. Each element of the list contains the dataset id in the `dataset` property, and the number of times the dataset was viewed in the `views` property.

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
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`
limit        | Limits the number of results returned in the response. | Number | No limit applied - all results are returned.

## Most viewed datasets by user

> GET request to find out which are the most viewed datasets for the user with token provided:

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

This endpoint returns a list of dataset sorted by the number of times these datasets were viewed by the user of the token provided in the request headers. The returned list is sorted descending, from the datasets with higher view count to the ones with lower count.

If successful, this endpoint will return 200 OK, containing the list of sorted datasets in the `data` index of the response body. Each element of the list contains the dataset id in the `dataset` property, and the number of times the dataset was viewed in the `views` property.

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
application  | Applications associated to this graph concept - read more about this field [here](/index-rw.html#applications). | String | `"rw"`
limit        | Limits the number of results returned in the response. | Number | No limit applied - all results are returned.

### Errors for getting most viewed datasets by user

Error code | Error message | Description
---------- | ------------- | ---------------------------------
401        | Unauthorized  | You must provide your API user's token in the response headers.

## Increment dataset view count

> POST request to find out which are the most viewed datasets for the user with token provided:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/dataset/:id/visited \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

Use this endpoint if you want to increment the view count of the dataset with id provided in the URL path. If successful, this endpoint will return 200 OK containing an empty object in the response body. 

You can optionally provide the authentication token for your API user in the request headers. If no token is provided, a dataset view is registered without being associated to any user. If a token is provided, the dataset view count for your API user will be incremented.

## Create graph resources

The following sections describe how you can create graph resources, in order to take advantage of the features the RW API graph offers for the resources you own.

### Create dataset graph node

> POST request to create a dataset graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/dataset/:id \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint creates a graph node for the dataset with id provided in the URL path. 

**This endpoint is automatically called on dataset creation**, so you don't need to manually do it yourself after you create a dataset. In order to ensure that API users cannot manually create graph nodes for datasets, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to create a graph node for a dataset, you will receive a response with HTTP status code `403 Forbidden`.

#### Errors for creating dataset graph nodes

Error code | Error message   | Description
---------- | --------------- | ---------------------------------
401        | Unauthorized    | No authorization token provided.
403        | Not authorized  | You are trying to call this endpoint without being identified as a RW API service.

### Create widget graph node

> POST request to create a widget graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/widget/:idDataset/:idWidget \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint creates a graph node for the widget with id provided in the URL path. It also creates a graph edge, connecting the newly created widget graph node to the graph node for the dataset associated to this widget.

**This endpoint is automatically called on widget creation**, so you don't need to manually do it yourself after you create a widget. In order to ensure that API users cannot manually create graph nodes for widgets, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to create a graph node for a widget, you will receive a response with HTTP status code `403 Forbidden`.

#### Errors for creating widget graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Dataset not found | No graph node for the dataset with id provided was found.

### Create layer graph node

> POST request to create a layer graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/layer/:idDataset/:idLayer \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint creates a graph node for the layer with id provided in the URL path. It also creates a graph edge, connecting the newly created layer graph node to the graph node for the dataset associated to this layer.

**This endpoint is automatically called on layer creation**, so you don't need to manually do it yourself after you create a layer. In order to ensure that API users cannot manually create graph nodes for layers, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to create a graph node for a layer, you will receive a response with HTTP status code `403 Forbidden`.

#### Errors for creating layer graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Dataset not found | No graph node for the dataset with id provided was found.

### Create metadata graph node

> POST request to create a metadata graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/metadata/:resourceType/:idResource/:idMetadata \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint creates a graph node for the metadata with id provided in the URL path. As you might have come across in the [Metadata endpoint documentation](#metadata12), metadata is always associated with either a dataset, layer or widget. So, when creating a graph node for a metadata entry, you must also to provide the resource type (dataset, layer or widget) and its corresponding id. 

Calling this endpoint will also create a graph edge connecting the newly created metadata graph node to the graph node for the resource (dataset, layer or widget) associated to it.

**This endpoint is automatically called on metadata creation**, so you don't need to manually do it yourself after you create a metadata entry. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to create a graph node for a metadata entry, you will receive a response with HTTP status code `403 Forbidden`.

#### Errors for creating metadata graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

## Relationships between graph nodes and concepts

The following sections describe how you can manage the connections between concepts and graph nodes previously created.

### Associate concepts to a graph node

> POST request to associate concepts to a graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/:resourceType/:idResource/associate \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{
  "tags": ["health", "society"]
}'
```

This endpoint creates a graph edge, representative of the relationship between the resource identified in the URL path and the concepts provided in the `tags` field of the request body.

**This endpoint is automatically called when you associate the vocabulary "knowledge_graph" to a resource**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

#### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

### Update concepts associated to a graph node

> PUT request to update the concepts associated to a graph node:

```shell
curl -X PUT https://api.resourcewatch.org/v1/graph/:resourceType/:idResource/associate \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{
  "tags": ["health", "society"],
  "application": "rw"
}'
```

This endpoint updates the graph edge associated to the resource identified in the URL path. Existing concepts are deleted and replaced with the ones provided in the `tags` field of the request body.

**This endpoint is automatically called when you associate the vocabulary "knowledge_graph" to a resource**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

#### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

### Delete concepts associated to a graph node

> DELETE request to remove concepts associated to a graph node:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/:resourceType/:idResource/associate \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint deletes the graph edge associated to the resource identified in the URL path.

**This endpoint is automatically called when you associate the vocabulary "knowledge_graph" to a resource**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

### Query parameters

> Specifying the application of the resource to be deleted:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/:resourceType/:idResource/associate?application=gfw
```

You can use the query parameter `application` to specify the application of the graph edge to be deleted by this request. You can find out more information about this field [here](/index-rw.html#applications).

#### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

## Favorite relationships between graph nodes and users

The following sections describe how you can manage favorite relationships between graph nodes previously created and users.

### Create favorite relationship between user and graph node

> POST request to create favorite relationship between user and graph node:

```shell
curl -X POST https://api.resourcewatch.org/v1/graph/favourite/:resourceType/:idResource/:userId \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{ "application": "rw" }'
```

This endpoint creates a graph edge representative of a favorite relationship between the resource identified in the URL path and the user id also identified in the URL path.

**This endpoint is automatically called when you call vocabulary's create favorite endpoint**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

#### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

### Delete favorite relationship between user and graph node

> DELETE request to remove favorite relationship between user and graph node:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/favourite/:resourceType/:idResource/:userId \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

This endpoint deletes the graph edge representative of a favorite relationship between the resource identified in the URL path and the user id also identified in the URL path.

**This endpoint is automatically called when you call vocabulary's delete favorite endpoint**, so you don't need to manually do it yourself. In order to ensure that API users cannot manually create graph nodes for metadata entries, this endpoint requires authentication from a RW API service, meaning that normal API users won't be able to call this endpoint successfully. If, as an API user and using your user's token, you try to call this endpoint, you will receive a response with HTTP status code `403 Forbidden`.

### Query parameters

> Specifying the application of the favorite relationship to be deleted:

```shell
curl -X DELETE https://api.resourcewatch.org/v1/graph/favourite/:resourceType/:idResource/:userId?application=gfw
```

You can use the query parameter `application` to specify the application of the graph edge to be deleted by this request. You can find out more information about this field [here](/index-rw.html#applications).

#### Errors for associating concepts with graph nodes

Error code | Error message     | Description
---------- | ----------------- | ---------------------------------
401        | Unauthorized      | No authorization token provided.
403        | Not authorized    | You are trying to call this endpoint without being identified as a RW API service.
404        | Resource {:resourceType} and id ${:idResource} not found | No graph node for the resource with id provided was found.

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
