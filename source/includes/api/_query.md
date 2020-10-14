# Query

In order to retrieve data from datasets, you can send queries to the API using a syntax very similar to SQL. Using these endpoints, you can also download the results of a particular query. If you are new to the RW API, or want to learn more about the concept of a querying datasets, we strongly encourage you to read the [query concept](#query) documentation first. It gives you a brief and clear description of what a query is, and what it is useful for.

*Please note that some SQL features might not be supported. Check [here](/index-rw.html#supported-sql-syntax-reference) for a reference of the SQL features' support for each dataset provider.*

## Querying datasets

> Structure of the endpoint for executing a query:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/<dataset.id>?sql=SELECT * FROM <dataset.tableName>'
```

In order to query a dataset, you'll need two pieces of information:

- The id of the dataset you're trying to query.
- The SQL query that represents the data you are trying to retrieve.

The [dataset documentation](#dataset6) covers different ways that you can use to browse the existing dataset catalog or upload your own, all of which will give you the details of a dataset, including the dataset id you'll need to query it.

The SQL query will have to be custom built by you to fit your needs, but a good starting point for newcomers would be something like `SELECT * FROM <dataset.tableName> limit 10`.

*Notice: the `limit` parameter restricts our results to 10 rows, and is not required. However, for our learning purposes, this is useful, as it keeps the API responses small and fast.*

Most of the SQL query is up to you to define, based on your needs and the [support provided for the dataset type you are using](#supported-sql-syntax-reference). The `FROM` clause, however, does use a special value - the dataset's `tableName` value, which you can also get from the [dataset documentation](#dataset6) described above.

> Example endpoint for executing a query:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/098b33df-6871-4e53-a5ff-b56a7d989f9a?sql=SELECT cartodb_id, iso, name_0, name_1, type_1 FROM gadm28_adm1 limit 10'
```

With both pieces of information at hand, you can now send your query to the API and get the response. The example `cURL` to the side shows how that would look like.

### Query response body

> Example response:

```json
{
    "data": [
        {
            "cartodb_id": 1830,
            "iso": "MEX",
            "name_0": "Mexico",
            "name_1": "Ciudad de México",
            "type_1": "Distrito Federal"
        },
        {
            "cartodb_id": 1109,
            "iso": "HTI",
            "name_0": "Haiti",
            "name_1": "L'Artibonite",
            "type_1": "Département"
        },
        ...
    ],
    "meta": {
        "cloneUrl": {
            "http_method": "POST",
            "url": "/dataset/098b33df-6871-4e53-a5ff-b56a7d989f9a/clone",
            "body": {
                "dataset": {
                    "datasetUrl": "/query/098b33df-6871-4e53-a5ff-b56a7d989f9a?sql=SELECT%20*%20FROM%20gadm28_adm1%20limit%2010",
                    "application": [
                        "your",
                        "apps"
                    ]
                }
            }
        }
    }
}
```

The following table describes the response body fields:

| Field | Type | Description |
|-------|------|-------------|
| data  | Array | Array of objects that correspond to the result of the query execution. The data structure varies according to `SELECT` clause of your query, or the structure of dataset being queried.
| meta  | Object | Object with metadata regarding the query executed.
| meta.cloneUrl | Object | Object with information for creating a new dataset from the current query execution.
| meta.cloneUrl.http_method | String | The HTTP method that should be used for the request to create a new dataset from the current query execution. Read the documentation on [cloning a dataset](#cloning-a-dataset) for more info.
| meta.cloneUrl.url | String | The API endpoint path that should be used for the request to create a new dataset from the current query execution.
| meta.cloneUrl.body | Object | The body request data that should be provided for creating a new dataset from the current query execution.

### Query endpoint parameters

> Example of requesting the query results as CSV data:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date from gadm28_adm1 limit 2&format=csv'
```

> Example response:

```csv
"alert__date",
"_id"
"2019-04-12",
"AW6O0fqMLu2ttL7ZDM4P"
"2015-08-22",
"AW6O0fqMLu2ttL7ZDM4T"
```

> Example of requesting to freeze the query results:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date from gadm28_adm1 limit 2&freeze=true' \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
    "url": "https://storage.googleapis.com/query-freeze/1589458072773.json"
}
```

The following parameters can be provided as query parameters, in order to customize the output of the response returned:

Query parameter        | Description                                                                  | Type        | Required |
---------------------- | ---------------------------------------------------------------------------- | ----------- | -------- |
sql                    | The SQL query to be executed. This parameter changes the data returned in the query response body. | String | Yes |
format                 | The format of the returned response. By default, JSON format is assumed (`json`), but you can also request the response as CSV (`csv`), in which case the returned response will contain the CSV contents of the response. **This parameter will only be considered for document-based datasets.** | String | No |
freeze                 | The `freeze` parameter, when provided as `true`, will create a file with the results of the execution of the query and return the URL for that file. **Please note that you should be authenticated in order to request freezing the results of query executions.** | Boolean | No |
geostore               | Read more about the geostore query parameter [here](/index-rw.html#filter-query-results-by-geostore). | String | No |

#### Filter query results by geostore

> Example query providing a geostore id as query parameter to filter the results:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/1d7085f7-11c7-4eaf-a29a-5a4de57d010e?sql=SELECT * FROM dis_001_significant_earthquakes LIMIT 5&geostore=972c24e1da2c2baacc7572ee9501abdc'
```

Some dataset providers support receiving a `geostore` query parameter. When providing this parameter, you can request geo-referenced data that fits within the bounding box of the geostore with id provided. You can obtain the id of the geostore using the [RW API Geostore API](#geostore). If the data is not geo-referenced, or if the dataset provider does not support the `geostore` query parameter, it will be ignored.

The following providers support this parameter:

- CartoDB (`carto`)
- ArcGIS (`featureservice`)
- Google Earth Engine (`gee`)
- BigQuery (`bigquery`)
- Rasdaman (`rasdaman`)
- NEX-GDDP (`nexgddp`)
- Loca (`loca`)

### Alternative ways for querying datasets

While the GET request described above is the recommended way of querying datasets, there are other ways to query the RW API datasets that may be more suited for specific use cases.

#### Using the dataset slug instead of the id

> Example query not using the dataset id in the request path, and using the dataset slug in the FROM clause:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date from gadm28_adm1 limit 2'
curl -i -X GET 'https://api.resourcewatch.org/v1/query/Glad-Alerts-Daily-Geostore-User-Areas_3?sql=SELECT alert__date from gadm28_adm1 limit 2'
```

When referencing a dataset's id in a query, you have the option to use the dataset's slug instead, obtaining the same result. This is also applicable to the alternative query methods described in the sections below.

#### POST requests

> The same query executed as GET, and as a POST request providing the SQL as request body param:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date from gadm28_adm1 limit 2'
curl -i -X POST 'https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e' \
-H 'Content-Type: application/json' \
-d '{
    "sql": "SELECT alert__date from gadm28_adm1 limit 2"
}'
```

Using the GET request is the recommended approach, as it allows HTTP caching of your result - subsequent requests for the same query will see a great performance increase, even if they are made by a different application or client.

Alternatively, you can also query a dataset using a POST request. POST requests are not cached, so you will not benefit from these speed improvements. However, GET requests can sometimes hit URL length restrictions, should your query string be too long. Using a POST request is the recommended solution for these cases. See the example on the side to see how you can query a dataset with a POST request.

#### Dataset id as the FROM clause

> Three different but equivalent syntaxes for the same query:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/098b33df-6871-4e53-a5ff-b56a7d989f9a?sql=SELECT cartodb_id, iso, name_0, name_1, type_1 FROM gadm28_adm1 limit 10'

curl -i -X GET 'https://api.resourcewatch.org/v1/query?sql=SELECT cartodb_id, iso, name_0, name_1, type_1 FROM 098b33df-6871-4e53-a5ff-b56a7d989f9a limit 10'

curl -i -X POST 'https://api.resourcewatch.org/v1/query' \
-H 'Content-Type: application/json' \
-d '{
    "sql": "SELECT cartodb_id, iso, name_0, name_1, type_1 FROM 098b33df-6871-4e53-a5ff-b56a7d989f9a limit 10"
}'

```

The examples we've seen so far expect the URL to have the `/query/<dataset id or slug>?sql=SELECT * FROM <dataset.tableName>` format. However, you can also use the equivalent
`/query?sql=SELECT * FROM <dataset id>` syntax. You can also use this alternative syntax with POST requests.

#### Redundant FROM clause (document based datasets only)

> Example query providing a document-based dataset id in the request path or as the FROM clause:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query?sql=SELECT alert__date FROM 9be3bf63-97fc-4bb0-b913-775ccae3cf9e limit 10'
curl -i -X GET 'https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date FROM data limit 10'
```

When querying a document based dataset using either GET or POST `/query/<dataset id or slug>` request, the `FROM` clause is required but ignored, meaning you don't have to provide the dataset's `tableName` as you normally would. The example on the side illustrates this.

## Downloading data from a dataset

> Structure of the endpoint for downloading the results of a query:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/<dataset.id>?sql=SELECT * FROM <dataset.tableName>'
```

> Example endpoint for downloading the results of a query:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/098b33df-6871-4e53-a5ff-b56a7d989f9a?sql=SELECT cartodb_id, iso, name_0, name_1, type_1 FROM gadm28_adm1 limit 10'
```

The download endpoint allows you to download the results of the execution of a query over a dataset. This endpoint is greatly based on the [query datasets](index-rw.html#querying-datasets) endpoint, so we strongly suggest you read that section of the documentation.

**Note: Some dataset providers do not support downloading query results. You can download query results for the following dataset providers:**

- Google Earth Engine
- Document-based datasets
- Carto
- BigQuery
- ArcGIS FeatureService

Like when querying datasets, in order to download the results of the execution of query, you'll need two pieces of information:

- The id of the dataset you're trying to download the query execution results.
- The SQL query that represents the data you are trying to download.

The [dataset documentation](#dataset6) covers different ways that you can use to browse the existing dataset catalog or upload your own, all of which will give you the details of a dataset, including the dataset id you'll need to query it.

The SQL query will have to be custom built by you to fit your needs, but a good starting point for newcomers would be something like `SELECT * FROM <dataset.tableName> limit 10`.

*Notice: the `limit` parameter restricts our results to 10 rows, and is not required. However, for our learning purposes, this is useful, as it keeps the API responses small and fast.*

As with the query endpoint, the `FROM` clause should reference the dataset's `tableName` value, which you can also get from the [dataset documentation](#dataset6) described above. And also, don't forget that you can check the [support provided for the dataset type you are using](#supported-sql-syntax-reference) if you are having trouble writing your SQL query.

### Download response body

> Example of downloading query results (by default, CSV data is assumed):

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date, alert__count from gadm28_adm1 limit 2'
```

> Example CSV response:

```csv
"alert__date",
"alert__count",
"_id"
"2019-04-12",
5,
"AW6O0fqMLu2ttL7ZDM4P"
"2015-08-22",
6,
"AW6O0fqMLu2ttL7ZDM4T"
```

> Example of downloading query results requesting format as JSON:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date, alert__count from gadm28_adm1 limit 2&format=json'
```

> Example JSON response:

```json
{
    "data": [
        {
            "alert__date": "2019-04-12",
            "alert__count": 5,
            "_id": "AW6O0fqMLu2ttL7ZDM4P"
        },
        {
            "alert__date": "2015-08-22",
            "alert__count": 6,
            "_id": "AW6O0fqMLu2ttL7ZDM4T"
        }
    ]
}
```

The response body of executing the download endpoint will contain the data to be downloaded. You can use the `format` query parameter to customize the format of the data returned. By default, `format=csv` will be assumed, so you will receive the corresponding query results the actual CSV data in the response body. If you provide `format=json`, the returned result will be a JSON object with a `data` index containing the results of the execution of the query provided.

### Download execution errors

Calling the download endpoint might sometimes result in an error being returned. The following table describes the possible errors that can occur when downloading query execution results:

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | SQL or FS required | The required `sql` field is missing either as query string parameter or in the request body.
400            | - format: format must be in [json,csv]. -  | If provided, `format` must be either `csv` or `json`.
500            | Internal server error | The error message might vary in this case.

### Download endpoint parameters

> Example of requesting to freeze the download results:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date from gadm28_adm1 limit 2&freeze=true' \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
    "url": "https://storage.googleapis.com/query-freeze/1589458072773.json"
}
```

You can use the following query parameters to customize the output of the download query execution results endpoint:

Query parameter        | Description                                                                  | Type        | Required |
---------------------- | ---------------------------------------------------------------------------- | ----------- | -------- |
sql                    | The SQL query to be executed. This parameter changes the data returned in the query response body. | String | Yes |
format                 | The format of the returned response. By default, CSV format is assumed (`csv`), but you can also request the response as JSON (`json`). Check the section on the [download endpoint response body](index-rw.html#download-response-body) for some examples of how the `format` query parameter can be used. | String | No |
freeze                 | The `freeze` parameter, when provided as `true`, will create a file with the results of the execution of the query and return the URL for that file. **Please note that you should be authenticated in order to request freezing the results of query executions.** | Boolean | No |
geostore               | Read more about the geostore query parameter [here](/index-rw.html#filter-download-results-by-geostore). | String | No |

#### Filter download results by geostore

> Example download request providing a geostore id as query parameter to filter the results:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/1d7085f7-11c7-4eaf-a29a-5a4de57d010e?sql=SELECT * FROM dis_001_significant_earthquakes LIMIT 5&geostore=972c24e1da2c2baacc7572ee9501abdc'
```

Some dataset providers support receiving a `geostore` query parameter. When providing this parameter, you can request geo-referenced data that fits within the bounding box of the geostore with id provided. You can obtain the id of the geostore using the [RW API Geostore API](/index-rw.html#geostore). If the data is not geo-referenced, or if the dataset provider does not support the `geostore` query parameter, it will be ignored.

The following providers support this parameter:

- CartoDB (`carto`)
- ArcGIS (`featureservice`)
- Google Earth Engine (`gee`)
- BigQuery (`bigquery`)
- Rasdaman (`rasdaman`)
- NEX-GDDP (`nexgddp`)
- Loca (`loca`)

### Alternative ways for downloading query execution results

As in the case of [querying datasets](index-rw.html#alternative-ways-for-querying-datasets), there are some alternative ways that you can use for downloading query execution results. While the GET request described above is the recommended way of downloading query results, there are other ways to download query results that may be more suited for specific use cases.

#### Using the dataset slug instead of the id

> Example request for downloading the query execution results not using the dataset id in the request path, and using the dataset slug in the FROM clause:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date from gadm28_adm1 limit 2'
curl -i -X GET 'https://api.resourcewatch.org/v1/download/Glad-Alerts-Daily-Geostore-User-Areas_3?sql=SELECT alert__date from gadm28_adm1 limit 2'
```

When referencing a dataset's id in th SQL query, you have the option to use the dataset's slug instead, obtaining the same result. This is also applicable to the alternative download methods described in the sections below.

#### POST requests

> The same download request executed as GET, and as a POST request providing the SQL as request body param:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date from gadm28_adm1 limit 2'
curl -i -X POST 'https://api.resourcewatch.org/v1/download/9be3bf63-97fc-4bb0-b913-775ccae3cf9e' \
-H 'Content-Type: application/json' \
-d '{
    "sql": "SELECT alert__date from gadm28_adm1 limit 2"
}'
```

Using the GET request is the recommended approach, as it allows HTTP caching of your result - subsequent requests for the same download endpoint call will see a great performance increase, even if they are made by a different application or client.

Alternatively, you can also download the query results using a POST request. POST requests are not cached, so you will not benefit from these speed improvements. However, GET requests can sometimes hit URL length restrictions, should your SQL query string be too long. Using a POST request is the recommended solution for these cases. See the example on the side to see how you can download the query execution results with a POST request.

#### Dataset id as the FROM clause

> Three different but equivalent syntaxes for the same call to the download endpoint:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download/098b33df-6871-4e53-a5ff-b56a7d989f9a?sql=SELECT cartodb_id, iso, name_0, name_1, type_1 FROM gadm28_adm1 limit 10'

curl -i -X GET 'https://api.resourcewatch.org/v1/download?sql=SELECT cartodb_id, iso, name_0, name_1, type_1 FROM 098b33df-6871-4e53-a5ff-b56a7d989f9a limit 10'

curl -i -X POST 'https://api.resourcewatch.org/v1/download' \
-H 'Content-Type: application/json' \
-d '{
    "sql": "SELECT cartodb_id, iso, name_0, name_1, type_1 FROM 098b33df-6871-4e53-a5ff-b56a7d989f9a limit 10"
}'

```

The examples we've seen so far expect the URL to have the `/download/<dataset id or slug>?sql=SELECT * FROM <dataset.tableName>` format. However, you can also use the equivalent `/download?sql=SELECT * FROM <dataset id>` syntax. This alternative syntax is also available for POST requests.

#### Redundant FROM clause (document-based datasets only)

> Example download providing a document-based dataset id in the request path or as the FROM clause:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/download?sql=SELECT alert__date FROM 9be3bf63-97fc-4bb0-b913-775ccae3cf9e limit 10'
curl -i -X GET 'https://api.resourcewatch.org/v1/download/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT alert__date FROM data limit 10'
```

When downloading the query results for a document based dataset using either GET or POST `/download/<dataset id or slug>` request, the `FROM` clause is required but ignored, meaning you don't have to provide the dataset's `tableName` as you normally would. The example on the side illustrates this.

## Deleting data from a dataset

> Example requests to delete data from a dataset:

```shell
curl -i -X GET 'https://api.resourcewatch.org/v1/query/:dataset_id?sql=DELETE FROM index_bf86b945c4ec41d2b5b7af00f3f61423'
curl -i -X GET 'https://api.resourcewatch.org/v1/query/:dataset_id?sql=DELETE FROM index_bf86b945c4ec41d2b5b7af00f3f61423 WHERE x = "y"'
```

Write queries such as `INSERT` or `UPDATE` are not supported in the RW API. You can use dataset endpoints to [append](/index-rw.html#concatenate-and-append-data-to-a-document-based-dataset) or [overwrite](/index-rw.html#overwrite-data-for-a-document-based-dataset) a given dataset's data, but you cannot use SQL to write data into the datasets.

Most providers do not support `DELETE` queries either. However, in the case of **document-based datasets** (i.e. where the `connectorType` is `document`), you can delete the dataset's data via SQL `DELETE` query. Executing a `DELETE` query requires authentication, and additionally, one of the following conditions must be met:

- have role `MANAGER` and own the dataset;
- have role `ADMIN` and belong to all the apps to which the dataset is associated.

If the query is successfully executed, the request will return an HTTP response with status code `204 No Content`. Please note that executing a delete query is an **asynchronous process** - as in the case of appending or overwriting a dataset's data, the dataset will have its status updated to `pending`, and updated once again to `saved` once the deletion process is completed.

### Delete query execution errors

Error code     | Error message  | Description
-------------- | -------------- | --------------
403            | Forbidden      | Not authorized to execute DELETE query - the logged user provided does not meet at least one of the conditions required to be able to delete the dataset data.
400            | Unsupported query element detected | The SQL query provided is not valid, or the syntax provided is not supported.

## Supported SQL syntax reference

### CartoDB datasets

This section describes the SQL support for querying datasets with provider `cartodb`.

| Supported | Feature | Example URL |
|-----------|---------|-------------|
| YES | SELECT: Selecting all columns using wildcard | [SELECT \* FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Count all rows | [SELECT count(\*) FROM edi](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20count(\*)%20FROM%20edi) |
| YES | SELECT: Selecting specific columns | [SELECT region, overall\_score FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20overall\_score%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Selecting DISTINCT values for specific columns | [SELECT DISTINCT(region) FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20DISTINCT(region)%20FROM%20edi%20LIMIT%205) |
| **NO** | **SELECT: Selecting columns AND counting all rows** | **[SELECT region, count(\*) FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20count(\*)%20FROM%20edi%20LIMIT%205)** |
| YES | SELECT: Aliasing aggregate function results such as AVG in SELECT | [SELECT AVG(overall\_score) as alias FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20AVG(overall\_score)%20as%20alias%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (AVG) in SELECT | [SELECT AVG(overall\_score) FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20AVG(overall\_score)%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MAX) in SELECT | [SELECT MAX(overall\_score) FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20MAX(overall\_score)%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MIN) in SELECT | [SELECT MIN(overall\_score) FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20MIN(overall\_score)%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (SUM) in SELECT | [SELECT SUM(overall\_score) FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20SUM(overall\_score)%20FROM%20edi%20LIMIT%205) |
| YES | FROM: Using dataset id in FROM statement | [SELECT \* FROM 0b9f0100-ce5b-430f-ad8f-3363efa05481 LIMIT 5](https://api.resourcewatch.org/v1/query?sql=SELECT%20\*%20FROM%200b9f0100-ce5b-430f-ad8f-3363efa05481%20LIMIT%205) |
| YES | FROM: Using dataset slug in FROM statement | [SELECT \* FROM Environmental-Democracy-Index-1490086842552 LIMIT 5](https://api.resourcewatch.org/v1/query?sql=SELECT%20\*%20FROM%20Environmental-Democracy-Index-1490086842552%20LIMIT%205) |
| YES | FROM: Using dataset tableName in FROM statement | [SELECT \* FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20LIMIT%205) |
| YES | WHERE: Greater than filtering | [SELECT \* FROM edi WHERE overall\_score > 2 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3E%202%20LIMIT%205) |
| YES | WHERE: Greater than or equal filtering | [SELECT \* FROM edi WHERE overall\_score >= 2 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3E%3D%202%20LIMIT%205) |
| YES | WHERE: Equality filtering | [SELECT \* FROM edi WHERE overall\_score = 2.1 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3D%202.1%20LIMIT%205) |
| YES | WHERE: Lower than filtering | [SELECT \* FROM edi WHERE overall\_score < 2.2 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3C%202.2%20LIMIT%205) |
| YES | WHERE: Lower than or equal filtering | [SELECT \* FROM edi WHERE overall\_score <= 2.2 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3C%3D%202.2%20LIMIT%205) |
| YES | WHERE: Conjunction (AND) filtering | [SELECT \* FROM edi WHERE overall\_score <= 2.2 AND justice\_pillar\_score > 1 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3C%3D%202.2%20AND%20justice\_pillar\_score%20%3E%201%20LIMIT%205) |
| YES | WHERE: Disjunction (OR) filtering | [SELECT \* FROM edi WHERE overall\_score <= 2.2 OR justice\_pillar\_score > 1 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3C%3D%202.2%20OR%20justice\_pillar\_score%20%3E%201%20LIMIT%205) |
| YES | WHERE: BETWEEN filtering | [SELECT \* FROM edi WHERE overall\_score BETWEEN 2 AND 2.2 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20BETWEEN%202%20AND%202.2%20LIMIT%205) |
| YES | WHERE: LIKE filtering | [SELECT \* FROM edi WHERE region LIKE 'Europ%' LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20region%20LIKE%20'Europ%25'%20LIMIT%205) |
| YES | GROUP BY: Group results by a single column | [SELECT region FROM edi GROUP BY region LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20GROUP%20BY%20region%20LIMIT%205) |
| YES | GROUP BY: Group results by multiple columns | [SELECT region, overall\_score FROM edi GROUP BY region, overall\_score LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20overall\_score%20FROM%20edi%20GROUP%20BY%20region%2C%20overall\_score%20LIMIT%205) |
| YES | GROUP BY: Aggregate functions used with GROUP BY statements | [SELECT region, COUNT(\*) as count FROM edi GROUP BY region LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20COUNT(\*)%20as%20count%20FROM%20edi%20GROUP%20BY%20region%20LIMIT%205) |
| **NO** | **GROUP BY: Special grouping by range function** | **[SELECT count(\*) FROM edi GROUP BY range(overall\_score, 0,1,2,3,4) LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20count(\*)%20FROM%20edi%20GROUP%20BY%20range(overall\_score%2C%200%2C1%2C2%2C3%2C4)%20LIMIT%205)** |
| YES | ORDER BY: Ordering results by one column | [SELECT region FROM edi ORDER BY region LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20ORDER%20BY%20region%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column descending | [SELECT region FROM edi ORDER BY region DESC LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20ORDER%20BY%20region%20DESC%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column | [SELECT region, overall\_score FROM edi ORDER BY region, overall\_score LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20overall\_score%20FROM%20edi%20ORDER%20BY%20region%2C%20overall\_score%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column descending | [SELECT region, overall\_score FROM edi ORDER BY region, overall\_score DESC LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20overall\_score%20FROM%20edi%20ORDER%20BY%20region%2C%20overall\_score%20DESC%20LIMIT%205) |
| YES | LIMIT: Limit the number of returned results | [SELECT region FROM edi LIMIT 5](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20LIMIT%205) |
| **NO** | **OFFSET: Offset the returned results** | **[SELECT region FROM edi LIMIT 5 OFFSET 10](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20LIMIT%205%20OFFSET%2010)** |
| **NO** | **OFFSET: Offset the returned results using short syntax** | **[SELECT region FROM edi LIMIT 5, 10](https://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20LIMIT%205%2C%2010)** |

#### CartoDB geo-spatial query support

CartoDB datasets can be queried using [PostGIS functions](https://postgis.net/docs/reference.html). This means if your dataset contains geo-referenced data, you can execute PostGIS functions on the data to extract the information you need. The table below displays some examples of supported PostGIS functions:

| Supported | Feature | Example URL |
|-----------|---------|-------------|
| YES | [PostGIS: ST\_MetaData](https://postgis.net/docs/RT\_ST\_MetaData.html) | [SELECT ST\_METADATA(the\_raster\_webmercator) FROM sp\_richness LIMIT 5](https://api.resourcewatch.org/v1/query/16df8ada-87cc-4907-adce-a98bc4e91856?sql=SELECT%20ST\_METADATA(the\_raster\_webmercator)%20FROM%20sp\_richness%20LIMIT%205) |
| YES | [PostGIS: ST\_BandMetaData](https://postgis.net/docs/RT\_ST\_BandMetaData.html) | [SELECT ST\_BANDMETADATA(the\_raster\_webmercator) FROM sp\_richness LIMIT 5](https://api.resourcewatch.org/v1/query/16df8ada-87cc-4907-adce-a98bc4e91856?sql=SELECT%20ST\_BANDMETADATA(the\_raster\_webmercator)%20FROM%20sp\_richness%20LIMIT%205) |
| YES | [PostGIS: ST\_SummaryStats](https://postgis.net/docs/RT\_ST\_SummaryStats.html) | [SELECT ST\_SUMMARYSTATS(the\_raster\_webmercator, true) FROM sp\_richness LIMIT 5](https://api.resourcewatch.org/v1/query/16df8ada-87cc-4907-adce-a98bc4e91856?sql=SELECT%20ST\_SUMMARYSTATS(the\_raster\_webmercator%2C%20true)%20FROM%20sp\_richness%20LIMIT%205) |
| YES | [PostGIS: ST\_Histogram](https://postgis.net/docs/RT\_ST\_Histogram.html) | [SELECT ST\_HISTOGRAM(the\_raster\_webmercator) FROM sp\_richness LIMIT 5](https://api.resourcewatch.org/v1/query/16df8ada-87cc-4907-adce-a98bc4e91856?sql=SELECT%20ST\_HISTOGRAM(the\_raster\_webmercator)%20FROM%20sp\_richness%20LIMIT%205) |
| YES | [PostGIS: ST\_ValueCount](https://postgis.net/docs/RT\_ST\_ValueCount.html) | [SELECT ST\_VALUECOUNT(the\_raster\_webmercator) FROM sp\_richness LIMIT 5](https://api.resourcewatch.org/v1/query/16df8ada-87cc-4907-adce-a98bc4e91856?sql=SELECT%20ST\_VALUECOUNT(the\_raster\_webmercator)%20FROM%20sp\_richness%20LIMIT%205) |
| YES | Using PostGIS functions in WHERE clause | [SELECT \* FROM sp\_richness WHERE ST\_METADATA(the\_raster\_webmercator) IS NOT NULL LIMIT 5](https://api.resourcewatch.org/v1/query/16df8ada-87cc-4907-adce-a98bc4e91856?sql=SELECT%20\*%20FROM%20sp\_richness%20WHERE%20ST\_METADATA(the\_raster\_webmercator)%20IS%20NOT%20NULL%20LIMIT%205) |
| **NO** | **Using PostGIS functions in GROUP BY clause** | **[SELECT \* FROM sp\_richness GROUP BY ST\_SUMMARYSTATS(the\_raster\_webmercator, true) IS NOT NULL LIMIT 5](https://api.resourcewatch.org/v1/query/16df8ada-87cc-4907-adce-a98bc4e91856?sql=SELECT%20\*%20FROM%20sp\_richness%20GROUP%20BY%20ST\_SUMMARYSTATS(the\_raster\_webmercator%2C%20true)%20IS%20NOT%20NULL%20LIMIT%205)** |
| YES | Using PostGIS functions in ORDER BY clause | [SELECT \* FROM sp\_richness ORDER BY ST\_METADATA(the\_raster\_webmercator) IS NOT NULL LIMIT 5](https://api.resourcewatch.org/v1/query/16df8ada-87cc-4907-adce-a98bc4e91856?sql=SELECT%20\*%20FROM%20sp\_richness%20ORDER%20BY%20ST\_METADATA(the\_raster\_webmercator)%20IS%20NOT%20NULL%20LIMIT%205) |

### ArcGIS Feature Service datasets

This section describes the SQL support for querying datasets with connector type `rest` and provider `featureservice`.

| Supported | Feature | Example URL |
|-----------|---------|-------------|
| YES | SELECT: Selecting all columns using wildcard | [SELECT \* FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| YES | SELECT: Count all rows | [SELECT count(\*) FROM cdonexradMapServer0](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20count(\*)%20FROM%20cdonexradMapServer0) |
| YES | SELECT: Selecting specific columns | [SELECT STATION\_NAME, ELEVATION FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%2C%20ELEVATION%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| **NO** | **SELECT: Selecting DISTINCT values for specific columns** | **[SELECT DISTINCT(STATION\_NAME) FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20DISTINCT(STATION\_NAME)%20FROM%20cdonexradMapServer0%20LIMIT%205)** |
| **NO** | **SELECT: Selecting columns AND counting all rows** | **[SELECT STATION\_NAME, count(\*) FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%2C%20count(\*)%20FROM%20cdonexradMapServer0%20LIMIT%205)** |
| YES | SELECT: Aliasing aggregate function results such as AVG in SELECT | [SELECT AVG(ELEVATION) as alias FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20AVG(ELEVATION)%20as%20alias%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (AVG) in SELECT | [SELECT AVG(ELEVATION) FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20AVG(ELEVATION)%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MAX) in SELECT | [SELECT MAX(ELEVATION) FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20MAX(ELEVATION)%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MIN) in SELECT | [SELECT MIN(ELEVATION) FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20MIN(ELEVATION)%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (SUM) in SELECT | [SELECT SUM(ELEVATION) FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20SUM(ELEVATION)%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| YES | FROM: Using dataset id in FROM statement | [SELECT \* FROM 0b9e546c-f42a-4b26-bad3-7d606f58961c LIMIT 5](https://api.resourcewatch.org/v1/query?sql=SELECT%20\*%20FROM%200b9e546c-f42a-4b26-bad3-7d606f58961c%20LIMIT%205) |
| YES | FROM: Using dataset slug in FROM statement | [SELECT \* FROM NOAA-NEXt-Generation-RADar-NEXRAD-Products-Locations-1490086842546 LIMIT 5](https://api.resourcewatch.org/v1/query?sql=SELECT%20\*%20FROM%20NOAA-NEXt-Generation-RADar-NEXRAD-Products-Locations-1490086842546%20LIMIT%205) |
| YES | FROM: Using dataset tableName in FROM statement | [SELECT \* FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| YES | WHERE: Greater than filtering | [SELECT \* FROM cdonexradMapServer0 WHERE ELEVATION > 3587 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20ELEVATION%20%3E%203587%20LIMIT%205) |
| YES | WHERE: Greater than or equal filtering | [SELECT \* FROM cdonexradMapServer0 WHERE ELEVATION >= 3587 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20ELEVATION%20%3E%3D%203587%20LIMIT%205) |
| YES | WHERE: Equality filtering | [SELECT \* FROM cdonexradMapServer0 WHERE ELEVATION = 5870 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20ELEVATION%20%3D%205870%20LIMIT%205) |
| YES | WHERE: Lower than filtering | [SELECT \* FROM cdonexradMapServer0 WHERE ELEVATION < 5000 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20ELEVATION%20%3C%205000%20LIMIT%205) |
| YES | WHERE: Lower than or equal filtering | [SELECT \* FROM cdonexradMapServer0 WHERE ELEVATION <= 5000 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20ELEVATION%20%3C%3D%205000%20LIMIT%205) |
| YES | WHERE: Conjunction (AND) filtering | [SELECT \* FROM cdonexradMapServer0 WHERE ELEVATION <= 5000 AND LATITUDE > 35.23333 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20ELEVATION%20%3C%3D%205000%20AND%20LATITUDE%20%3E%2035.23333%20LIMIT%205) |
| YES | WHERE: Disjunction (OR) filtering | [SELECT \* FROM cdonexradMapServer0 WHERE ELEVATION <= 5000 OR LATITUDE > 35.23333 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20ELEVATION%20%3C%3D%205000%20OR%20LATITUDE%20%3E%2035.23333%20LIMIT%205) |
| YES | WHERE: BETWEEN filtering | [SELECT \* FROM cdonexradMapServer0 WHERE ELEVATION BETWEEN 3587 AND 5000 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20ELEVATION%20BETWEEN%203587%20AND%205000%20LIMIT%205) |
| YES | WHERE: LIKE filtering | [SELECT \* FROM cdonexradMapServer0 WHERE STATION\_NAME LIKE 'AMARI%' LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20\*%20FROM%20cdonexradMapServer0%20WHERE%20STATION\_NAME%20LIKE%20'AMARI%25'%20LIMIT%205) |
| YES | GROUP BY: Group results by a single column | [SELECT STATION\_NAME FROM cdonexradMapServer0 GROUP BY STATION\_NAME LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%20FROM%20cdonexradMapServer0%20GROUP%20BY%20STATION\_NAME%20LIMIT%205) |
| YES | GROUP BY: Group results by multiple columns | [SELECT STATION\_NAME, ELEVATION FROM cdonexradMapServer0 GROUP BY STATION\_NAME, ELEVATION LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%2C%20ELEVATION%20FROM%20cdonexradMapServer0%20GROUP%20BY%20STATION\_NAME%2C%20ELEVATION%20LIMIT%205) |
| **NO** | **GROUP BY: Aggregate functions used with GROUP BY statements** | **[SELECT STATION\_NAME, COUNT(\*) as count FROM cdonexradMapServer0 GROUP BY STATION\_NAME LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%2C%20COUNT(\*)%20as%20count%20FROM%20cdonexradMapServer0%20GROUP%20BY%20STATION\_NAME%20LIMIT%205)** |
| YES | GROUP BY: Special grouping by range function | [SELECT count(\*) FROM cdonexradMapServer0 GROUP BY range(ELEVATION, 0,1,2,3,4) LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20count(\*)%20FROM%20cdonexradMapServer0%20GROUP%20BY%20range(ELEVATION%2C%200%2C1%2C2%2C3%2C4)%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column | [SELECT STATION\_NAME FROM cdonexradMapServer0 ORDER BY STATION\_NAME LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%20FROM%20cdonexradMapServer0%20ORDER%20BY%20STATION\_NAME%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column descending | [SELECT STATION\_NAME FROM cdonexradMapServer0 ORDER BY STATION\_NAME DESC LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%20FROM%20cdonexradMapServer0%20ORDER%20BY%20STATION\_NAME%20DESC%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column | [SELECT STATION\_NAME, ELEVATION FROM cdonexradMapServer0 ORDER BY STATION\_NAME, ELEVATION LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%2C%20ELEVATION%20FROM%20cdonexradMapServer0%20ORDER%20BY%20STATION\_NAME%2C%20ELEVATION%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column descending | [SELECT STATION\_NAME, ELEVATION FROM cdonexradMapServer0 ORDER BY STATION\_NAME, ELEVATION DESC LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%2C%20ELEVATION%20FROM%20cdonexradMapServer0%20ORDER%20BY%20STATION\_NAME%2C%20ELEVATION%20DESC%20LIMIT%205) |
| YES | LIMIT: Limit the number of returned results | [SELECT STATION\_NAME FROM cdonexradMapServer0 LIMIT 5](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%20FROM%20cdonexradMapServer0%20LIMIT%205) |
| YES | OFFSET: Offset the returned results | [SELECT STATION\_NAME FROM cdonexradMapServer0 LIMIT 5 OFFSET 10](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%20FROM%20cdonexradMapServer0%20LIMIT%205%20OFFSET%2010) |
| **NO** | **OFFSET: Offset the returned results using short syntax** | **[SELECT STATION\_NAME FROM cdonexradMapServer0 LIMIT 5, 10](https://api.resourcewatch.org/v1/query/0b9e546c-f42a-4b26-bad3-7d606f58961c?sql=SELECT%20STATION\_NAME%20FROM%20cdonexradMapServer0%20LIMIT%205%2C%2010)** |

*Note: This table was generated automatically with the help of [this repository](https://github.com/resource-watch/sql-compatibility-test). If you are maintaining the docs, please do not edit manually these tables.*

### GEE datasets

This section describes the SQL support for querying datasets with connector type `rest` and providers `gee`.

| Supported | Feature | Example URL |
|-----------|---------|-------------|
| YES | SELECT: Selecting all columns using wildcard | [SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| YES | SELECT: Count all rows | [SELECT count(\*) FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20count(\*)%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index) |
| YES | SELECT: Selecting specific columns | [SELECT system:index, system:asset\_size FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%2C%20system%3Aasset\_size%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| **NO** | **SELECT: Selecting DISTINCT values for specific columns** | **[SELECT DISTINCT(system:index) FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20DISTINCT(system%3Aindex)%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205)** |
| YES | SELECT: Selecting columns AND counting all rows | [SELECT system:index, count(\*) FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%2C%20count(\*)%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| **NO** | **SELECT: Aliasing aggregate function results such as AVG in SELECT** | **[SELECT AVG(system:asset\_size) as alias FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20AVG(system%3Aasset\_size)%20as%20alias%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205)** |
| YES | SELECT: Usage of aggregate functions (AVG) in SELECT | [SELECT AVG(system:asset\_size) FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20AVG(system%3Aasset\_size)%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MAX) in SELECT | [SELECT MAX(system:asset\_size) FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20MAX(system%3Aasset\_size)%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MIN) in SELECT | [SELECT MIN(system:asset\_size) FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20MIN(system%3Aasset\_size)%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (SUM) in SELECT | [SELECT SUM(system:asset\_size) FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20SUM(system%3Aasset\_size)%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| **NO** | **FROM: Using dataset id in FROM statement** | **[SELECT \* FROM c12446ce-174f-4ffb-b2f7-77ecb0116aba LIMIT 5](https://api.resourcewatch.org/v1/query?sql=SELECT%20\*%20FROM%20c12446ce-174f-4ffb-b2f7-77ecb0116aba%20LIMIT%205)** |
| **NO** | **FROM: Using dataset slug in FROM statement** | **[SELECT \* FROM foo024nrt-Vegetation-Health-Index\_replacement\_4 LIMIT 5](https://api.resourcewatch.org/v1/query?sql=SELECT%20\*%20FROM%20foo024nrt-Vegetation-Health-Index\_replacement\_4%20LIMIT%205)** |
| YES | FROM: Using dataset tableName in FROM statement | [SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| YES | WHERE: Greater than filtering | [SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:asset\_size > 36975655 LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aasset\_size%20%3E%2036975655%20LIMIT%205) |
| YES | WHERE: Greater than or equal filtering | [SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:asset\_size >= 36975655 LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aasset\_size%20%3E%3D%2036975655%20LIMIT%205) |
| YES | WHERE: Equality filtering | [SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:asset\_size = 37153685 LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aasset\_size%20%3D%2037153685%20LIMIT%205) |
| YES | WHERE: Lower than filtering | [SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:asset\_size < 37180450 LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aasset\_size%20%3C%2037180450%20LIMIT%205) |
| YES | WHERE: Lower than or equal filtering | [SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:asset\_size <= 37180450 LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aasset\_size%20%3C%3D%2037180450%20LIMIT%205) |
| **NO** | **WHERE: Conjunction (AND) filtering** | **[SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:asset\_size <= 37180450 AND system:time\_start > 1572739200000 LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aasset\_size%20%3C%3D%2037180450%20AND%20system%3Atime\_start%20%3E%201572739200000%20LIMIT%205)** |
| **NO** | **WHERE: Disjunction (OR) filtering** | **[SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:asset\_size <= 37180450 OR system:time\_start > 1572739200000 LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aasset\_size%20%3C%3D%2037180450%20OR%20system%3Atime\_start%20%3E%201572739200000%20LIMIT%205)** |
| **NO** | **WHERE: BETWEEN filtering** | **[SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:asset\_size BETWEEN 36975655 AND 37180450 LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aasset\_size%20BETWEEN%2036975655%20AND%2037180450%20LIMIT%205)** |
| **NO** | **WHERE: LIKE filtering** | **[SELECT \* FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index WHERE system:index LIKE 'foo\_024\_vegetation\_health\_index%' LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20\*%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20WHERE%20system%3Aindex%20LIKE%20'foo\_024\_vegetation\_health\_index%25'%20LIMIT%205)** |
| **NO** | **GROUP BY: Group results by a single column** | **[SELECT system:index FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index GROUP BY system:index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20GROUP%20BY%20system%3Aindex%20LIMIT%205)** |
| **NO** | **GROUP BY: Group results by multiple columns** | **[SELECT system:index, system:asset\_size FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index GROUP BY system:index, system:asset\_size LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%2C%20system%3Aasset\_size%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20GROUP%20BY%20system%3Aindex%2C%20system%3Aasset\_size%20LIMIT%205)** |
| **NO** | **GROUP BY: Aggregate functions used with GROUP BY statements** | **[SELECT system:index, COUNT(\*) as count FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index GROUP BY system:index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%2C%20COUNT(\*)%20as%20count%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20GROUP%20BY%20system%3Aindex%20LIMIT%205)** |
| **NO** | **GROUP BY: Special grouping by range function** | **[SELECT count(\*) FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index GROUP BY range(system:asset\_size, 0,1,2,3,4) LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20count(\*)%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20GROUP%20BY%20range(system%3Aasset\_size%2C%200%2C1%2C2%2C3%2C4)%20LIMIT%205)** |
| **NO** | **ORDER BY: Ordering results by one column** | **[SELECT system:index FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index ORDER BY system:index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20ORDER%20BY%20system%3Aindex%20LIMIT%205)** |
| **NO** | **ORDER BY: Ordering results by one column descending** | **[SELECT system:index FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index ORDER BY system:index DESC LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20ORDER%20BY%20system%3Aindex%20DESC%20LIMIT%205)** |
| **NO** | **ORDER BY: Ordering results by multiple column** | **[SELECT system:index, system:asset\_size FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index ORDER BY system:index, system:asset\_size LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%2C%20system%3Aasset\_size%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20ORDER%20BY%20system%3Aindex%2C%20system%3Aasset\_size%20LIMIT%205)** |
| **NO** | **ORDER BY: Ordering results by multiple column descending** | **[SELECT system:index, system:asset\_size FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index ORDER BY system:index, system:asset\_size DESC LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%2C%20system%3Aasset\_size%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20ORDER%20BY%20system%3Aindex%2C%20system%3Aasset\_size%20DESC%20LIMIT%205)** |
| YES | LIMIT: Limit the number of returned results | [SELECT system:index FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205) |
| YES | OFFSET: Offset the returned results | [SELECT system:index FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5 OFFSET 10](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205%20OFFSET%2010) |
| **NO** | **OFFSET: Offset the returned results using short syntax** | **[SELECT system:index FROM users/resourcewatch\_wri/foo\_024\_vegetation\_health\_index LIMIT 5, 10](https://api.resourcewatch.org/v1/query/c12446ce-174f-4ffb-b2f7-77ecb0116aba?sql=SELECT%20system%3Aindex%20FROM%20users%2Fresourcewatch\_wri%2Ffoo\_024\_vegetation\_health\_index%20LIMIT%205%2C%2010)** |

*Note: This table was generated automatically with the help of [this repository](https://github.com/resource-watch/sql-compatibility-test). If you are maintaining the docs, please do not edit manually these tables.*

### Document-based datasets

This section describes the SQL support for querying datasets with connector type `document` and providers `csv`, `tsv`, `json` or `xml`.

While the API has it's own query handling mechanism, it mostly relies on [Opendistro for Elasticsearch 1.x SQL support](https://opendistro.github.io/for-elasticsearch-docs/docs/sql/), meaning its limitations will also apply to queries done to document-based datasets.

| Supported | Feature | Example URL |
|-----------|---------|-------------|
| YES | SELECT: Selecting all columns using wildcard | [SELECT \* FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Count all rows | [SELECT count(\*) FROM data](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20count(\*)%20FROM%20data) |
| YES | SELECT: Selecting specific columns | [SELECT bra\_biome\_\_name, alert\_\_count FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20alert\_\_count%20FROM%20data%20LIMIT%205) |
| **NO** | **SELECT: Selecting DISTINCT values for specific columns** | **[SELECT DISTINCT(bra\_biome\_\_name) FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20DISTINCT(bra\_biome\_\_name)%20FROM%20data%20LIMIT%205)** |
| YES | SELECT: Selecting columns AND counting all rows | [SELECT bra\_biome\_\_name, count(\*) FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20count(\*)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Aliasing aggregate function results such as AVG in SELECT | [SELECT AVG(alert\_\_count) as alias FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20AVG(alert\_\_count)%20as%20alias%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (AVG) in SELECT | [SELECT AVG(alert\_\_count) FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20AVG(alert\_\_count)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MAX) in SELECT | [SELECT MAX(alert\_\_count) FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20MAX(alert\_\_count)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MIN) in SELECT | [SELECT MIN(alert\_\_count) FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20MIN(alert\_\_count)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (SUM) in SELECT | [SELECT SUM(alert\_\_count) FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20SUM(alert\_\_count)%20FROM%20data%20LIMIT%205) |
| YES | FROM: Using dataset id in FROM statement | [SELECT \* FROM 9be3bf63-97fc-4bb0-b913-775ccae3cf9e LIMIT 5](https://api.resourcewatch.org/v1/query?sql=SELECT%20\*%20FROM%209be3bf63-97fc-4bb0-b913-775ccae3cf9e%20LIMIT%205) |
| YES | FROM: Using dataset slug in FROM statement | [SELECT \* FROM Glad-Alerts-Daily-Geostore-User-Areas\_3 LIMIT 5](https://api.resourcewatch.org/v1/query?sql=SELECT%20\*%20FROM%20Glad-Alerts-Daily-Geostore-User-Areas\_3%20LIMIT%205) |
| YES | FROM: Using dataset tableName in FROM statement | [SELECT \* FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20LIMIT%205) |
| YES | WHERE: Greater than filtering | [SELECT \* FROM data WHERE alert\_\_count > 2 LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3E%202%20LIMIT%205) |
| YES | WHERE: Greater than or equal filtering | [SELECT \* FROM data WHERE alert\_\_count >= 2 LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3E%3D%202%20LIMIT%205) |
| YES | WHERE: Equality filtering | [SELECT \* FROM data WHERE alert\_\_count = 5 LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3D%205%20LIMIT%205) |
| YES | WHERE: Lower than filtering | [SELECT \* FROM data WHERE alert\_\_count < 8 LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3C%208%20LIMIT%205) |
| YES | WHERE: Lower than or equal filtering | [SELECT \* FROM data WHERE alert\_\_count <= 8 LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3C%3D%208%20LIMIT%205) |
| YES | WHERE: Conjunction (AND) filtering | [SELECT \* FROM data WHERE alert\_\_count <= 8 AND alert\_area\_\_ha > 0.1 LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3C%3D%208%20AND%20alert\_area\_\_ha%20%3E%200.1%20LIMIT%205) |
| YES | WHERE: Disjunction (OR) filtering | [SELECT \* FROM data WHERE alert\_\_count <= 8 OR alert\_area\_\_ha > 0.1 LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3C%3D%208%20OR%20alert\_area\_\_ha%20%3E%200.1%20LIMIT%205) |
| YES | WHERE: BETWEEN filtering | [SELECT \* FROM data WHERE alert\_\_count BETWEEN 2 AND 8 LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20BETWEEN%202%20AND%208%20LIMIT%205) |
| **NO** | **WHERE: LIKE filtering** | **[SELECT \* FROM data WHERE bra\_biome\_\_name LIKE 'Amaz%' LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20bra\_biome\_\_name%20LIKE%20'Amaz%25'%20LIMIT%205)** |
| YES | GROUP BY: Group results by a single column | [SELECT bra\_biome\_\_name FROM data GROUP BY bra\_biome\_\_name LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20GROUP%20BY%20bra\_biome\_\_name%20LIMIT%205) |
| YES | GROUP BY: Group results by multiple columns | [SELECT bra\_biome\_\_name, alert\_\_count FROM data GROUP BY bra\_biome\_\_name, alert\_\_count LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20alert\_\_count%20FROM%20data%20GROUP%20BY%20bra\_biome\_\_name%2C%20alert\_\_count%20LIMIT%205) |
| YES | GROUP BY: Aggregate functions used with GROUP BY statements | [SELECT bra\_biome\_\_name, COUNT(\*) as count FROM data GROUP BY bra\_biome\_\_name LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20COUNT(\*)%20as%20count%20FROM%20data%20GROUP%20BY%20bra\_biome\_\_name%20LIMIT%205) |
| YES | GROUP BY: Special grouping by range function | [SELECT count(\*) FROM data GROUP BY range(alert\_\_count, 0,1,2,3,4) LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20count(\*)%20FROM%20data%20GROUP%20BY%20range(alert\_\_count%2C%200%2C1%2C2%2C3%2C4)%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column | [SELECT bra\_biome\_\_name FROM data ORDER BY bra\_biome\_\_name LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20ORDER%20BY%20bra\_biome\_\_name%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column descending | [SELECT bra\_biome\_\_name FROM data ORDER BY bra\_biome\_\_name DESC LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20ORDER%20BY%20bra\_biome\_\_name%20DESC%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column | [SELECT bra\_biome\_\_name, alert\_\_count FROM data ORDER BY bra\_biome\_\_name, alert\_\_count LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20alert\_\_count%20FROM%20data%20ORDER%20BY%20bra\_biome\_\_name%2C%20alert\_\_count%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column descending | [SELECT bra\_biome\_\_name, alert\_\_count FROM data ORDER BY bra\_biome\_\_name, alert\_\_count DESC LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20alert\_\_count%20FROM%20data%20ORDER%20BY%20bra\_biome\_\_name%2C%20alert\_\_count%20DESC%20LIMIT%205) |
| YES | LIMIT: Limit the number of returned results | [SELECT bra\_biome\_\_name FROM data LIMIT 5](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20LIMIT%205) |
| YES | OFFSET: Offset the returned results | [SELECT bra\_biome\_\_name FROM data LIMIT 5 OFFSET 10](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20LIMIT%205%20OFFSET%2010) |
| **NO** | **OFFSET: Offset the returned results using short syntax** | **[SELECT bra\_biome\_\_name FROM data LIMIT 5, 10](https://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20LIMIT%205%2C%2010)** |

*Note: This table was generated automatically with the help of [this repository](https://github.com/resource-watch/sql-compatibility-test). If you are maintaining the docs, please do not edit manually these tables.*

#### Troubleshooting SQL queries for document-based datasets

This SQL syntax supported when running queries for document-based datasets has some known limitations:

- Very large SQL queries may run into some parsing issues.
- Sorting by aggregated fields is not supported. For instance, the following statement is **not** supported: `GROUP BY age ORDER BY COUNT(*)`.
- Using aggregation functions on top of scalar functions is also not possible. For instance, the following statement is **not** supported: `SELECT MAX(abs(age))`.
- Sub-queries are only supported to a small degree, but the usage of `GROUP BY` or `HAVING` in the sub-query is not supported. For instance, the following statement **is** supported: `SELECT * FROM (SELECT first_name, last_name FROM emp WHERE last_name NOT LIKE '%a%') WHERE first_name LIKE 'A%' ORDER BY 1`, but statements with a higher level of complexity than applying simple conditions or orderings in the sub-query might not be supported.
- The usage of scalar functions on nested fields in `ORDER BY` or `WHERE` clauses is limited. For instance, the following statement is **not** supported: `ORDER BY YEAR(dep.start_date)`.

You can read more about the limitations of using SQL with document-based datasets [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-limitations.html).

### Rasdaman datasets

SQL-like queries can be employed for accessing data stored in Rasdaman datasets. Subsets on the original axes of the data may be provided in the WHERE statement. So far, only operations that result in a single scalar can be obtained from Rasdaman - averages, minimums, maximums.

```shell
curl -XGET 'https://api.resourcewatch.org/v1/query?sql=SELECT avg(Green) from 18c0b71d-2f55-4a45-9e5b-c35db3ebfe94 where Lat > 0 and  Lat < 45' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>'
```

### NEX-GDDP and Loca datasets

> Example of a query for a NEX-GDDP/Loca dataset, providing lat and lon as query parameters:

```shell
curl -X GET 'https://api.resourcewatch.org/v1/query/aaadd6c3-93ea-44bc-ba8b-7af3f40d39e1?sql=SELECT * FROM data&lat=30&lon=9'
```

> Example of a query for a NEX-GDDP/Loca dataset, providing a geostore id:

```shell
curl -X GET 'https://api.resourcewatch.org/v1/query/aaadd6c3-93ea-44bc-ba8b-7af3f40d39e1?sql=SELECT * FROM data&geostore=972c24e1da2c2baacc7572ee9501abdc'
```

> Example response:

```json
{
  "data": [
    {
      "tasmin": 243.6352,
      "tasmin_q25": 243.4849,
      "tasmin_q75": 243.8861,
      "year": "1971-01-01T00:00:00-01:00"
    },
    {
      "tasmin": 244.0795,
      "tasmin_q25": 243.7174,
      "tasmin_q75": 244.3168,
      "year": "1981-01-01T00:00:00-01:00"
    },
    {
      "tasmin": 244.4218,
      "tasmin_q25": 243.9681,
      "tasmin_q75": 244.5883,
      "year": "1991-01-01T00:00:00-01:00"
    },
    {
      "tasmin": 244.697,
      "tasmin_q25": 244.2883,
      "tasmin_q75": 244.8852,
      "year": "2001-01-01T00:00:00-01:00"
    },
    {
      "tasmin": 244.7719,
      "tasmin_q25": 244.3449,
      "tasmin_q75": 245.0115,
      "year": "2011-01-01T00:00:00-01:00"
    }
  ]
}
```

Like with the other supported providers, you can use a SQL-like syntax to query datasets stored both in NASA NEX-GDDP or in Loca. However, these datasets always contain geo-referenced data, and so they expect that you always provide either a `lat` + `lon` pair, or a `geostore` id, in order to filter the returned data. If you don't provide either a geostore id or a lat+lon pair, the request will fail with status code `400 Bad Request`, with the following message: `No coordinates provided. Include geostore or lat & lon`.

The examples on the side allow you to understand how you can provide either the `geostore` id or the `lat` + `lon` combination.

### WMS datasets

Queries to WMS datasets are no longer supported.
