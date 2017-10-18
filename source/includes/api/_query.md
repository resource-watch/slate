# Query

In order to retrieve data from the datasets it is possible to send queries to the API using the SQL or Feature Service languages.

It is possible to refer to the dataset using its table name, its slug or just its id. Two different endpoints are provided (under the dataset path and a generic one) and the sql query can be provided via query parameters or in the body of a POST request.

```shell
curl -i -H 'Authorization: Bearer your-token>' -H 'Content-Type: application/json' -XPOST 'http://api.resourcewatch.org/v1/query/<dataset_id>/' -d '{
    "sql": "select * from <dataset_id> limit 10"
}
'
```

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query\?sql\=select\ \*\ from\ <dataset.slug>
```

```
## Some query examples

### Select and aggregations

select * from table
select count(*) from table
select a, b from table
select a, count(*) from table

### Functions and alias

select sum(int) from table
select avg(int) from table
select max(int) from table
select min(int) from table
select min(int) as minimum from table

select * from table limit=20
select a as b from table limit=20

### Where conditionals

select * from table where a > 2
select * from table where a = 2
select * from table where a < 2
select * from table where a >= 2
select * from table where a = 2 and b < 2
select * from table where text like ‘a%’
Select * from table where st_intersects(st_setsrid(st_geomfromgeojson(‘{}’), 4326), the_geom)

### Group by

select a, count(int) from table group by a
select count(*) FROM tablename group by ST_GeoHash(the_geom, 8)

### Raster queries available

SELECT ST_METADATA(rast) from table
SELECT ST_BANDMETADATA(rast, occurrence) from table
SELECT ST_SUMMARYSTATS() from table
SELECT ST_HISTOGRAM(rast, 1, auto, true) from table
SELECT ST_valueCount(rast, 1, true) from table
```

## Rasdaman queries

SQL-like queries can be employed for accessing data stored in Rasdaman datasets. Subsets on the original axes of the data may be provided in the WHERE statement. So far, only operations that result in a single scalar can be obtained from Rasdaman - averages, minimums, maximums.

```shell
curl -XGET https://api.resourcewatch.org/v1/query?sql=select avg(Green) from 18c0b71d-2f55-4a45-9e5b-c35db3ebfe94 where Lat > 0 and  Lat < 45 \
	-H 'Content-Type: application/json' \
	-H 'Authorization: Bearer <token>'
```

## NEX-GDDP queries

A SQL wrapper is offered for accessing the NASA NEX-GDDP dataset with sql-like statements. The API stores calculated indexes over the original data, and several views over the data are available. These can be accessed in the following ways:

### Spatial aggregates over a layer

Access spatial aggregates over the data by listing all dataset data for a particular year:

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393\?sql\=select\ \*\ from\ nexgddp-historical-ACCESS1_0-prmaxday\ where\ year\ \=\ 1960
```

Access particular aggregates:

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393\?sql\=select\ avg\,\ min\ from\ nexgddp-historical-ACCESS1_0-prmaxday\ where\ year\ \=\ 1960
```

Calculate statistics for a range of years:

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393\?sql\=select\ \*\ from\ nexgddp-historical-ACCESS1_0-prmaxday\ \ where\ year\ between\ 1960\ and\ 1962
```

You can delimit an area of interest by providing a geostore id as a parameter:

```shell
curl -i -XGET http\://api.resourcewatch.org/v1/query/b99c5f5e-00c6-452e-877c-ced2b9f0b393\?sql\=select\ \*\ from\ nexgddp-historical-ACCESS1_0-prmaxday\ \ where\ year\ between\ 1960\ and\ 1962&geostore\=0279093c278a64f4c3348ff63e4cfce0
```
