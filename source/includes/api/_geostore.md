# Geostore

***Note — This is the documentation for version 1 of the Geostore microservice, the latest version is [version 2](https://resource-watch.github.io/doc-api/index-rw.html#geoStore-v2).***

## What is Geostore

Geostore is a database for storing geoStore objects which contain geographic data structures described using the [GeoJSON](https://geojson.org/) schema. GeoJSON supports the following geometry types: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, and `MultiPolygon`. Geometric objects with additional properties are `Feature` objects. Sets of features are contained by `FeatureCollection` objects.

The Geostore microservice provides a comprehensive way to communicate geographic data structures between platforms and microservices. It enables users to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) geographic data structures from the Geostore, and query information about a geoStore object, such as the bounding box of all its' geometries.

[TODO: Add more general overview of functionality]

To keep this documentation easy to understand, we'll split our approach to the Geostore microservice into two sections:

- We'll first discuss the details of the endpoints that allow you to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) geoStore objects, without focusing on the actual data contained in it.
- Next we describe the structure used to store data in the Geostore's open format fields.

After viewing the documentation below, consider looking at the Geostore tutorial for a step-by-step guide to rendering an actual geoStore object on a web application.

***Remember — All of the Geostore endpoints do not require that users are authenticated.***

## Getting geoStore objects

A number of endpoints are available for retrieving geoStore objects, each with a different purposes in mind. [TODO: Explain general structure and logic for the specific endpoints; countries, GADM regions, WDPA ect., Where codes come from, source versions...]

| Method | Path                                     | Description                                                                                                                                    |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/v1/geostore`                           | ??                                                                                                                                             |
| POST   | `/v1/geostore/area`                      | ??                                                                                                                                             |
| GET    | `/v1/geostore/:id`                       | [Get geoStore by Geostore ID](#get-geostore-by-geostore-id)                                                                                    |
| POST   | `/v1/geostore/find-by-ids`               | [Get geoStores by Geostore IDs](#get-geostores-by-geostore-ids)                                                                                |
| GET    | `/v1/geostore/:id/view`                  | [Get geoStore by Geostore ID and view at GeoJSON.io](#get-geostore-by-geostore-id-and-view-at-geojson-io)                                      |
| GET    | `/v1/geostore/admin/list`                | [Get all Geostore IDs, names and ISO 3166-1 alpha-3 codes](#get-all-geostore-ids-names-and-iso-3166-1-alpha-3-codes)                           |
| GET    | `/v1/geostore/admin/:iso`                | [Get geoStore by ISO 3166-1 alpha-3 code](#get-geostore-by-iso-3166-1-alpha-3-code)                                                            |
| GET    | `/v1/geostore/admin/:iso/:id1`           | [Get geoStore by ISO 3166-1 alpha-3 code and GADM admin 1 ID](#get-geostore-by-iso-3166-1-alpha-3-code-and-gadm-admin-1-id)                    |
| GET    | `/v1/geostore/admin/:iso/:id1/:id2`      | [Get geoStore by ISO 3166-1 alpha-3 code, GADM admin 1 and admin 2 IDs](#get-geostore-by-iso-3166-1-alpha-3-code-gadm-admin-1-and-admin-2-ids) |
| GET    | `/v1/geostore/wdpa/:id`                  | [Get geoStore by WDPA ID](#get-geostore-by-wdpa-id)                                                                                            |
| GET    | `/v1/geostore/use/:name/:id`             | [Get geoStore by Land Use Type name and ID](#get-geostore-by-land-use-type-name-and-id)                                                        |
| GET    | `/v1/coverage/intersect/use/:name/:id`   | ??                                                                                                                                             |
| GET    | `/v1/coverage/intersect/admin/:iso`      | ??                                                                                                                                             |
| GET    | `/v1/coverage/intersect/admin/:iso/:id1` | ??                                                                                                                                             |
| GET    | `/v1/coverage/intersect/wdpa/:id`        | ??                                                                                                                                             |
| GET    | `/v1/coverage/intersect`                 | ??                                                                                                                                             |
| GET    | `/v1/coverage/intersect/use/:name/:id`   | ??                                                                                                                                             |

[TODO: Check if coverage should have its own documentation?]

### Get geoStore by Geostore ID

Geostore objects can be retrieved via the GET `geostore/:id` endpoint,
which returns a single object selected from the Geostore using a single [Geostore ID](#geostore-id) (`<id>`), if a geoStore with the specified `<id>` does not exist in the Geostore, a `404` response is returned.

> Example request pattern

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

### Get geoStore by Geostore ID and view at GeoJSON.io

Geostore objects can be retrieved and viewed via the GET `geostore/:id/view` endpoint, which returns a URL allowing viewing of a single geoStore object selected by [Geostore ID](#geostore-id) (`<id>`)  at GeoSON.io .

> Example request pattern

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/<id>/view
```

> Example URL request

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/ca38fa80a4ffa9ac6217a7e0bf71e6df/view
```

> Example response

```json
{
    "view_link": "http://geojson.io/#data=data:application/json,%7B%22crs%22%3A%7B%7D%2C%22type%22%3A%22FeatureCollection%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-5.273512601852417%2C42.81137220349083%5D%2C%5B-5.273512601852417%2C42.811803118457306%5D%2C%5B-5.272732079029083%2C42.811803118457306%5D%2C%5B-5.272732079029083%2C42.81137220349083%5D%2C%5B-5.273512601852417%2C42.81137220349083%5D%5D%5D%7D%2C%22properties%22%3Anull%7D%5D%7D"
}
```

### Get geoStores by Geostore IDs

Many geoStore objects can be retrieved via the POST `geostore/find-by-ids` endpoint, which returns an array of a geoStore objects selected by an array of [Geostore IDs](#geostore-id) (`[<id>, <id>]`).

> Example request pattern

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore/find-by-ids \
     -H "Content-Type: application/json" \
     -d '{"geostores": [<id>, <id>]}'
```

> Example URL request

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore/find-by-ids \
     -H "Content-Type: application/json" \
     -d '{"geostores": ["35a6d982388ee5c4e141c2bceac3fb72", "8f77fe62cf15d5098ba0ee11c5126aa6"]}'
```

> Example response (coordinates are truncated)

```json
{
    "data": [
        {
            "geostoreId": "35a6d982388ee5c4e141c2bceac3fb72",
            "geostore": {
                "data": {
                    "type": "geoStore",
                    "id": "35a6d982388ee5c4e141c2bceac3fb72",
                    "attributes": {
                        "geojson": {
                            "crs": {},
                            "type": "FeatureCollection",
                            "features": [
                                {
                                    "geometry": {
                                        "coordinates": [
                                            ...
                                        ],
                                        "type": "MultiPolygon"
                                    },
                                    "type": "Feature"
                                }
                            ]
                        },
                        "hash": "35a6d982388ee5c4e141c2bceac3fb72",
                        "provider": {},
                        "areaHa": 50662609.25209112,
                        "bbox": [
                            -18.1604175567627,
                            27.6384716033936,
                            4.32819509506226,
                            43.7915267944337
                        ],
                        "lock": false,
                        "info": {
                            "use": {},
                            "iso": "ESP",
                            "name": "Spain"
                        }
                    }
                }
            }
        },
        {
            "geostoreId": "8f77fe62cf15d5098ba0ee11c5126aa6",
            "geostore": {
                "data": {
                    "type": "geoStore",
                    "id": "8f77fe62cf15d5098ba0ee11c5126aa6",
                    "attributes": {
                        "geojson": {
                            "crs": {},
                            "type": "FeatureCollection",
                            "features": [
                                {
                                    "geometry": {
                                        "coordinates": [
                                            ...
                                        ],
                                        "type": "MultiPolygon"
                                    },
                                    "type": "Feature"
                                }
                            ]
                        },
                        "hash": "8f77fe62cf15d5098ba0ee11c5126aa6",
                        "provider": {},
                        "areaHa": 54935531.53854849,
                        "bbox": [
                            -5.14375114440907,
                            41.3337516784668,
                            9.5604162216186,
                            51.08939743042
                        ],
                        "lock": false,
                        "info": {
                            "use": {},
                            "iso": "FRA",
                            "name": "France"
                        }
                    }
                }
            }
        }
    ],
    "info": {
        "found": 2,
        "foundIds": [
            "35a6d982388ee5c4e141c2bceac3fb72",
            "8f77fe62cf15d5098ba0ee11c5126aa6"
        ],
        "returned": 2
    }
}
```

### Get geoStore by ISO 3166-1 alpha-3 code

Geostore objects can be retrieved via the GET `geostore/admin/:iso` endpoint,
which returns a single object selected from the Geostore using a single [ISO 3166-1 alpha-3 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) (`<iso>`), if a geoStore with the specified `<iso>` does not exist in the Geostore, a `404` response is returned.

> Example request pattern

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/<iso>
```

> Example URL request

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/ESP
```

> Example response (note coordinates are truncated)

```json
{
    "data": {
        "type": "geoStore",
        "id": "56f9a919e061d5edd10c042a8fcd31b6",
        "attributes": {
            "geojson": {
                "crs": {},
                "type": "FeatureCollection",
                "features": [
                    {
                        "geometry": {
                            "coordinates": [
                                ...
                            ],
                            "type": "MultiPolygon"
                        },
                        "type": "Feature",
                        "properties": null
                    }
                ]
            },
            "hash": "56f9a919e061d5edd10c042a8fcd31b6",
            "provider": {},
            "areaHa": 50662609.2516529,
            "bbox": [
                -18.160417557,
                27.638471603,
                4.328195095,
                43.791526794
            ],
            "lock": false,
            "info": {
                "use": {},
                "iso": "ESP",
                "id1": null,
                "id2": null,
                "gadm": "2.8",
                "name": "Spain"
            }
        }
    }
}
```

### Get all Geostore IDs, names and ISO 3166-1 alpha-3 codes

[TODO: Confirm if this is ALL objects or a selection]

All of the Geostore IDs, names, and ISO 3166-1 alpha-3 code values available under the category `admin` in the Geostore can be retrived via the GET `geostore/admin/list` endpoint, which returns an array of objects with the properties `geostoreId`, `name`, and `iso`.

> Example URL request

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

***Note — This endpoint does not return a unique array of iso codes and names!***

### Get geoStore by ISO 3166-1 alpha-3 country code and GADM admin 1 ID

Geostore objects can be retrieved via the GET `geostore/admin/:iso/:id1` endpoint,
which returns a single object selected from the Geostore using a single [ISO 3166-1 alpha-3 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) value (`<iso>`) and [GADM admin level 1](#gadm-admin-levels) ID (`<id1>`), if a geoStore with the specified `<iso>` and `<id1>` does not exist in the Geostore, a `404` response is returned.

> Example request pattern

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/<iso>/<id1>
```

> Example URL request

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/ESP/9
```

> Example response (note coordinates are truncated)

```json
{
    "data": {
        "type": "geoStore",
        "id": "7d1534d7c24b2f907c4ae37d11fc51fe",
        "attributes": {
            "geojson": {
                "crs": {},
                "type": "FeatureCollection",
                "features": [
                    {
                        "geometry": {
                            "coordinates": [
                                ...
                            ],
                            "type": "MultiPolygon"
                        },
                        "type": "Feature",
                        "properties": null
                    }
                ]
            },
            "hash": "7d1534d7c24b2f907c4ae37d11fc51fe",
            "provider": {},
            "areaHa": 1036273.8136673134,
            "bbox": [
                -2.500030994,
                41.909896851,
                -0.726752043,
                43.314189911
            ],
            "lock": false,
            "info": {
                "use": {},
                "iso": "ESP",
                "id1": 9,
                "id2": null,
                "gadm": "2.8"
            }
        }
    }
}
```

### Get geoStore by ISO 3166-1 alpha-3 country code, GADM admin 1 and admin 2 IDs

[TODO: Check this is still valid!!! How do you find valid GADM ids???]

GeoStore objects can be retrieved via the GET `geostore/admin/:iso/:id1/:id2` endpoint, which returns a single object selected from the Geostore using a single [ISO 3166-1 alpha-3 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) value (`<iso>`),  [GADM admin level 1](#gadm-admin-levels) ID (`<id1>`), and [GADM admin level 2](#gadm-admin-levels) ID (`<id2>`), if a geoStore with the specified `<iso>`, `<id1>`, and `<id1>` does not exist in the Geostore, a `404` response is returned.

> Example request pattern

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/<iso>/<id1>/<id2>
```

> Example URL request

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/admin/ESP/9/2
```

> Example response

```json

```

### Get geoStore by World Database on Protected Areas ID

Geostore objects can be retrieved via the GET `geostore/admin/wdpa/:id` endpoint,
which returns a single object selected from the Geostore using a single [World Database on Protected Areas](https://www.protectedplanet.net/) (WDPA) ID (`<id>`), if a geostore with the specified `<id>` does not exist in the Geostore, a `404` response is returned. To find valid WDPA ID values check the link.

> Example request pattern

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/wdpa/<id>
```

> Example URL request

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/wdpa/142809
```

> Example response (note coordinates are truncated)

```json
{
    "data": {
        "type": "geoStore",
        "id": "88db597b6bcd096fb80d1542cdc442be",
        "attributes": {
            "geojson": {
                "crs": {},
                "type": "FeatureCollection",
                "features": [
                    {
                        "geometry": {
                            "coordinates": [
                                ...
                                ],
                            "type": "MultiPolygon"
                        },
                        "type": "Feature",
                        "properties": null
                    }
                ]
            },
            "hash": "88db597b6bcd096fb80d1542cdc442be",
            "provider": {},
            "areaHa": 5081.838068566336,
            "bbox": [
                -6.031685272,
                36.160220287,
                -5.879245686,
                36.249656987
            ],
            "lock": false,
            "info": {
                "use": {},
                "wdpaid": 142809
            }
        }
    }
}
```

### Get geostore by Land Use Type keyword and ID

Geostore objects can be retrieved via the GET `geostore/admin/use/:name/:id` endpoint, which returns a single object selected from the Geostore using a single [Land Use Type](#land-use-types) keyword (`<name>`) and  Land Use Type object ID (`<id>`), if a geostore with the specified `<name>` and `<id>` does not exist in the Geostore, a `404` response is returned. Goestores for four land use types are available; Oil Palm production (`oilpalm`), Mining activities (`mining`), Wood fiber production (`fiber`), and Forest logging activities (`logging`).

> Example request pattern

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/use/<name>/<id>
```

> Example URL request

```shell
curl -X GET https://api.resourcewatch.org/v1/geostore/logging/1
```

> Example response (note coordinates are truncated)

```json
{
    "data": {
        "type": "geoStore",
        "id": "4160c97818384be4312229cada8218e7",
        "attributes": {
            "geojson": {
                "crs": {},
                "type": "FeatureCollection",
                "features": [
                    {
                        "geometry": {
                            "coordinates": [
                                ...
                            ],
                            "type": "MultiPolygon"
                        },
                        "type": "Feature"
                    }
                ]
            },
            "hash": "4160c97818384be4312229cada8218e7",
            "provider": {},
            "areaHa": 1235227.8662539488,
            "bbox": [
                -99.3190423198471,
                51.0787109324636,
                -96.6033188303996,
                52.49257057777
            ],
            "lock": false,
            "info": {
                "use": {
                    "use": "gfw_logging",
                    "id": 1
                }
            }
        }
    }
}
```

## Create geostore objects

Geostore objects can be created and added to the Geostore using a valid GeoJSON object or by selecting a row from a Carto table.

### Create using a GeoJSON

Geostore objects can be created via the POST `geostore` endpoint,
which accepts as body a [GeoJSON](https://geojson.org/) object (`<geojson>`), if the object is correctly added to the Geostore a `200` response is returned, as well as the new geostore object.

> Example request pattern

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore/ \
     -H "Content-Type: application/json" \
     -d '{"geojson": <geojson>}'
```

> Example URL request

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore/ \
     -H "Content-Type: application/json" \
     -d '{
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

> Example response

```json
{
    "data": {
        "type": "geoStore",
        "id": "170f0ba59b3645de8f27e080a8ab4c78",
        "attributes": {
            "geojson": {
                "crs": {},
                "type": "FeatureCollection",
                "features": [
                    {
                        "geometry": {
                            "coordinates": [
                                [
                                    -3.994216919,
                                    41.044922166
                                ],
                                [
                                    -3.995418549,
                                    41.037671662
                                ],
                                [
                                    -3.984260559,
                                    41.03844854
                                ],
                                [
                                    -3.98443222,
                                    41.045893155
                                ],
                                [
                                    -3.994216919,
                                    41.044922166
                                ]
                            ],
                            "type": "LineString"
                        },
                        "type": "Feature"
                    }
                ]
            },
            "hash": "170f0ba59b3645de8f27e080a8ab4c78",
            "provider": {},
            "areaHa": 0,
            "bbox": [
                -3.995418549,
                41.037671662,
                -3.984260559,
                41.045893155
            ],
            "lock": false,
            "info": {
                "use": {}
            }
        }
    }
}
```

### Create using a provider definition

Geostore objects can be created via the POST `geostore` endpoint, which accepts as body a [Provider definition](#provider-definition-object) object (`<provider>`), if the object is correctly added to the Geostore a `200` response is returned, as well as the new geostore object. At present the only provider definition supported is a [Carto](https://carto.com/) table, using `"type": "carto"`.

> Example request pattern

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore \
-H "Content-Type: application/json" \
-d '{"provider": <provider>}'
```

> Example URL request

```shell
curl -X POST https://api.resourcewatch.org/v1/geostore \
-H "Content-Type: application/json" \
-d '{
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

```

## Geostore objects and properties

### Geostore ID

A unique identifier for the geoStore object in the form of a 128 bit [MD5 hash](https://en.wikipedia.org/wiki/MD5) generated from geojson.

### GeoJSON

[GeoJSON](https://geojson.org/) objects are used when [creating geoStore objects](#create-using-a-geojson-object) and are also included in geostore objects.

See JSON Schema docs for the GeoJSON types below:

- [FeatureCollection](http://geojson.org/schema/FeatureCollection.json)
- [Feature](http://geojson.org/schema/Feature.json)
- [Geometry](http://geojson.org/schema/Geometry.json)
- [GeometryCollection](http://geojson.org/schema/GeometryCollection.json)
- [MultiPolygon](http://geojson.org/schema/MultiPolygon.json)
- [MultiLineString](http://geojson.org/schema/MultiLineString.json)
- [MultiPoint](http://geojson.org/schema/MultiPoint.json)
- [Polygon](http://geojson.org/schema/Polygon.json)
- [LineString](http://geojson.org/schema/LineString.json)
- [Point](http://geojson.org/schema/Point.json)

### Provider definition

Provider definition objects are used when [creating geoStore objects](#create-using-a-provider-definition-object) and may also be included in geoStore objects. At present the only provider definition supported is a [Carto](https://carto.com/) table, using `"type": "carto"`.

> Provider schema

```json
{
    "description": "Defines properties for selecting a single feature from a remote feature collection.",
    "examples": [
        {
            "type": "carto",
            "table": "gfw_mining",
            "user": "wri-01",
            "filter": "cartodb_id=573"
        }
    ],
    "required": [
        "type",
        "table",
        "user",
        "filter"
    ],
    "title": "Provider",
    "type": "object",
    "properties": {
        "type": {
            "const": "carto",
            "description": "The provider name keyword",
            "title": "Type",
            "type": "string"
        },
        "table": {
            "description": "The provider table name to query.",
            "examples": [
                "gfw_mining"
            ],
            "title": "Table",
            "type": "string"
        },
        "user": {
            "description": "The provider username.",
            "examples": [
                "wri-01"
            ],
            "title": "User",
            "type": "string"
        },
        "filter": {
            "description": "Query used to select a single row of the table. Both AND & OR conditions are accepted.",
            "examples": [
                "cartodb_id=573"
            ],
            "title": "Filter",
            "type": "string"
        }
    }
}
```

### geoStore

geoStore objects are created in, and retrieved from the Geostore. They define geographic strutures using the GeoJSON schema, as well as summary information, properties used for indexing, and metadata.

They must contain a Geostore ID  and hash (`id`, `hash`), [GeoJSON](#geojson) object (`geojson`), indication if the object is locked to editing (`lock`), and bounding box of the GeoJSON geometries (`bbox`). Optionally they may contain a [Provider](#provider-definition) object (`provider`), the total surface area of all Polygon and MultiPolygon geometries (`areaHa`), and an `info` object with application/user defined properties.

> geoStore schema

```json
{
    "description": "Defines geometries described using the GeoJSON schema, the bounding box of the geometries, optionally the total surface area of Polygon and MulitPolygon geometries, properties used for indexing, and metadata.",
    "examples": [
        {
            "data": {
                "type": "geoStore",
                "id": "170f0ba59b3645de8f27e080a8ab4c78",
                "attributes": {
                    "geojson": {},
                    "hash": "170f0ba59b3645de8f27e080a8ab4c78",
                    "provider": {},
                    "areaHa": 100.5,
                    "bbox": [],
                    "lock": false,
                    "info": {}
                }
            }
        }
    ],
    "required": [
        "data"
    ],
    "title": "geoStore",
    "type": "object",
    "properties": {
        "data": {
            "description": "Contians geoStore data.",
            "required": [
                "type",
                "id",
                "attributes"
            ],
            "title": "Data",
            "type": "object",
            "properties": {
                "type": {
                    "description": "Object type.",
                    "title": "Type",
                    "type": "string"
                },
                "id": {
                    "description": "Unique identification code of the object. Equals hash.",
                    "title": "Id",
                    "type": "string"
                },
                "attributes": {
                    "description": "Contains attributes of the object.",
                    "required": [
                        "geojson",
                        "hash",
                        "bbox",
                        "lock"
                    ],
                    "title": "Attributes",
                    "type": "object",
                    "properties": {
                        "geojson": {
                            "description": "GeoJSON object.",
                            "title": "GeoJSON",
                            "type": "object"
                        },
                        "hash": {
                            "description": "MD5 hash generated from geojson. Equals id.",
                            "title": "Hash",
                            "type": "string"
                        },
                        "provider": {
                            "description": "Provider definition object.",
                            "title": "Provider",
                            "type": ["object"]
                        },
                        "areaHa": {
                            "description": "Total surface area in hectares of all Polygon and Multipolygon geometries.",
                            "title": "AreaHa",
                            "type":  ["number"]
                        },
                        "bbox": {
                            "description": "An array of latitude and longitude coordinates (xmin, ymin, xmax, ymax) defining the bounding box of all geometries.",
                            "maxItems": 4,
                            "maximum": 90,
                            "minLength": 4,
                            "minimum": -90,
                            "title": "Bbox",
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "lock": {
                            "default": false,
                            "description": "Should the object be protected from editing.",
                            "title": "Lock schema",
                            "type": "boolean"
                        },
                        "info": {
                            "description": "An object containing metadata, indexes and user defined properties.",
                            "title": "Info",
                            "type": "object"
                        }
                    }
                }
            }
        }
    }
}
```
