# Fields

## What are fields?

Fields can be defined as the dataset properties. These fields are automatically generated when a dataset is created.

## How to get the dataset fields

Once the dataset is properly created and saved, it is possible to access to its fields as well as getting some information about them.

To do that, it is necessary to use of the following endpoint:

```shell
curl -X GET https://api.resourcewatch.org/v1/fields/<dataset-id>
```

> Real example

```shell
curl -X GET https://api.resourcewatch.org/v1/fields/1170030b-9725-4bfe-8fb4-1b0eb81020d2
```

> Response

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

### Rasdaman

The structure of datacubes needs a more verbose field specification. The fields endpoint for rasdaman-backed datasets includes information on the spatial reference system, nodata values, axes, units, and bands. It looks like so:

> Example

```shell
curl -i  -XGET 'http://api.resourcewatch.org/v1/fields/491ae6fe-6767-44d1-b5c3-c7b8b384bb7a'
```

> Response

```json
{
  "coverageId": "nightlights",
  "srs": {
    "srsDimension": "2",
    "srs": "crs/EPSG/0/4326"
  },
  "axisLabels": "Lat Long",
  "uomLabels": "degree degree",
  "fields": {
    "undefined": {
      "swe:nilValues": {
        "swe:NilValues": {
          "swe:nilValue": [
            {
              "reason": "",
              "$t": "1"
            },
            {
              "reason": "",
              "$t": "2"
            }
          ]
        }
      },
      "swe:uom": {
        "code": "10^0"
      }
    }
  },
  "coverageBounds": {
    "upperCorner": "89.999999999966665 180.000000000189335",
    "lowerCorner": "-89.999999999961335 -179.999999999666665"
  }
}
```
