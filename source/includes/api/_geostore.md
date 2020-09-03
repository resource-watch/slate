# Geostore

<aside class="notice">
Note — This is the documentation for version 1 of the Geostore microservice, the latest version is 
<a href="https://resource-watch.github.io/doc-api/index-rw.html#geostore-v2">version 2</a>.
</aside>

## What is Geostore

Geostore is a database for storing geostore objects which contain geographic data structures in [GeoJSON](https://geojson.org/) format. GeoJSON supports the following geometry types: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, and `MultiPolygon`. Geometric objects with additional properties are `Feature` objects. Sets of features are contained by `FeatureCollection` objects.

The Geostore microservice provides a comprehensive way to communicate geographic data structures between platforms and microservices. It enables users to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) geographic data structures from the Geostore, and query information about a geostore object, such as the bounding box of all its' geometries.

[TODO: Add more general overview of functionality]

To keep this documentation easy to understand, we'll spit our approach to the Geostore microservice into two sections:

- We'll first discuss the details of the endpoints that allow you to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) geostore objects, without focusing on the actual data contained in it.
- Next we describe the structure used to store data in the Geostore's open format fields.

After viewing the documentation below, consider looking at the [geostore tutorial]() for a step-by-step guide to rendering an actual geostore object on a web application.

<aside class="notice">
Remember — All of the Geostore endpoints do not require that users are authenticated. [TODO: CHECK THIS!]
</aside>

## Getting geostore objects

A number of endpoints are available for retrieving geostore objects, each with a different purposes in mind. [TODO: Explain general structure and logic for the specific endpoints; countries, GADM regions, WDPA ect., Where codes come from, source versions...]

