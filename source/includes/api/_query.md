# Query

In order to retrieve data from datasets, you can send queries to the API using a syntax very similar to SQL. Using these endpoints, you can also download the results of a particular query. If you are new to the RW API, or want to learn more about the concept of a querying datasets, we strongly encourage you to read the [query concept](#query) documentation first. It gives you a brief and clear description of what a query is, and what it is useful for.

*Please note that some SQL features might not be supported. Check [here](/index-rw.html#supported-sql-syntax-reference) for a reference of the SQL features' support for each dataset provider.*

## Querying datasets

> GET request for a query providing the SQL as query param:

```shell
curl -i -X GET 'http://api.resourcewatch.org/v1/query/098b33df-6871-4e53-a5ff-b56a7d989f9a?sql=SELECT cartodb_id, iso, name_0, name_1, type_1 FROM gadm28_adm1 limit 10'
```

> The same query executed as a POST request providing the SQL as request body param:

```shell
curl -i -X POST 'http://api.resourcewatch.org/v1/query/098b33df-6871-4e53-a5ff-b56a7d989f9a/' \
-H 'Content-Type: application/json' \
-d '{
    "sql": "SELECT cartodb_id, iso, name_0, name_1, type_1 FROM gadm28_adm1 limit 10"
}'
```

To execute a query over a dataset's data, you can either perform a GET request providing the SQL query as query param, or a POST request providing the SQL query in the request body.

Both GET and POST query endpoints expect **the id of the dataset being queried to be provided as part of the path**. This id can be omitted when querying datasets of certain providers (e.g. document-based datasets).

| Method | Endpoint | Notes |
|-------|------|-------------|
| GET   | `http://api.resourcewatch.org/v1/query/:datasetId?sql=<sql-statement>` | Default way of querying datasets.
| GET   | `http://api.resourcewatch.org/v1/query?sql=<sql-statement>` | This way of querying datasets is only supported by some providers (e.g. document-based datasets).
| POST  | `http://api.resourcewatch.org/v1/query/:datasetId` | The SQL statement should be provided in the body of the request.
| POST  | `http://api.resourcewatch.org/v1/query` | The SQL statement should be provided in the body of the request. This way of querying datasets is only supported by some providers (e.g. document-based datasets).

Note: The `FROM` clause of the SQL query being executed must also reference the dataset being queried. This reference should be done by providing the `dataset.tableName` field as the table being queried in the `FROM` clause. For some dataset providers (e.g. document-based datasets), you can provide instead the dataset id (`dataset.id`) or the dataset slug (`dataset.slug`) as the table being queried in the FROM clause.

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
| data  | Array | Array of objects that correspond to the result of the query execution. The data structure varies according to the dataset being queried.
| meta  | Object | Object with metadata regarding the query executed.
| meta.cloneUrl | Object | Object with information for creating a new dataset from the current query execution.
| meta.cloneUrl.httpMethod | String | The HTTP method that should be used for the request to create a new dataset from the current query execution.
| meta.cloneUrl.url | String | The API endpoint path that should be used for the request to create a new dataset from the current query execution.
| meta.cloneUrl.body | Object | The body request data that should be provided for creating a new dataset from the current query execution.

### Query execution errors

Calling the query endpoint might sometimes result in an error being returned. The following table describes the possible errors that can occur when querying datasets:

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | SQL o FS required | The required `sql` field is missing either as query string parameter or in the request body.
500            | Internal server error | The error message might vary in this case.

## Download

> Requesting the download of a query providing the dataset ID in the URL:

```shell
curl -X GET 'https://api.resourcewatch.org/v1/download/<dataset.id>?sql=SELECT * from <dataset.tableName>'
```

> Requesting the download of a query providing the dataset ID in the FROM clause of the query:

```shell
curl -X GET 'https://api.resourcewatch.org/v1/download?sql=SELECT * from <dataset.id>'
```

> Explicitly setting the format of the returned file:

```shell
curl -X GET 'https://api.resourcewatch.org/v1/download?sql=SELECT * from <dataset.id>&format=json'
curl -X GET 'https://api.resourcewatch.org/v1/download?sql=SELECT * from <dataset.id>&format=csv'
```

Download endpoints expect **the id of the dataset being queried to be provided as part of the path**. This id can be omitted when downloading query results of datasets of certain providers (e.g. document-based datasets).

| Method | Endpoint | Notes |
|-------|------|-------------|
| GET   | `http://api.resourcewatch.org/v1/download/:datasetId?sql=<sql-statement>` | Default way of downloading query results.
| GET   | `http://api.resourcewatch.org/v1/download?sql=<sql-statement>` | This way of downloading query results is only supported by some providers (e.g. document-based datasets).

Note: The `FROM` clause of the SQL query being executed must also reference the dataset being queried. This reference should be done by providing the `dataset.tableName` field as the table being queried in the `FROM` clause. For some dataset providers (e.g. document-based datasets), you can provide instead the dataset id (`dataset.id`) or the dataset slug (`dataset.slug`) as the table being queried in the FROM clause.

You can also specify which file type you want to download (JSON or CSV) by using the `format` query parameter (except for Google Earth Engine datasets, which only support downloading as JSON). By default, the API will return a CSV file (or a JSON file for Google Earth Engine).

**Please not that not all dataset providers support downloading queries - the following providers support downloading query results:**

* Google Earth Engine
* Document
* Carto
* BigQuery
* ArcGIS FeatureService

### Download response body

The response body will contain the data to be downloaded. In the case of the format `json`, the returned result will be a JSON object with the results of the execution of the query provided. In the case of format `csv`, the body of the response will contain the actual CSV data corresponding to the results of the execution of the query provided.

### Download execution errors

Calling the download endpoint might sometimes result in an error being returned. The following table describes the possible errors that can occur when downloading query results:

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | SQL o FS required | The required `sql` field is missing either as query string parameter or in the request body.
500            | Internal server error | The error message might vary in this case.

## Supported SQL syntax reference

### CartoDB datasets

This section describes the SQL support for querying datasets with provider `cartodb`.

| Supported | Feature | Example URL |
|-----------|---------|-------------|
| YES | SELECT: Selecting all columns using wildcard | [SELECT \* FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Count all rows | [SELECT count(\*) FROM edi](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20count(\*)%20FROM%20edi) |
| YES | SELECT: Selecting specific columns | [SELECT region, overall\_score FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20overall\_score%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Selecting DISTINCT values for specific columns | [SELECT DISTINCT(region) FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20DISTINCT(region)%20FROM%20edi%20LIMIT%205) |
| NO | SELECT: Selecting columns AND counting all rows | [SELECT region, count(\*) FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20count(\*)%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Aliasing aggregate function results such as AVG in SELECT | [SELECT AVG(overall\_score) as alias FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20AVG(overall\_score)%20as%20alias%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (AVG) in SELECT | [SELECT AVG(overall\_score) FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20AVG(overall\_score)%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MAX) in SELECT | [SELECT MAX(overall\_score) FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20MAX(overall\_score)%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MIN) in SELECT | [SELECT MIN(overall\_score) FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20MIN(overall\_score)%20FROM%20edi%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (SUM) in SELECT | [SELECT SUM(overall\_score) FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20SUM(overall\_score)%20FROM%20edi%20LIMIT%205) |
| NO | FROM: Using dataset id in FROM statement | [SELECT \* FROM 0b9f0100-ce5b-430f-ad8f-3363efa05481 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%200b9f0100-ce5b-430f-ad8f-3363efa05481%20LIMIT%205) |
| NO | FROM: Using dataset slug in FROM statement | [SELECT \* FROM Environmental-Democracy-Index-1490086842552 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20Environmental-Democracy-Index-1490086842552%20LIMIT%205) |
| YES | FROM: Using dataset tableName in FROM statement | [SELECT \* FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20LIMIT%205) |
| YES | WHERE: Greater than filtering | [SELECT \* FROM edi WHERE overall\_score > 2 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3E%202%20LIMIT%205) |
| YES | WHERE: Greater than or equal filtering | [SELECT \* FROM edi WHERE overall\_score >= 2 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3E%3D%202%20LIMIT%205) |
| YES | WHERE: Equality filtering | [SELECT \* FROM edi WHERE overall\_score = 2.1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3D%202.1%20LIMIT%205) |
| YES | WHERE: Lower than filtering | [SELECT \* FROM edi WHERE overall\_score < 2.2 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3C%202.2%20LIMIT%205) |
| YES | WHERE: Lower than or equal filtering | [SELECT \* FROM edi WHERE overall\_score <= 2.2 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3C%3D%202.2%20LIMIT%205) |
| YES | WHERE: Conjunction (AND) filtering | [SELECT \* FROM edi WHERE overall\_score <= 2.2 AND justice\_pillar\_score > 1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3C%3D%202.2%20AND%20justice\_pillar\_score%20%3E%201%20LIMIT%205) |
| YES | WHERE: Disjunction (OR) filtering | [SELECT \* FROM edi WHERE overall\_score <= 2.2 OR justice\_pillar\_score > 1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20%3C%3D%202.2%20OR%20justice\_pillar\_score%20%3E%201%20LIMIT%205) |
| YES | WHERE: BETWEEN filtering | [SELECT \* FROM edi WHERE overall\_score BETWEEN 2 AND 2.2 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20overall\_score%20BETWEEN%202%20AND%202.2%20LIMIT%205) |
| YES | WHERE: LIKE filtering | [SELECT \* FROM edi WHERE region LIKE 'Europ%' LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20\*%20FROM%20edi%20WHERE%20region%20LIKE%20'Europ%25'%20LIMIT%205) |
| YES | GROUP BY: Group results by a single column | [SELECT region FROM edi GROUP BY region LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20GROUP%20BY%20region%20LIMIT%205) |
| YES | GROUP BY: Group results by multiple columns | [SELECT region, overall\_score FROM edi GROUP BY region, overall\_score LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20overall\_score%20FROM%20edi%20GROUP%20BY%20region%2C%20overall\_score%20LIMIT%205) |
| YES | GROUP BY: Aggregate functions used with GROUP BY statements | [SELECT region, COUNT(\*) as count FROM edi GROUP BY region LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20COUNT(\*)%20as%20count%20FROM%20edi%20GROUP%20BY%20region%20LIMIT%205) |
| NO | GROUP BY: Special grouping by range function | [SELECT count(\*) FROM edi GROUP BY range(overall\_score, 0,1,2,3,4) LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20count(\*)%20FROM%20edi%20GROUP%20BY%20range(overall\_score%2C%200%2C1%2C2%2C3%2C4)%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column | [SELECT region FROM edi ORDER BY region LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20ORDER%20BY%20region%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column descending | [SELECT region FROM edi ORDER BY region DESC LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20ORDER%20BY%20region%20DESC%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column | [SELECT region, overall\_score FROM edi ORDER BY region, overall\_score LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20overall\_score%20FROM%20edi%20ORDER%20BY%20region%2C%20overall\_score%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column descending | [SELECT region, overall\_score FROM edi ORDER BY region, overall\_score DESC LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20overall\_score%20FROM%20edi%20ORDER%20BY%20region%2C%20overall\_score%20DESC%20LIMIT%205) |
| YES | LIMIT: Limit the number of returned results | [SELECT region FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20LIMIT%205) |
| NO | OFFSET: Offset the returned results | [SELECT region FROM edi LIMIT 5 OFFSET 10](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20LIMIT%205%20OFFSET%2010) |
| NO | OFFSET: Offset the returned results using short syntax | [SELECT region FROM edi LIMIT 5, 10](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%20FROM%20edi%20LIMIT%205%2C%2010) |

*Note: This table was generated automatically with the help of [this repository](https://github.com/resource-watch/sql-compatibility-test). If you are maintaining the docs, please do not edit manually these tables.*

### Document-based datasets

This section describes the SQL support for querying datasets with connector type `document` and providers `csv`, `tsv`, `json` or `xml`.

| Supported | Feature | Example URL |
|-----------|---------|-------------|
| YES | SELECT: Selecting all columns using wildcard | [SELECT \* FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Count all rows | [SELECT count(\*) FROM data](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20count(\*)%20FROM%20data) |
| YES | SELECT: Selecting specific columns | [SELECT bra\_biome\_\_name, alert\_\_count FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20alert\_\_count%20FROM%20data%20LIMIT%205) |
| NO | SELECT: Selecting DISTINCT values for specific columns | [SELECT DISTINCT(bra\_biome\_\_name) FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20DISTINCT(bra\_biome\_\_name)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Selecting columns AND counting all rows | [SELECT bra\_biome\_\_name, count(\*) FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20count(\*)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Aliasing aggregate function results such as AVG in SELECT | [SELECT AVG(alert\_\_count) as alias FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20AVG(alert\_\_count)%20as%20alias%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (AVG) in SELECT | [SELECT AVG(alert\_\_count) FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20AVG(alert\_\_count)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MAX) in SELECT | [SELECT MAX(alert\_\_count) FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20MAX(alert\_\_count)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (MIN) in SELECT | [SELECT MIN(alert\_\_count) FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20MIN(alert\_\_count)%20FROM%20data%20LIMIT%205) |
| YES | SELECT: Usage of aggregate functions (SUM) in SELECT | [SELECT SUM(alert\_\_count) FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20SUM(alert\_\_count)%20FROM%20data%20LIMIT%205) |
| YES | FROM: Using dataset id in FROM statement | [SELECT \* FROM 9be3bf63-97fc-4bb0-b913-775ccae3cf9e LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%209be3bf63-97fc-4bb0-b913-775ccae3cf9e%20LIMIT%205) |
| YES | FROM: Using dataset slug in FROM statement | [SELECT \* FROM Glad-Alerts-Daily-Geostore-User-Areas\_3 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20Glad-Alerts-Daily-Geostore-User-Areas\_3%20LIMIT%205) |
| YES | FROM: Using dataset tableName in FROM statement | [SELECT \* FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20LIMIT%205) |
| YES | WHERE: Greater than filtering | [SELECT \* FROM data WHERE alert\_\_count > 2 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3E%202%20LIMIT%205) |
| YES | WHERE: Greater than or equal filtering | [SELECT \* FROM data WHERE alert\_\_count >= 2 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3E%3D%202%20LIMIT%205) |
| YES | WHERE: Equality filtering | [SELECT \* FROM data WHERE alert\_\_count = 5 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3D%205%20LIMIT%205) |
| YES | WHERE: Lower than filtering | [SELECT \* FROM data WHERE alert\_\_count < 8 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3C%208%20LIMIT%205) |
| YES | WHERE: Lower than or equal filtering | [SELECT \* FROM data WHERE alert\_\_count <= 8 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3C%3D%208%20LIMIT%205) |
| YES | WHERE: Conjunction (AND) filtering | [SELECT \* FROM data WHERE alert\_\_count <= 8 AND alert\_area\_\_ha > 0.1 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3C%3D%208%20AND%20alert\_area\_\_ha%20%3E%200.1%20LIMIT%205) |
| YES | WHERE: Disjunction (OR) filtering | [SELECT \* FROM data WHERE alert\_\_count <= 8 OR alert\_area\_\_ha > 0.1 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20%3C%3D%208%20OR%20alert\_area\_\_ha%20%3E%200.1%20LIMIT%205) |
| YES | WHERE: BETWEEN filtering | [SELECT \* FROM data WHERE alert\_\_count BETWEEN 2 AND 8 LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20alert\_\_count%20BETWEEN%202%20AND%208%20LIMIT%205) |
| NO | WHERE: LIKE filtering | [SELECT \* FROM data WHERE bra\_biome\_\_name LIKE 'Amaz%' LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20\*%20FROM%20data%20WHERE%20bra\_biome\_\_name%20LIKE%20'Amaz%25'%20LIMIT%205) |
| YES | GROUP BY: Group results by a single column | [SELECT bra\_biome\_\_name FROM data GROUP BY bra\_biome\_\_name LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20GROUP%20BY%20bra\_biome\_\_name%20LIMIT%205) |
| YES | GROUP BY: Group results by multiple columns | [SELECT bra\_biome\_\_name, alert\_\_count FROM data GROUP BY bra\_biome\_\_name, alert\_\_count LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20alert\_\_count%20FROM%20data%20GROUP%20BY%20bra\_biome\_\_name%2C%20alert\_\_count%20LIMIT%205) |
| YES | GROUP BY: Aggregate functions used with GROUP BY statements | [SELECT bra\_biome\_\_name, COUNT(\*) as count FROM data GROUP BY bra\_biome\_\_name LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20COUNT(\*)%20as%20count%20FROM%20data%20GROUP%20BY%20bra\_biome\_\_name%20LIMIT%205) |
| YES | GROUP BY: Special grouping by range function | [SELECT count(\*) FROM data GROUP BY range(alert\_\_count, 0,1,2,3,4) LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20count(\*)%20FROM%20data%20GROUP%20BY%20range(alert\_\_count%2C%200%2C1%2C2%2C3%2C4)%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column | [SELECT bra\_biome\_\_name FROM data ORDER BY bra\_biome\_\_name LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20ORDER%20BY%20bra\_biome\_\_name%20LIMIT%205) |
| YES | ORDER BY: Ordering results by one column descending | [SELECT bra\_biome\_\_name FROM data ORDER BY bra\_biome\_\_name DESC LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20ORDER%20BY%20bra\_biome\_\_name%20DESC%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column | [SELECT bra\_biome\_\_name, alert\_\_count FROM data ORDER BY bra\_biome\_\_name, alert\_\_count LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20alert\_\_count%20FROM%20data%20ORDER%20BY%20bra\_biome\_\_name%2C%20alert\_\_count%20LIMIT%205) |
| YES | ORDER BY: Ordering results by multiple column descending | [SELECT bra\_biome\_\_name, alert\_\_count FROM data ORDER BY bra\_biome\_\_name, alert\_\_count DESC LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%2C%20alert\_\_count%20FROM%20data%20ORDER%20BY%20bra\_biome\_\_name%2C%20alert\_\_count%20DESC%20LIMIT%205) |
| YES | LIMIT: Limit the number of returned results | [SELECT bra\_biome\_\_name FROM data LIMIT 5](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20LIMIT%205) |
| YES | OFFSET: Offset the returned results | [SELECT bra\_biome\_\_name FROM data LIMIT 5 OFFSET 10](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20LIMIT%205%20OFFSET%2010) |
| NO | OFFSET: Offset the returned results using short syntax | [SELECT bra\_biome\_\_name FROM data LIMIT 5, 10](http://api.resourcewatch.org/v1/query/9be3bf63-97fc-4bb0-b913-775ccae3cf9e?sql=SELECT%20bra\_biome\_\_name%20FROM%20data%20LIMIT%205%2C%2010) |

*Note: This table was generated automatically with the help of [this repository](https://github.com/resource-watch/sql-compatibility-test). If you are maintaining the docs, please do not edit manually these tables.*

#### Troubleshooting SQL queries for document-based datasets

This SQL syntax supported when running queries for document-based datasets has some known limitations:

* Very large SQL queries may run into some parsing issues.
* Sorting by aggregated fields is not supported. For instance, the following statement is **not** supported: `GROUP BY age ORDER BY COUNT(*)`.
* Using aggregation functions on top of scalar functions is also not possible. For instance, the following statement is **not** supported: `SELECT MAX(abs(age))`.
* Sub-queries are only supported to a small degree, but the usage of `GROUP BY` or `HAVING` in the sub-query is not supported. For instance, the following statement **is** supported: `SELECT * FROM (SELECT first_name, last_name FROM emp WHERE last_name NOT LIKE '%a%') WHERE first_name LIKE 'A%' ORDER BY 1`, but statements with a higher level of complexity than applying simple conditions or orderings in the sub-query might not be supported.
* The usage of scalar functions on nested fields in `ORDER BY` or `WHERE` clauses is limited. For instance, the following statement is **not** supported: `ORDER BY YEAR(dep.start_date)`.

You can read more about the limitations of using SQL with document-based datasets [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-limitations.html).

### Rasdaman datasets

SQL-like queries can be employed for accessing data stored in Rasdaman datasets. Subsets on the original axes of the data may be provided in the WHERE statement. So far, only operations that result in a single scalar can be obtained from Rasdaman - averages, minimums, maximums.

```shell
curl -XGET https://api.resourcewatch.org/v1/query?sql=SELECT avg(Green) from 18c0b71d-2f55-4a45-9e5b-c35db3ebfe94 where Lat > 0 and  Lat < 45 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>'
```

### NEX-GDDP datasets

A SQL wrapper is offered for accessing the NASA NEX-GDDP dataset with sql-like statements. The API stores calculated indexes over the original data, and several views over the data are available. These can be accessed in the following ways:

#### Spatial aggregates over a layer

> Access spatial aggregates over the data by listing all dataset data for a particular year:

```shell
curl -i -XGET 'http://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393?sql=SELECT * from nexgddp-historical-ACCESS1_0-prmaxday where year = 1960'
```

> Access particular aggregates:

```shell
curl -i -XGET 'http://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393?sql=SELECT avg, min from nexgddp-historical-ACCESS1_0-prmaxday where year = 1960'
```

> Calculate statistics for a range of years:

```shell
curl -i -XGET 'http://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393?sql=SELECT * from nexgddp-historical-ACCESS1_0-prmaxday where year between 1960 and 1962'
```

> You can delimit an area of interest by providing a geostore id as a parameter:

```shell
curl -i -XGET 'http://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393?sql=SELECT * from nexgddp-historical-ACCESS1_0-prmaxday where year between 1960 and 1962&geostore=0279093c278a64f4c3348ff63e4cfce0'
```
