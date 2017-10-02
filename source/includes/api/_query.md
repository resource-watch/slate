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

Rasdaman datasets do not expose an SQL interface from where to query the data – instead it offers interfaces to WCPS (the OGC Web Coverage Processing Service) and RasQL (a superset of SQL dealing with coverages).

So far only WCPS is supported in the RW API. Two different endpoints are offered: one to directly run WCPS queries against the database, and one that abstracts the calculation of (2D) zonal statistics on rasdaman coverages with vector masks. For more information on the WCPS standard, consult the [OGC page](http://www.opengeospatial.org/standards/wcp) about it

In order to run a query directly, POST your query in the wcps attribute to the endpoint:

```shell
curl -i -H 'Authorization: Bearer your-token>' -H 'Content-Type: application/json' -XPOST 'http://api.resourcewatch.org/v1/query/491ae6fe-6767-44d1-b5c3-c7b8b384bb7a/' -d '{
    "wcps": "FOR c in (nightlights) return 1"
}
'
```

The result of a WCPS query can have varying dimensionality, depending on the axes of the original dataset. The result must be encoded in an appropriate file format, which is done with the `encode` WCPS function. A large variety of formats are supported (as the underlying implementation depends on GDAL), but some care has to be taken to match the dimensionality of the query output with one that the desired format supports. For subsetting the domain of the original coverage, trimming and slicing can be used too:

```
curl -i -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -XPOST 'http://api.resourcewatch.org/v1/query/491ae6fe-6767-44d1-b5c3-c7b8b384bb7a/' -d '{
    "wcps":  "for cov in (nightlights) return encode( cov[ Long(-1:1), Lat(-1:1)], \"CSV\")"
}
'
```

For zonal stats, use the 'stats' endpoint. The geostore will be used to generate spatial masks. If the original coverage is not 2-dimensional, additional subsettings have to be specified in the requests as 'additionalAxes' to reduce the coverage dimensionality. The most usual subsetting will be a time slice that has to be specified as an ANSI (ISO 8601) date – with the appropriate level of granularity.

```shell
curl -i -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -XPOST 'http://api.resourcewatch.org/v1/stats/e9c3a94d-6b1c-4513-a745-6acdff53cfc9' -d '{
    "geostore": "70ba01daaa803aea2eeff502c845bcef",
    "additionalAxes": {
        "ansi": "1950-03-03"
    }
}
'
```

> Response

```json
{
    "data": [
        {
            "min": 0,
            "max": 0.00016111972217913717,
            "mean": 2.019295106901743e-05,
            "count": 993
        }
    ]
}
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