| Method    | Path                    | Description                                   |
| --------- | ----------------------- | --------------------------------------------- |
| POST | `/v1/geostore` | ?? |
| POST | `/v1/geostore/area` | ?? |
| GET | `/v1/geostore/:id`        | [Get geostore by Geostore ID](#get-geostore-by-geostore-id) |
| POST | `/v1/geostore/find-by-ids`| [Get geostores by Geostore IDs](#get-geostore-by-geostore-ids) |
| GET | `/v1/geostore/:id/view`   | [Get geostore by Geostore ID and view at GeoJSON.io](#get-geostore-by-geostore-id-and-view-at-geojson-io) |
| GET | `/v1/geostore/admin/list` | [Get all Geostore IDs, names and ISO 3166-1 alpha-3 codes](#get-all-geostore-ids-names-and-iso-3166-1-alpha-3-codes) [TODO: Confirm if this is ALL objects or a selection] |
| GET | `/v1/geostore/admin/:iso` | [Get geostore by ISO 3166-1 alpha-3 code](#get-geostore-by-iso-3166-1-alpha-code) |
| GET | `/v1/geostore/admin/:iso/:id1` | Return a single geostore by ISO 3166-1 alpha-3 code and GADM admin code 1 |
| GET | `/v1/geostore/admin/:iso/:id1/:id2` | Return a single geostore by ISO 3166-1 alpha-3 code, GADM admin code 1, and admin code 2 |
| GET | `/v1/geostore/wdpa/:id` | Return a single geostore by WDPA id |
| GET | `/v1/geostore/use/:name/:id` | Return a single geostore by Land Use Type name and ID |
| GET | `/v1/coverage/intersect/use/:name/:id` | ?? |
| GET | `/v1/coverage/intersect/admin/:iso` | ?? |
| GET | `/v1/coverage/intersect/admin/:iso/:id1` | ?? |
| GET | `/v1/coverage/intersect/wdpa/:id` | ?? |
| GET | `/v1/coverage/intersect` | ?? |
| GET | `/v1/coverage/intersect/use/:name/:id` | ?? |

[TODO: Check if coverage should have its own documentation?]

### Get geostore by Geostore ID

Geostore objects can be retrieved via the `geostore/` endpoint,
which returns a single object using a single [Geostore ID]() value (`<id>`), if a geostore with the specified `<id>` does not exist in the Geostore, a 404 response is returned.

> GET request for a single geostore using its' `<id>`.

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/<id>
```

> Example URL request

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/ca38fa80a4ffa9ac6217a7e0bf71e6df
```

> Example response
```json
{
    "data": {
        "type": "geoStore",
        "id": "ca38fa80a4ffa9ac6217a7e0bf71e6df",
        "attributes": {
            "geojson": {
                "crs": {},
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        -5.273512601852417,
                                        42.81137220349083
                                    ],
                                    [
                                        -5.273512601852417,
                                        42.811803118457306
                                    ],
                                    [
                                        -5.272732079029083,
                                        42.811803118457306
                                    ],
                                    [
                                        -5.272732079029083,
                                        42.81137220349083
                                    ],
                                    [
                                        -5.273512601852417,
                                        42.81137220349083
                                    ]
                                ]
                            ]
                        }
                    }
                ]
            },
            "hash": "ca38fa80a4ffa9ac6217a7e0bf71e6df",
            "provider": {},
            "areaHa": 0.3057556230214663,
            "bbox": [
                -5.273512601852417,
                42.81137220349083,
                -5.272732079029083,
                42.811803118457306
            ],
            "lock": false,
            "info": {
                "use": {}
            }
        }
    }
}
```


### Get geostore by Geostore ID and view at GeoJSON.io

### Get geostores by Geostore IDs

### Get geostore by ISO 3166-1 alpha-3 code

Geostore objects can be retrieved using [ISO 3166-1 alpha-3 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) values (`iso`) via the `geostore/admin/` endpoint.

> GET request for a single geostore using its' `iso`

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/<iso>
```

> Example request

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/ESP
```

### Get all Geostore IDs, names and ISO 3166-1 alpha-3 codes

To find which ISO 3166-1 alpha-3 code values are available in the `geostore/admin/` endpoint you can use:

> GET request for a array of Geostore IDs, names and ISO 3166-1 alpha-3 codes

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/list
```

> Example response

```json
{
	"data": [{
		"geostoreId": "35a6d982388ee5c4e141c2bceac3fb72",
		"iso": "ESP",
		"name": "Spain"
	}, {
		"geostoreId": "8f77fe62cf15d5098ba0ee11c5126aa6",
		"iso": "FRA",
		"name": "France"
	}, {
		"geostoreId": "1d568c183033da6c17cc28c4aecf1bcf",
		"iso": "cod",
		"name": "Democratic Republic of the Congo"
	}]
}
```
<aside class="notice">
Note — This request does not return the unique list of iso codes!
</aside>

### Get geostore by ISO 3166-1 alpha-3 and GADM admin 1 code

### Get geostore by ISO 3166-1 alpha-3, GADM admin 1, and GADM admin 2 code







# JUNK BELOW

### From country and region

If you need obtain the geostore of a region in a country, you can obtain it with the ISO3 and region code:

`GET https://api.resourcewatch.org/v1/geostore/admin/<ISO3>/<regionCode>`

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/<ISO3>/<regionCode>
```

> Real example obtaining the geostore of Madrid's Comunity in Spain

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/ESP/8
```

### From World Database on Protected Areas (wdpa)

Is possible obtain the geostore of a World Database on Protected Areas of the world. You only need the id of the protected area (WDPA).
[World Database on Protected Areas web](https://www.protectedplanet.net/)

`GET https://api.resourcewatch.org/v1/geostore/wdpa/<wdpaId>`


```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/wdpa/<wdpaId>
```

> Real example obtaining the geostore of 'Sierra de Guadarrama' protected area

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/wdpa/555538160
```

### From land use areas

Geostore has the geojson of 4 different lands use:

#### Oil palm

`GET https://api.resourcewatch.org/v1/geostore/use/oilpalm/<id>`

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/oilpalm/<id>
```

> Real example obtaining the geostore of one Oil palm area

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/oilpalm/556
```

#### Mining

`GET https://api.resourcewatch.org/v1/geostore/use/mining/<id>`

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/mining/<id>
```

> Real example obtaining the geostore of one mining area

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/mining/573
```


#### Wood fiber

`GET https://api.resourcewatch.org/v1/geostore/use/fiber/<id>`

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/fiber/<id>
```

> Real example obtaining the geostore of one Wood fiber area

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/fiber/346
```


#### Congo Basin logging roads

`GET https://api.resourcewatch.org/v1/geostore/use/logging/<id>`

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/logging/<id>
```

> Real example obtaining the geostore of Oil palm area

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/logging/102
```


### From Carto

If your geojson is in carto table, is possible import this geojson in geostore.
To import the geojson in geostore, you need to define all of the required fields in the request body. The fields that compose a import are:

| Field     |                                                    Description                                                     |   Type | Values | Required |
| --------- | :----------------------------------------------------------------------------------------------------------------: | -----: | ------ | -------: |
| provider  |                                                  Provider of data                                                  | Object |        |      Yes |
| -- type   |                                                   Provider type                                                    |   Text | carto  |      Yes |
| -- table  |                                                     Table name                                                     |   Text |        |      Yes |
| -- user   |                                                User of the account                                                 |   Text |        |      Yes |
| -- filter | Conditions to obtain the geojson. Is possible put and and or conditions. This conditions must only return one row. |   Text |        |      Yes |


> To import a Geostore, you have to do a POST with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore \
-H "Content-Type: application/json"  -d \
 '{
    "provider":{
        "type": "carto",
        "table": <tableName>,
        "user": <userName>,
        "filter": <conditions>
    }
}'
```

> Real example

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore \
-H "Content-Type: application/json"  -d \
 '{
    "provider":{
        "type": "carto",
        "table": "gfw_mining",
        "user": "wri-01",
        "filter": "cartodb_id=573"
    }
}'
```

> Example response

```json
{
  "data": {
    "type": "geoStore",
    "id": "26f8975c4c647c19a2edaa11f23880a2",
    "attributes": {
      "geojson": {
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                [
                  [
                    [
                      -74.0957370284411,
                      10.6814701233475
                    ],
                    [
                      -74.0957357154309,
                      10.654348341203
                    ],
                    [
                      -74.1100850695703,
                      10.6543473339623
                    ],
                    [
                      -74.1100876551212,
                      10.6814691125096
                    ],
                    [
                      -74.0957370284411,
                      10.6814701233475
                    ]
                  ]
                ]
              ]
            }
          }
        ],
        "crs": {},
        "type": "FeatureCollection"
      },
      "hash": "26f8975c4c647c19a2edaa11f23880a2",
      "provider": {
        "filter": "cartodb_id=573",
        "user": "wri-01",
        "table": "gfw_mining",
        "type": "carto"
      },
      "areaHa": 471.001953054716,
      "bbox": [
        -74.1100876551212,
        10.6543473339623,
        -74.0957357154309,
        10.6814701233475
      ]
    }
  }
}
```


## Obtain a Geostore

To obtain a geostore, you only need the id of the Geostore. You can perform a GET request for the geostore with its id.

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/<geostoreId>
```

> Real example obtaining one geostore

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/logging/26f8975c4c647c19a2edaa11f23880a2
```

> Example response

```json
{
  "data": {
    "type": "geoStore",
    "id": "26f8975c4c647c19a2edaa11f23880a2",
    "attributes": {
      "geojson": {
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                [
                  [
                    [
                      -74.0957370284411,
                      10.6814701233475
                    ],
                    [
                      -74.0957357154309,
                      10.654348341203
                    ],
                    [
                      -74.1100850695703,
                      10.6543473339623
                    ],
                    [
                      -74.1100876551212,
                      10.6814691125096
                    ],
                    [
                      -74.0957370284411,
                      10.6814701233475
                    ]
                  ]
                ]
              ]
            }
          }
        ],
        "crs": {},
        "type": "FeatureCollection"
      },
      "hash": "26f8975c4c647c19a2edaa11f23880a2",
      "provider": {
        "filter": "cartodb_id=573",
        "user": "wri-01",
        "table": "gfw_mining",
        "type": "carto"
      },
      "areaHa": 471.001953054716,
      "bbox": [
        -74.1100876551212,
        10.6543473339623,
        -74.0957357154309,
        10.6814701233475
      ]
    }
  }
}
```






You can save your geojson or obtain geojson by country, region, Protected areas, etc.

Geostore object contains the following fields:


| Field     |                                                     Description                                                     |   Type |
| --------- | :-----------------------------------------------------------------------------------------------------------------: | -----: |
| id        |                                                 Id of the geostore                                                  |   Text |
| geojson   |                                              Geojson with the geometry                                              | Object |
| hash      |                              MD5 hash generated from geojson. Is the same that the id                               | Object |
| provider  |                     This field should be completed if the geostore was created from a provider                      | Object |
| -- type   |                                                    Provider type                                                    |   Text |
| -- table  |                                                     Table name                                                      |   Text |
| -- user   |                                                 User of the account                                                 |   Text |
| -- filter | Conditions to obtain the geojson. It is possible use AND & OR conditions. This conditions must only return one row. |   Text |
| areaHa    |                                           Area in Hectares of the geojson                                           | Number |
| bbox      |                                             Bounding box of the geojson                                             |  Array |

<aside class="notice">
Remember — All endpoint of geostore don't need that you are authenticated.
</aside>


## Create Geostore

You can create a geostore in 4 different ways:

### With a Geojson

If you have your own geojson, you can save it in geostore. To create the geostore, you need to define all the required fields in the request body. The fields that compose a geostore are:

| Field   |        Description         |   Type | Values | Required |
| ------- | :------------------------: | -----: | ------ | -------: |
| geojson | Geojson with your geometry | Object |        |      Yes |

> To create a Geostore, you have to do a POST query with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore \
-H "Content-Type: application/json"  -d \
 '{
   "geojson": <yourGeoJSONObject>
  }'
```

> Real example

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore \
-H "Content-Type: application/json"  -d \
 '{
   "geojson":{
      "type":"FeatureCollection",
      "features":[
         {
            "type":"Feature",
            "properties":{

            },
            "geometry":{
               "type":"LineString",
               "coordinates":[
                  [
                     -3.9942169189453125,
                     41.044922165782175
                  ],
                  [
                     -3.995418548583985,
                     41.03767166215326
                  ],
                  [
                     -3.9842605590820312,
                     41.03844854003296
                  ],
                  [
                     -3.9844322204589844,
                     41.04589315472392
                  ],
                  [
                     -3.9942169189453125,
                     41.044922165782175
                  ]
               ]
            }
         },
         {
            "type":"Feature",
            "properties":{

            },
            "geometry":{
               "type":"Polygon",
               "coordinates":[
                  [
                     [
                        -4.4549560546875,
                        40.84706035607122
                     ],
                     [
                        -4.4549560546875,
                        41.30257109430557
                     ],
                     [
                        -3.5211181640624996,
                        41.30257109430557
                     ],
                     [
                        -3.5211181640624996,
                        40.84706035607122
                     ],
                     [
                        -4.4549560546875,
                        40.84706035607122
                     ]
                  ]
               ]
            }
         }
      ]
   }
}'
```

The response will be 200 if the geostore saves correctly and returns the geostore object with all information:

> Example response

```json
{
   "data":{
      "type":"geoStore",
      "id":"c9bacccfb9c3fe225dc67545bb93a5cb",
      "attributes":{
         "geojson":{
            "features":[
               {
                  "type":"Feature",
                  "geometry":{
                     "type":"Polygon",
                     "coordinates":[
                        [
                           [
                              -4.4549560546875,
                              40.84706035607122
                           ],
                           [
                              -4.4549560546875,
                              41.30257109430557
                           ],
                           [
                              -3.5211181640624996,
                              41.30257109430557
                           ],
                           [
                              -3.5211181640624996,
                              40.84706035607122
                           ],
                           [
                              -4.4549560546875,
                              40.84706035607122
                           ]
                        ]
                     ]
                  }
               }
            ],
            "crs":{

            },
            "type":"FeatureCollection"
         },
         "hash":"c9bacccfb9c3fe225dc67545bb93a5cb",
         "provider":{

         },
         "areaHa":397372.34122605197,
         "bbox":[
            -4.4549560546875,
            40.84706035607122,
            -3.5211181640624996,
            41.30257109430557
         ]
      }
   }
}
```