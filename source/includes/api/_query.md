# Query

> Example of GET request for a query providing the SQL as query param:

```shell
curl -i -X GET http\://api.resourcewatch.org/v1/query\?sql\=SELECT\ \*\ from\ <dataset.slug>
```

> Example of POST request for a query providing the SQL as request body param:

```shell
curl -i -X POST 'http://api.resourcewatch.org/v1/query/<dataset_id>/' \
-H 'Content-Type: application/json' \
-d '{
    "sql": "SELECT * FROM <dataset_id> limit 10"
}'
```

In order to retrieve data from datasets, you can send queries to the API using a syntax very similar to SQL. Using these endpoints, you can also download the results of a particular query.

*Please note that some SQL features might not be supported. Check [here](/index-rw.html#limitations-of-sql-syntax) for a comprehensive list of the SQL features that are not supported.*

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
        {
            "cartodb_id": 1117,
            "iso": "HND",
            "name_0": "Honduras",
            "name_1": "Atlántida",
            "type_1": "Departamento"
        },
        {
            "cartodb_id": 1119,
            "iso": "HND",
            "name_0": "Honduras",
            "name_1": "Colón",
            "type_1": "Departamento"
        },
        {
            "cartodb_id": 1105,
            "iso": "GUY",
            "name_0": "Guyana",
            "name_1": "Upper Demerara-Berbice",
            "type_1": "Region"
        },
        {
            "cartodb_id": 1125,
            "iso": "HND",
            "name_0": "Honduras",
            "name_1": "Gracias a Dios",
            "type_1": "Departamento"
        },
        {
            "cartodb_id": 1101,
            "iso": "GUY",
            "name_0": "Guyana",
            "name_1": "Essequibo Islands-West Demerara",
            "type_1": "Region"
        },
        {
            "cartodb_id": 1131,
            "iso": "HND",
            "name_0": "Honduras",
            "name_1": "Olancho",
            "type_1": "Departamento"
        },
        {
            "cartodb_id": 1133,
            "iso": "HND",
            "name_0": "Honduras",
            "name_1": "Valle",
            "type_1": "Departamento"
        },
        {
            "cartodb_id": 2235,
            "iso": "PRY",
            "name_0": "Paraguay",
            "name_1": "Concepción",
            "type_1": "Departamento"
        }
    ],
    "meta": {
        "cloneUrl": {
            "http_method": "POST",
            "url": "/dataset/098b33df-6871-4e53-a5ff-b56a7d989f9a/clone",
            "body": {
                "dataset": {
                    "datasetUrl": "/query/098b33df-6871-4e53-a5ff-b56a7d989f9a?sql=SELECT%20cartodb_id%2C%20iso%2C%20name_0%2C%20name_1%2C%20type_1%20FROM%20gadm28_adm1%20limit%2010",
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

To execute a query over a dataset's data, you can either perform a GET request providing the SQL query as query param, or a POST request providing the SQL query in the request body.

### Errors for querying datasets

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | SQL o FS required | The required `sql` field is missing either as query string parameter or in the request body.

## Download

> Requesting the download of a query providing the dataset ID in the URL:

```shell
curl -X GET https://api.resourcewatch.org/v1/download/<dataset.id>?sql=SELECT * from <dataset.tableName>
```

> Requesting the download of a query providing the dataset ID in the FROM clause of the query:

```shell
curl -X GET https://api.resourcewatch.org/v1/download?sql=SELECT * from <dataset.id>
```

> Explicitly setting the format of the returned file:

```shell
curl -X GET https://api.resourcewatch.org/v1/download?sql=SELECT * from <dataset.id>&format=json
curl -X GET https://api.resourcewatch.org/v1/download?sql=SELECT * from <dataset.id>&format=csv
```

You can download the result of a query using the `download` endpoint. You can either provide the dataset id in the URL or you can pass it as part of the SQL query (in the FROM clause).

You can also specify which file type you want to download (JSON or CSV) - except for Google Earth Engine datasets (which only supports JSON). By default, the API will return a CSV file (or a JSON file for Google Earth Engine).

**Please not that not all dataset providers support downloading queries - the following providers support downloading query results:**

* Google Earth Engine
* Document
* Carto
* BigQuery
* ArcGIS FeatureService

## Limitations of SQL syntax

**While the WRI API aims to make the query interface as broad and transparent as possible, some of the querying options described below will not be available for specific dataset providers, depending on this API's implementation or limitations on the actual data provider's side.**

Additionally to provider-specific limitations, every SQL query is transformed by [the `sql2json` microservice](https://github.com/resource-watch/sql2json), also maintained as [NPM package](https://www.npmjs.com/package/sql2json). There is a first conversion from SQL to JSON, and then from JSON to a SQL syntax that is compatible with [the Elasticsearch SQL plugin](https://github.com/NLPchina/elasticsearch-sql).

This SQL syntax supported by Elasticsearch has some limitations that should be considered when querying datasets:

* Very large SQL queries may run into some parsing issues.
* Sorting by aggregated fields is not supported. For instance, the following statement is **not** supported: `GROUP BY age ORDER BY COUNT(*)`.
* Using aggregation functions on top of scalar functions is also not possible. For instance, the following statement is **not** supported: `SELECT MAX(abs(age))`.
* Sub-queries are only supported to a small degree, but the usage of `GROUP BY` or `HAVING` in the sub-query is not supported. For instance, the following statement **is** supported: `SELECT * FROM (SELECT first_name, last_name FROM emp WHERE last_name NOT LIKE '%a%') WHERE first_name LIKE 'A%' ORDER BY 1`, but statements with a higher level of complexity than applying simple conditions or orderings in the sub-query might not be supported.
* The usage of scalar functions on nested fields in `ORDER BY` or `WHERE` clauses is limited. For instance, the following statement is **not** supported: `ORDER BY YEAR(dep.start_date)`.

You can read more about the limitations of using SQL with Elasticsearch [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-limitations.html).

## Supported SQL syntax reference

## CartoDB datasets

| Supported | Feature | Example URL |
|-----------|---------|-------------|
| Supported | SELECT: Count query | [SELECT count(*) FROM edi](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20count(*)%20FROM%20edi) |
| Supported | SELECT: Wildcard query | [SELECT * FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20LIMIT%205) |
| Supported | WHERE: LIKE filtering | [SELECT * FROM edi WHERE region LIKE 'Europ%' LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20region%20LIKE%20'Europ%25'%20LIMIT%205) |
| Supported | WHERE: BETWEEN filtering | [SELECT * FROM edi WHERE overall_score BETWEEN 1 AND 2 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20overall_score%20BETWEEN%201%20AND%202%20LIMIT%205) |
| Supported | WHERE: Disjunction of filter conditions | [SELECT * FROM edi WHERE overall_score <= 1 OR justice_pillar_score < 1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20overall_score%20%3C%3D%201%20OR%20justice_pillar_score%20%3C%201%20LIMIT%205) |
| Supported | WHERE: Lower than or equal filtering | [SELECT * FROM edi WHERE overall_score <= 1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20overall_score%20%3C%3D%201%20LIMIT%205) |
| Supported | WHERE: Conjunction of filter conditions | [SELECT * FROM edi WHERE overall_score <= 1 AND justice_pillar_score < 1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20overall_score%20%3C%3D%201%20AND%20justice_pillar_score%20%3C%201%20LIMIT%205) |
| Supported | WHERE: Equality filtering | [SELECT * FROM edi WHERE overall_score = 2.1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20overall_score%20%3D%202.1%20LIMIT%205) |
| Supported | WHERE: Lower than filtering | [SELECT * FROM edi WHERE overall_score < 1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20overall_score%20%3C%201%20LIMIT%205) |
| Supported | WHERE: Greater than or equal filtering | [SELECT * FROM edi WHERE overall_score >= 1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20overall_score%20%3E%3D%201%20LIMIT%205) |
| Supported | WHERE: Greater than filtering | [SELECT * FROM edi WHERE overall_score > 1 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20WHERE%20overall_score%20%3E%201%20LIMIT%205) |
| Supported | FROM: Using dataset tableName in FROM statement | [SELECT * FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20edi%20LIMIT%205) |
| **Not supported** | FROM: Using dataset slug in FROM statement | [SELECT * FROM Environmental-Democracy-Index-1490086842552 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%20Environmental-Democracy-Index-1490086842552%20LIMIT%205) |
| **Not supported** | FROM: Using dataset id in FROM statement | [SELECT * FROM 0b9f0100-ce5b-430f-ad8f-3363efa05481 LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20*%20FROM%200b9f0100-ce5b-430f-ad8f-3363efa05481%20LIMIT%205) |
| Supported | SELECT: Aliasing calculated fields such as AVG in SELECT | [SELECT AVG(overall_score) as alias FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20AVG(overall_score)%20as%20alias%20FROM%20edi%20LIMIT%205) |
| Supported | SELECT: Calculated fields such as AVG in SELECT | [SELECT AVG(overall_score) FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20AVG(overall_score)%20FROM%20edi%20LIMIT%205) |
| **Not supported** | SELECT: Projecting columns + counting query | [SELECT region, count(*) FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20count(*)%20FROM%20edi%20LIMIT%205) |
| Supported | SELECT: Projecting specific columns query | [SELECT region, country FROM edi LIMIT 5](http://api.resourcewatch.org/v1/query/0b9f0100-ce5b-430f-ad8f-3363efa05481?sql=SELECT%20region%2C%20country%20FROM%20edi%20LIMIT%205) |

### Select clause

The `SELECT` part of the queries supports naming columns, **alias**, **math operations**, **DISTINCT**, **COUNT**, **SQL functions** and **PostGIS functions**

```sql
SELECT * FROM table
SELECT count(*) FROM table
SELECT a, b FROM table
SELECT a, count(*) FROM table

SELECT sum(int) FROM table
SELECT avg(int) FROM table
SELECT max(int) FROM table
SELECT min(int) FROM table
SELECT min(int) as minimum FROM table

SELECT ST_valueCount(rast, 1, true) FROM table
```

### From clause

It is possible to refer to a dataset by using its **table name**, **slug** or **id**.

```sql
SELECT * FROM <dataset.tableName>
SELECT * FROM <dataset.slug>
SELECT * FROM <dataset.id>
```

### Where clause

```sql
SELECT * FROM table WHERE a > 2
SELECT * FROM table WHERE a = 2
SELECT * FROM table WHERE a < 2
SELECT * FROM table WHERE a >= 2
SELECT * FROM table WHERE a = 2 and b < 2
SELECT * FROM table WHERE text like 'a%'
SELECT * FROM table WHERE st_intersects(st_setsrid(st_geomfromgeojson('{}'), 4326), the_geom)
SELECT * FROM table WHERE data BETWEEN 1 AND 3
```

### Group by clause

It is possible to group results by **column name**, **SQL functions** and **PostGIS functions**.
Special grouping operations are available for document-type datasets (CSV and JSON) - see [this link](https://github.com/NLPchina/elasticsearch-sql/tree/5.5.2.0#beyond-sql) for more info.

```sql
SELECT * FROM tablename GROUP BY columnOne
SELECT * FROM tablename GROUP BY columnOne, columnTwo
SELECT * FROM tablename GROUP BY ST_GeoHash(the_geom_point,8)

SELECT a, count(int) FROM table GROUP BY a
SELECT count(*) FROM tablename GROUP BY ST_GeoHash(the_geom, 8)
```

```sql
/* Only supported in document-type datasets - see https://github.com/NLPchina/elasticsearch-sql/tree/5.5.2.0#beyond-sql for full details */
SELECT COUNT(age) FROM tablename GROUP BY range(age, 20,25,30,35,40)
SELECT online FROM online GROUP BY date_histogram(field='insert_time','interval'='1d')
SELECT online FROM online GROUP BY date_range(field='insert_time','format'='yyyy-MM-dd' ,'2014-08-18','2014-08-17','now-8d','now-7d','now-6d','now')
```

### Order by clause

It is possible to order results by **column name**, **SQL functions** and **PostGIS functions**

### Limit and offset clause

You can specify `limit` and `offset` clauses

```sql
SELECT * FROM table limit=20
SELECT * FROM table limit=20 offset 10
```

### Raster queries available

```sql
SELECT ST_METADATA(rast) FROM table
SELECT ST_BANDMETADATA(rast, occurrence) FROM table
SELECT ST_SUMMARYSTATS() FROM table
SELECT ST_HISTOGRAM(rast, 1, auto, true) FROM table
SELECT ST_valueCount(rast, 1, true) FROM table
```

### Rasdaman queries

SQL-like queries can be employed for accessing data stored in Rasdaman datasets. Subsets on the original axes of the data may be provided in the WHERE statement. So far, only operations that result in a single scalar can be obtained from Rasdaman - averages, minimums, maximums.

```shell
curl -XGET https://api.resourcewatch.org/v1/query?sql=SELECT avg(Green) from 18c0b71d-2f55-4a45-9e5b-c35db3ebfe94 where Lat > 0 and  Lat < 45 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>'
```

### NEX-GDDP queries

A SQL wrapper is offered for accessing the NASA NEX-GDDP dataset with sql-like statements. The API stores calculated indexes over the original data, and several views over the data are available. These can be accessed in the following ways:

#### Spatial aggregates over a layer

Access spatial aggregates over the data by listing all dataset data for a particular year:

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393\?sql\=SELECT\ \*\ from\ nexgddp-historical-ACCESS1_0-prmaxday\ where\ year\ \=\ 1960
```

Access particular aggregates:

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393\?sql\=SELECT\ avg\,\ min\ from\ nexgddp-historical-ACCESS1_0-prmaxday\ where\ year\ \=\ 1960
```

Calculate statistics for a range of years:

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393\?sql\=SELECT\ \*\ from\ nexgddp-historical-ACCESS1_0-prmaxday\ \ where\ year\ between\ 1960\ and\ 1962
```

You can delimit an area of interest by providing a geostore id as a parameter:

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393\?sql\=SELECT\ \*\ from\ nexgddp-historical-ACCESS1_0-prmaxday\ \ where\ year\ between\ 1960\ and\ 1962&geostore\=0279093c278a64f4c3348ff63e4cfce0
```
