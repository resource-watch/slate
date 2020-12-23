# Fields

## What are fields?

Fields are the properties of a dataset your will find when querying its data, use when filtering data through [queries](#query), or visualise when rendering a [layer](#layer) or a [widget](#widget). 

Fields are part of a dataset, and are determined by the structure of data provided by the dataset creator. Each field also includes information about its data type, derived automatically by the dataset provider (check out the specifics of each provider in the sections below). If you are uploading your own datasets to the RW API, you don't have to do anything else for your dataset to be available through the fields endpoints - there's no additional data you have to provide. Keep in mind the endpoints described in the sections below are **read-only** - if you want to change your dataset's fields, you need to upload the dataset's data again.

Fields are targeted at users consuming datasets available on the RW API, particularly if you want to build a flexible and scalable application. The fields endpoints aim at giving you a consistent and uniform view of the structure of data hosted in different [dataset providers](#dataset-providers), that would otherwise be served in a heterogeneous structure.

## How to get the dataset fields

> Querying the fields of a dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/fields/<dataset-id>
```

> Response example

```json
{
	"tableName": "public.cait_2_0_country_ghg_emissions_toplow2011",
	"fields": {
		"cartodb_id": {
			"type": "number"
		},
		"the_geom": {
			"type": "geometry"
		},
		"the_geom_webmercator": {
			"type": "geometry"
		},
		"x": {
			"type": "string"
		},
		"y": {
			"type": "number"
		},
		"z": {
			"type": "string"
		}
	}
}
```


Once the dataset has been created and its status is set to `saved`, you will be able to use this endpoint to get details about a its fields. The resulting response contains two root fields

- `tableName`: a string containing the table name, as stored in the dataset object. The value and function of this field will depend on the dataset's provider, and you can refer to the [dataset](#dataset) documentation for more details about this.
- `fields`: a key-value pair of field names and their respective details. 

While the aim of this endpoint is to provide an homogeneous view of data stored in different systems, you will still encounter slight variations in data, depending on the underlying type of the dataset you're querying. The example response on the right illustrates the typical basic response structure: `tableName` with a string value, and a `fields` map that matches each field's name to a `type`. You'll find this structure throughout all responses, but you may also find additional details for each field, and the data types may vary in name. In the next sections we'll cover some of the specifics for each dataset type.


### Carto

> Example response for a Carto dataset

```json
{
    "tableName": "gadm28_adm1",
    "fields": {
        "cartodb_id": {
            "type": "number",
            "pgtype": "int4"
        },
        "the_geom": {
            "type": "geometry",
            "wkbtype": "Unknown",
            "dims": 2,
            "srid": 4326
        },
        "the_geom_webmercator": {
            "type": "geometry",
            "wkbtype": "Unknown",
            "dims": 2,
            "srid": 3857
        },
        "objectid": {
            "type": "number",
            "pgtype": "int8"
        },
        "iso": {
            "type": "string",
            "pgtype": "text"
        },
        "centroid": {
            "type": "string",
            "pgtype": "text"
        },
        "area_ha": {
            "type": "number",
            "pgtype": "float8"
        },
        "topojson": {
            "type": "string",
            "pgtype": "text"
        },
        "the_geom_simple": {
            "type": "geometry",
            "wkbtype": "Unknown",
            "dims": 2,
            "srid": 4326
        },
        "geojson": {
            "type": "string",
            "pgtype": "text"
        }
    }
}
```

Carto datasets provide a `type` for each field, as well as additional details, depending on the field type. Most fields will have a `pgtype` field, which will identify a sub-type of sorts - for example, `type` number is matched with different `pgtype` values in this example. This is related with the underling Carto implementation, that uses PostgreSQL, PostGIS and its own software stack. We recommend relying on the `type` as much as possible.

Other, more complex, field types, like `geometry` types, include additional details for their respective types. As before, this is related with the underlying Carto implementation tools, and not actively maintained or supported by the RW API.

For more information about the different types that can be found in Carto datasets please refer to [PostgreSQL's documentation on Data Types](https://www.postgresql.org/docs/11/datatype.html) or [PostGIS's documentation](https://postgis.net/docs/index.html). 

### ArcGIS feature layer

> Example response for a ArcGIS dataset

```json
{
    "tableName": "conservationMapServer3",
    "fields": {
        "objectid": {
            "type": "esriFieldTypeOID"
        },
        "tcl_name": {
            "type": "esriFieldTypeString"
        },
        "tcl_id": {
            "type": "esriFieldTypeSmallInteger"
        },
        "area_ha": {
            "type": "esriFieldTypeInteger"
        },
        "tx2_tcl": {
            "type": "esriFieldTypeSmallInteger"
        },
        "gfwid": {
            "type": "esriFieldTypeString"
        },
        "globalid": {
            "type": "esriFieldTypeGlobalID"
        },
        "shape": {
            "type": "esriFieldTypeGeometry"
        },
        "shape_Length": {
            "type": "esriFieldTypeDouble"
        },
        "shape_Area": {
            "type": "esriFieldTypeDouble"
        }
    }
}
```

ArcGIS uses its own type naming convention, as you see reflected in the included example. The RW API passes that information as-is to you. As different ArcGIS datasets rely on different ArcGIS server instances and versions, you may encounter variations in the types you'll find, depending on how ArcGIS evolves these types over type.

For more information about the different types that can be found in ArcGIS datasets please refer to [ArcGIS's field data types documentation](https://desktop.arcgis.com/en/arcmap/latest/manage-data/geodatabases/arcgis-field-data-types.htm).

### Google Earth Engine

> Example response for a Google Earth Engine dataset

```json
{
    "data": {
        "fields": {
            "bands": [
                {
                    "dataType": {
                        "precision": "INT",
                        "range": {
                            "max": 2147483647,
                            "min": -2147483648
                        }
                    },
                    "grid": {
                        "affineTransform": {
                            "scaleX": 0.00833333376795053,
                            "scaleY": -0.00833333376795053,
                            "translateX": -180.0000000000001,
                            "translateY": 90.00000782310963
                        },
                        "crsCode": "EPSG:4326",
                        "dimensions": {
                            "height": 18000,
                            "width": 43200
                        }
                    },
                    "id": "b1",
                    "pyramidingPolicy": "MEAN"
                }
            ],
            "geometry": {
                "coordinates": [
                    [
                        [
                            "-Infinity",
                            "-Infinity"
                        ],
                        [
                            "Infinity",
                            "-Infinity"
                        ],
                        [
                            "Infinity",
                            "Infinity"
                        ],
                        [
                            "-Infinity",
                            "Infinity"
                        ],
                        [
                            "-Infinity",
                            "-Infinity"
                        ]
                    ]
                ],
                "type": "Polygon"
            },
            "id": "users/resourcewatch/cli_030_global_aridity",
            "name": "projects/earthengine-legacy/assets/users/resourcewatch/cli_030_global_aridity",
            "properties": {
                "title": "Image:cli_030 _global_aridity"
            },
            "sizeBytes": "413389345",
            "title": "Image:cli_030 _global_aridity",
            "type": "IMAGE",
            "updateTime": "2017-10-06T18:58:39.646890Z"
        },
        "tableName": "users/resourcewatch/cli_030_global_aridity"
    }
}
```

Google Earth Engine (GEE) is perhaps the biggest outlier when it comes to fields data. Because it relies on raster data, rather than tabular data, the data structure you'll find in a GEE dataset is very different, as you can see in the example on the side.

The response consists of loading the details for a single image, with the most meaningful information being the `properties` (of an image) and `bands` (of said image). Those will be the fields you'll be able to retrieve when using the query endpoints.

### NEX-GDDP

> Example response for a NEX-GDDP dataset

```json
{
    "fields": {
        "tasavg": {
            "type": "number",
            "uom": "10^0"
        },
        "tasavg_q25": {
            "type": "number",
            "uom": "10^0"
        },
        "tasavg_q75": {
            "type": "number",
            "uom": "10^0"
        },
        "year": {
            "type": "date"
        }
    },
    "tableName": "tasavg/rcp45_30_y"
}
```

NEX-GDDP datasets have an additional `uom` (unit of measure) field on some field types, but otherwise has no other info besides the basic details.

### BigQuery

> Example response for a BigQuery dataset

```json
{
    "tableName": "[bigquery-public-data:ghcn_m.ghcnm_tmin]",
    "fields": [
        {
            "name": "id",
            "type": "INTEGER",
            "mode": "REQUIRED",
            "description": "11 digit identifier, digits 1-3=Country Code, digits 4-8 represent the WMO id if the station is a WMO station. It is a WMO station if digits 9-11=\"000\"."
        },
        {
            "name": "year",
            "type": "INTEGER",
            "mode": "NULLABLE",
            "description": "4 digit year of the station record."
        },
        {
            "name": "element",
            "type": "STRING",
            "mode": "NULLABLE",
            "description": "element type, monthly mean temperature=\"TAVG\" monthly maximum temperature=\"TMAX\" monthly minimum temperature=\"TMIN\""
        },
        {
            "name": "value1",
            "type": "INTEGER",
            "mode": "NULLABLE",
            "description": "monthly value (MISSING=-9999).  Temperature values are in hundredths of a degree Celsius, but are expressed as whole integers (e.g. divide by 100.0 to get whole degrees Celsius)."
        },
        {
            "name": "qcflag3",
            "type": "STRING",
            "mode": "NULLABLE",
            "description": "quality control flag, seven possibilities within quality controlled unadjusted (qcu) dataset, and 2 possibilities within the quality controlled adjusted (qca) dataset."
        },
        {
            "name": "qcflag12",
            "type": "STRING",
            "mode": "NULLABLE",
            "description": "quality control flag, seven possibilities within quality controlled unadjusted (qcu) dataset, and 2 possibilities within the quality controlled adjusted (qca) dataset."
        },
        {
            "name": "dsflag12",
            "type": "STRING",
            "mode": "NULLABLE",
            "description": "data source flag for monthly value, 21 possibilities"
        }
    ]
}
```

BigQuery has a slight variation on the core structure returned by the fields endpoint for other dataset types. Instead of `fields` having a key-value map, it has an array of objects, each describing a field. Each of these objects has a `name` and `type` property, identifying a field and its type, as well as a `mode` and `description`, respectively indicating if the field is nullable or required, and providing a human-friendly description of the field's content or purpose.

### Loca

> Example response for a Loca dataset

```json
{
    "fields": {
        "xs": {
            "type": "number",
            "uom": "10^0"
        },
        "xs_q25": {
            "type": "number",
            "uom": "10^0"
        },
        "xs_q75": {
            "type": "number",
            "uom": "10^0"
        },
        "year": {
            "type": "date"
        }
    },
    "tableName": "loca_xs/rcp85_30_y"
}
```

Loca datasets have an additional `uom` (unit of measure) field on some field types, but otherwise has no other info besides the basic details.

### Document-based dataset types (csv, tsv, json and xml)

> Example response for a document-based dataset

```json
{
    "tableName": "index_1c9a1e4f455b4c03ac88dd2242a2e4b1_1602065490373",
    "fields": {
        "cartodb_id": {
            "type": "long"
        },
        "commodity": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "data_id": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "gcm_type": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "impactparameter": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "iso": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "region": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "scenario": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "value": {
            "type": "float"
        },
        "year": {
            "type": "long"
        }
    }
}
```

Document based datasets from the 4 different types of sources (json, xml, csv and tsv) all share a common internal storage engine, based on Elasticsearch. So, when querying for fields of a document-based dataset, you'll find information matching the field mechanism used by Elasticsearch. This is particularly evident on text fields, where the `keyword` information is present. During most uses cases, we don't anticipate this information being needed, as relying on the `type` value should cover the majority of your needs.

### Dataset types not supported by the fields endpoint

The following dataset types have not been integrated with the fields endpoint, so you will get a 404 response when querying for their fields:

- `wms`
- `rasdaman`
- `vector`

### Errors for getting a dataset fields

Error code     | Error message      | Description
-------------- | ------------------ | --------------
404            | Endpoint not found | You are querying for fields of a dataset which type is not integrated with the fields endpoint
404            | Dataset not found  | A dataset with the provided id does not exist.
