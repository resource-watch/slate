# Query

In order to retrieve data from the datasets it is possible to send queries to the API using the SQL or Feature Service languages.

Two different endpoints are provided (under the dataset path and a generic one) and the sql query can be provided via query parameters or in the body of a POST request.

```shell
curl -i -H 'Authorization: Bearer your-token>' -H 'Content-Type: application/json' -XPOST 'http://api.resourcewatch.org/v1/query/<dataset_id>/' -d '{
    "sql": "SELECT * FROM <dataset_id> limit 10"
}
'
```

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query\?sql\=SELECT\ \*\ from\ <dataset.slug>
```

<aside class="notice">
While we aim to make our query interface as broad and transparent as possible, some of the querying options described 
below will not be available for specific dataset providers, depending on this API's implementation or limitations on the
actual data provider's side.
</aside>

## Select clause

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

## From clause

It is possible to refer to a dataset by using its **table name**, **slug** or **id**. 

```sql
SELECT * FROM <dataset.tableName>
SELECT * FROM <dataset.slug>
SELECT * FROM <dataset.id>
```

## Where clause

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

## Group by clause

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

## Order by clause

It is possible to order results by **column name**, **SQL functions** and **PostGIS functions**


## Limit and offset clause

You can specify `limit` and `offset` clauses

```sql
SELECT * FROM table limit=20
SELECT * FROM table limit=20 offset 10
```


## Raster queries available

```sql
SELECT ST_METADATA(rast) FROM table
SELECT ST_BANDMETADATA(rast, occurrence) FROM table
SELECT ST_SUMMARYSTATS() FROM table
SELECT ST_HISTOGRAM(rast, 1, auto, true) FROM table
SELECT ST_valueCount(rast, 1, true) FROM table
```

## Freeze query

It is possible generate a json file in a bucket of the sql result. You only need send a query param freeze with value true and you will obtain the url of the json file.

<aside class="notice">
    This is an authenticated feature!
</aside>

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query\?sql\=SELECT\ \*\ from\ <dataset.slug>&freeze=true
```

## Rasdaman queries

SQL-like queries can be employed for accessing data stored in Rasdaman datasets. Subsets on the original axes of the data may be provided in the WHERE statement. So far, only operations that result in a single scalar can be obtained from Rasdaman - averages, minimums, maximums.

```shell
curl -XGET https://api.resourcewatch.org/v1/query?sql=SELECT avg(Green) from 18c0b71d-2f55-4a45-9e5b-c35db3ebfe94 where Lat > 0 and  Lat < 45 \
	-H 'Content-Type: application/json' \
	-H 'Authorization: Bearer <token>'
```

## NEX-GDDP queries

A SQL wrapper is offered for accessing the NASA NEX-GDDP dataset with sql-like statements. The API stores calculated indexes over the original data, and several views over the data are available. These can be accessed in the following ways:

### Spatial aggregates over a layer

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
