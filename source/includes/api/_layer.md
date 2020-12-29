# Layer

## What is a layer?

By now, you are probably already familiar with [datasets](#dataset) and [querying](#query) them (if you are not, now is a good time to get up to speed on those). Many of the datasets you'll find on the RW API - and perhaps the datasets you are uploading too - contain georeferenced information. If that's the case, then you may want to render your data as a web map layer, and the RW API's *layer* endpoints can help you with that.

As we've seen in the [layer concept docs](#layer), a RW API layer may store data in different formats, depending on the needs of its author. This is done using the several open format fields a layer has. To keep this documentation easy to understand, we'll spit our approach to layers into two sections:

- We'll first discuss the details of the endpoints that allow you to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) layers, without focusing on the actual data contained in it.
- In an future version of these docs, we'll dive deeper into some of the most common structures used to store data in the layer's open format fields.

After viewing the documentation below, consider looking at the [webmap tutorial](https://resource-watch.github.io/doc-api/tutorials.html#mapbox-webmap-quickstart) for a step-by-step guide to rendering an actual layer on a web application.


## Getting all layers


> Getting a list of layers

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer"
```

> Example response:

```json
{
    "data": [
        {
            "id": "e5c3e7c5-19ae-4ca0-a461-71f1f67aa553",
            "type": "layer",
            "attributes": {
                "slug": "total-co2-emissions-by-year",
                "userId": "5858f37140621f11066fb2f7",
                "application": [
                    "rw"
                ],
                "name": "Total CO2 emissions by year",
                "default": false,
                "dataset": "11de2bc1-368b-42ed-a207-aaff8ece752b",
                "env": "production",
                "provider": "cartodb",
                "iso": [],
                "description": null,
                "layerConfig": {
                    "account": "rw",
                    "body": {
                        "maxzoom": 18,
                        "minzoom": 3,
                        "layers": [
                            {
                                "type": "mapnik",
                                "options": {
                                    "sql": "SELECT * cait_2_0_country_ghg_emissions_filtered",
                                    "cartocss": "",
                                    "cartocss_version": "2.3.0"
                                }
                            }
                        ]
                    }
                },
                "legendConfig": {
                    "marks": {
                        "type": "rect",
                        "from": {
                            "data": "table"
                        }
                    }
                },
                "applicationConfig": {},
                "staticImageConfig": {}
            }
        }
    ],
    "links": {
        "self": "https://api.resourcewatch.org/v1/layer?page[number]=1&page[size]=10",
        "first": "https://api.resourcewatch.org/v1/layer?page[number]=1&page[size]=10",
        "last": "https://api.resourcewatch.org/v1/layer?page[number]=634&page[size]=10",
        "prev": "https://api.resourcewatch.org/v1/layer?page[number]=1&page[size]=10",
        "next": "https://api.resourcewatch.org/v1/layer?page[number]=2&page[size]=10"
    },
    "meta": {
        "total-pages": 63,
        "total-items": 628,
        "size": 10
    }
}
```

This endpoint allows you to list existing layers and their properties. The result is a paginated list of 10 layers, followed by metadata on total number of layers and pages, as well as useful pagination links. By default, only layers with `env` value `production` are displayed. In the sections below, we’ll explore how you can customize this endpoint call to match your needs.


### Getting all layers for a dataset

> Return the layers associated with a dataset

```shell
curl -X GET "https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer"
```

When handling layers, it's common to want to limit results to those layers associated with a given dataset. Besides the [filters](#filters132) covered below, there's an additional convenience endpoint to get the layers associated with a dataset, as shown in this example. 
 

### Getting all layers for multiple datasets

> Return all layers associated with two datasets

```shell
curl -X POST "https://api.resourcewatch.org/layer/find-by-ids" \
-H "Authorization: Bearer <your-token>" \
-H 'Content-Type: application/json' \
-d '{
	"ids": ["<dataset 1 id>", "<dataset 2 id>"]
}'
```

```json
{
    "data": [
        {
            "id": "0dc39924-5736-4898-bda4-49cdc2f3b208",
            "type": "layer",
            "attributes": {
                "name": "NOAA NEXt-Generation RADar (NEXRAD) Products (Locations)",
                "slug": "noaa-next-generation-radar-nexrad-products-locations",
                "dataset": "0b9e546c-f42a-4b26-bad3-7d606f58961c",
                "description": "",
                "application": [
                    "prep"
                ],
                "iso": [
                    "USA"
                ],
                "provider": "arcgis",
                "userId": "legacy",
                "default": true,
                "protected": false,
                "published": false,
                "env": "production",
                "layerConfig": {
                    "body": {
                        "useCors": false,
                        "layers": [
                            0
                        ],
                        "url": "https://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/nexrad/MapServer"
                    },
                    "type": "dynamicMapLayer"
                },
                "legendConfig": {
                    "type": "basic",
                    "items": [
                        {
                            "name": "NEXRAD",
                            "color": "#FF0000",
                            "icon": "http://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/nexrad/MapServer/0/images/47768c7d812818af98d8da03a04d4fe4"
                        }
                    ]
                },
                "interactionConfig": {},
                "applicationConfig": {},
                "staticImageConfig": {},
                "createdAt": "2016-09-07T14:50:22.578Z",
                "updatedAt": "2017-12-18T12:08:25.703Z"
            }
        },
        {
            "id": "0b021478-f4d3-4a1e-ae88-ab97f0085bc9",
            "type": "layer",
            "attributes": {
                "name": "Projected change in average precipitation (in)",
                "slug": "projected-change-in-average-precipitation-between-u-s",
                "dataset": "d443beca-d199-4872-9d7d-d82c45e43151",
                "description": "Projected change in average precipitation for the A2 emissions scenario.",
                "application": [
                    "prep"
                ],
                "iso": [
                    "USA"
                ],
                "provider": "arcgis",
                "userId": "legacy",
                "default": true,
                "protected": false,
                "published": false,
                "env": "production",
                "layerConfig": {
                    "body": {
                        "use-cors": false,
                        "layers": [
                            12
                        ],
                        "url": "https://gis-gfw.wri.org/arcgis/rest/services/prep/nca_figures/MapServer"
                    },
                    "zoom": 4,
                    "center": {
                        "lat": 39.6395375643667,
                        "lng": -99.84375
                    },
                    "type": "dynamicMapLayer",
                    "bbox": [
                        -125.61,
                        24.73,
                        -66.81,
                        49.07
                    ]
                },
                "legendConfig": {
                    "type": "choropleth",
                    "items": [
                        {
                            "value": "< -90",
                            "color": "#8C5107"
                        },
                        {
                            "value": "-90 - -60",
                            "color": "#BF822B"
                        }
                    ]
                },
                "interactionConfig": {},
                "applicationConfig": {},
                "staticImageConfig": {},
                "createdAt": "2016-09-15T13:47:39.829Z",
                "updatedAt": "2018-03-02T20:54:17.260Z"
            }
        }
    ]
}
```

This endpoint allows authenticated users to load all layers belonging to multiple datasets in a single request. 

> Return all layers associated with two datasets, that are associated with either `rw` or `prep` applications 

```shell
curl -X POST "https://api.resourcewatch.org/layer/find-by-ids" \
-H "Authorization: Bearer <your-token>" \
-H 'Content-Type: application/json' \
-d '{
	"ids": ["<dataset 1 id>", "<dataset 2 id>"],
    "app" "rw,prep"
}'
```

> Return all layers associated with two datasets, that are associated with both `rw` and `prep` applications simultaneously 

```shell
curl -X POST "https://api.resourcewatch.org/layer/find-by-ids" \
-H "Authorization: Bearer <your-token>" \
-H 'Content-Type: application/json' \
-d '{
	"ids": ["<dataset 1 id>", "<dataset 2 id>"],
    "app" "rw@prep"
}'
```

Besides the required `ids` array, your request body may optionally include a `app` string value if you'd like to filter the returned layers by their `application`:

- Use a single value, like `rw`, if you want to show only layers that have `rw` as one of their applications. 
- Use a comma separated list, like `rw,prep`, if you want to show only layers that have `rw` or `prep` as one of their applications.
- Use a @ separated list, like `rw@prep`, if you want to show only layers that have both `rw` and `prep` as their applications.
- Note that the the filters do not need to match on the full application list. For example, the filters `rw,prep` and `rw@prep` will both match a layer with the application list `["rw", "prep", "gfw"]`.

Please note that, unlike [getting all layers](#getting-all-layers) or [getting all layers for a dataset](#getting-all-layers-for-a-dataset), this endpoint does not come with paginated results, nor does it support [pagination](#pagination113), [filtering](#filters114) or [sorting](#sorting115) or [including related entities](#include-related-entities116) described in their respective sections.
 

### Pagination

> Example request to load page 2 using 25 results per page

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?page[number]=2&page[size]=25"
```

The Layers service adheres to the conventions defined in the [Pagination guidelines for the RW API](/index-rw.html#pagination), so we recommend reading that section for more details on how paginate your layers list.

### Filters

> Return the layers filtered by those whose name contains emissions

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?name=emissions"
```

> Return the layers filtered by dataset

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?dataset=11de2bc1-368b-42ed-a207-aaff8ece752b"
curl -X GET "https://api.resourcewatch.org/v1/dataset/11de2bc1-368b-42ed-a207-aaff8ece752b/layer"
```

> Filter layers by published status

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?published=false"
```

> Filter layers by environment


```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?env=staging"
```

> Return the layers filtered by those whose applications contain rw

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?app=rw"
```

The layer list endpoint provides a wide range of filters that you can use to tailor your layer listing. Filtering layers adheres to the conventions defined in the [Filter guidelines for the RW API](/index-rw.html#filtering), so we strongly recommend reading that section before proceeding. In addition to these conventions, you will be able to use the great majority of the layer fields you'll find on the [layer reference](#layer-reference) section, with the following exceptions:

- `id`
- `userName`
- `userRole`: filtering by the role of the owning user can be done using the `user.role` query argument. If the requesting user does not have the ADMIN role, this filter is ignored.
- Filtering by fields of type `Object` is not supported.

Additionally, you can use the following filters:

- `collection`: filters by a [collection](#collections) id. Requires being authenticated.
- `favourite`: if defined, only the layers set by the user as [favorites](#favorites) will be returned. Requires being authenticated.

### Sorting

> Sorting layers

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?sort=name"
```

> Sorting layers by multiple criteria

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?sort=name,slug"
```

> Explicit order of sorting

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?sort=-name,+slug"
```

> Sorting layers by the role of the user who owns the layer

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?sort=user.role"
```

The Layer service currently supports sorting using the `sort` query parameter. Sorting layer adheres to the conventions defined in the [Sorting guidelines for the RW API](/index-rw.html#sorting), so we strongly recommend reading that section before proceeding. Additionally, you can check out the [Layer reference](#layer-reference) section for a detailed description of the fields you can use when sorting. In addition to all layer model fields, you can sort the returned results by the name (using `user.name`) or role (using `user.role`) of the user owner of the layer. Keep in mind that sorting by user data is restricted to ADMIN users.

### Include entities associated with the layers

When fetching layers, you can request additional entities to be loaded. The following entities are available:

#### Vocabulary

> Loads vocabulary associated with each layer:

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?includes=vocabulary"
```

> Example response:

```json
{
    "data": [
        {
            "id": "e5c3e7c5-19ae-4ca0-a461-71f1f67aa553",
            "type": "layer",
            "attributes": {
                "slug": "total-co2-emissions-by-year",
                "userId": "5858f37140621f11066fb2f7",
                "application": [
                    "rw"
                ],
                "name": "Total CO2 emissions by year",
                "default": false,
                "dataset": "11de2bc1-368b-42ed-a207-aaff8ece752b",
                "env": "production",
                "provider": "cartodb",
                "iso": [],
                "description": null,
                "layerConfig": {
                    "account": "rw",
                    "body": {
                        "maxzoom": 18,
                        "minzoom": 3,
                        "layers": [
                            {
                                "type": "mapnik",
                                "options": {
                                    "sql": "SELECT * cait_2_0_country_ghg_emissions_filtered",
                                    "cartocss": "",
                                    "cartocss_version": "2.3.0"
                                }
                            }
                        ]
                    }
                },
                "legendConfig": {
                    "marks": {
                        "type": "rect",
                        "from": {
                            "data": "table"
                        }
                    }
                },
                "applicationConfig": {},
                "staticImageConfig": {},
                "vocabulary": [
                    {
                        "id": "resourcewatch",
                        "type": "vocabulary",
                        "attributes": {
                            "tags": [
                                "inuncoast",
                                "rp0002",
                                "historical",
                                "nosub"
                            ],
                            "name": "resourcewatch",
                            "application": "rw"
                        }
                    }
                ]
            }
        }
    ]
}
```

Loads all vocabulary entities associated with each layer. Internally this uses the [getting vocabularies associated to a resource](#getting-vocabularies-associated-to-a-resource) endpoint, and thus it's affected by its behavior - particularly, only vocabularies associated with the `rw` application will be listed. There's currently no way to modify this behavior.



#### User

Loads the name and email address of the author of the layer. If you request this issue as an authenticated user with `ADMIN` role, you will additionally get the author's role.

If the data is not available (for example, the user has since been deleted), no `user` property will be added to the layer object.

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?includes=user"
```

> Example response:

```json
{
    "data": [
        {
            "id": "e5c3e7c5-19ae-4ca0-a461-71f1f67aa553",
            "type": "layer",
            "attributes": {
                "slug": "total-co2-emissions-by-year",
                "userId": "5858f37140621f11066fb2f7",
                "application": [
                    "rw"
                ],
                "name": "Total CO2 emissions by year",
                "default": false,
                "dataset": "11de2bc1-368b-42ed-a207-aaff8ece752b",
                "env": "production",
                "provider": "cartodb",
                "iso": [],
                "description": null,
                "layerConfig": {
                    "account": "rw",
                    "body": {
                        "maxzoom": 18,
                        "minzoom": 3,
                        "layers": [
                            {
                                "type": "mapnik",
                                "options": {
                                    "sql": "SELECT * cait_2_0_country_ghg_emissions_filtered",
                                    "cartocss": "",
                                    "cartocss_version": "2.3.0"
                                }
                            }
                        ]
                    }
                },
                "legendConfig": {
                    "marks": {
                        "type": "rect",
                        "from": {
                            "data": "table"
                        }
                    }
                },
                "applicationConfig": {},
                "staticImageConfig": {},
                "user": {
                    "name": "John Doe",
                    "email": "john.doe@vizzuality.com"
                }
            }
        }
    ]
}
```

#### Requesting multiple additional entities

You can request multiple related entities in a single request using commas to separate multiple keywords

```shell
curl -X GET "https://api.resourcewatch.org/v1/layer?includes=user,vocabulary"
```


## Getting a layer by id or slug


> Getting a layer by id:

```shell
curl -X GET "https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer_id>"
curl -X GET "https://api.resourcewatch.org/v1/layer/<layer_id>"
```

> Getting a layer by slug:

```shell
curl -X GET "https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer_slug>"
curl -X GET "https://api.resourcewatch.org/v1/layer/<layer_slug>"
```

> Example response:

```json
{
   "data": {
       "id": "e5c3e7c5-19ae-4ca0-a461-71f1f67aa553",
       "type": "layer",
       "attributes": {
           "slug": "total-co2-emissions-by-year",
           "userId": "5858f37140621f11066fb2f7",
           "application": [
               "rw"
           ],
           "name": "Total CO2 emissions by year",
           "default": false,
           "dataset": "11de2bc1-368b-42ed-a207-aaff8ece752b",
           "env": "production",
           "provider": "cartodb",
           "iso": [],
           "description": null,
           "layerConfig": {
               "account": "rw",
               "body": {
                   "maxzoom": 18,
                   "minzoom": 3,
                   "layers": [
                       {
                           "type": "mapnik",
                           "options": {
                               "sql": "SELECT * cait_2_0_country_ghg_emissions_filtered",
                               "cartocss": "",
                               "cartocss_version": "2.3.0"
                           }
                       }
                   ]
               }
           },
           "legendConfig": {
               "marks": {
                   "type": "rect",
                   "from": {
                       "data": "table"
                   }
               }
           },
           "applicationConfig": {},
           "staticImageConfig": {}
       }
   },
   "meta": {
       "status": "saved",
       "published": true,
       "updatedAt": "2017-01-23T16:51:42.571Z",
       "createdAt": "2017-01-23T16:51:42.571Z"
   }
}
```

If you know the id or the `slug` of a layer, then you can access it directly. Both id and `slug` are case-sensitive.

### Include entities associated with the layer

You can load related `user` and `vocabulary` data in the same request. See [this section](#include-entities-associated-with-the-layers) for more details.


## Creating a layer

> To create a layer, you need to provide at least the following details:


```shell
curl -X POST "https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your-token>" \
-d  \
'{
    "application": [
      "rw"
    ],
    "name": "Water stress",
    "description": "water stress"
}'
```

> Response:


```json
{
    "data": {
        "id": "bd8a36df-2e52-4b2d-b7be-a48bdcd7c769",
        "type": "layer",
        "attributes": {
            "name": "Water stress",
            "slug": "Water-stress_7",
            "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
            "description": "water stress",
            "application": [
                "rw"
            ],
            "iso": [],
            "userId": "5dbadb06df2dc74d2ad054fb",
            "default": false,
            "protected": false,
            "published": true,
            "env": "production",
            "layerConfig": {},
            "legendConfig": {},
            "interactionConfig": {},
            "applicationConfig": {},
            "staticImageConfig": {},
            "createdAt": "2020-06-04T14:28:24.575Z",
            "updatedAt": "2020-06-04T14:28:24.575Z"
        }
    }
}
```

In this section we'll guide you through the process of creating a layer in the RW API. Layer creation is available to all registered API users, and will allow you to store your own layer visualisation settings on the API, for reusing and sharing.

Before creating a layer, there are a few things you must know and do:

- In order to be able to create a layer, you need to be [authenticated](#authentication).
- Depending on your user account's role, you may have permission to create a layer but not delete it afterwards - read more about this in [the RW API role-based access control guidelines](/index-rw.html#role-based-access-control).
- The layers you create on the RW API will be publicly visible and available to other users.

Creating a layer is done using a POST request and passing the relevant data as body fields. The supported body fields are as defined on the [layer reference](#layer-reference) section, but the minimum field list you must specify for all layers is:

- name
- description 
- application

There's also a dependency on a dataset id, as it is required to build the POST URL. As noted on the [layer concept](#layer) documentation, a layer is meant to hold the rendering details of a layer, but not the actual data - that should be part of the dataset. While this is not enforced - it's up to your rendering tool to load the data, and it can do it from a RW API dataset or from anywhere else - it's common and best practice to have the data for a layer be sourced from the dataset that's associated with it.

When a layer is created, a [vocabulary tag](#vocabulary-and-tags) for it is automatically created, associated with the dataset tag.

The layer service was built to be very flexible, and not be restricted to specific layer rendering libraries or tools. This gives you the freedom to use virtually any rendering technology you want, but it also means you'll have to make additional decisions on how to structure your data into the different open format fields provided by a RW API layer. In a future release of these docs, we'll show you some examples of how existing applications use different rendering tools with the layer endpoints, to give you an idea on how you can structure your own data, and also as a way to help you get started creating your first layers for your own custom applications. Until then, the [tutorials section of the documentation](https://resource-watch.github.io/doc-api/tutorials.html) shows an example of how existing raster tile layers may be structured and how the information in the layer response can be utilized by a third-party visualization library.

#### Errors for creating a layer

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | `<field>`: `<field>` can not be empty | Your are missing a required field value.
400            | - `<field>`: must be a `<restriction>` | The value provided for the mentioned field does not match the requirements.
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create a layer with one or more `application` values that are not associated with your user account. 
404            | Dataset not found | The provided dataset id does not exist. 
404            | Error: StatusCodeError: 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset not found\"}]} | The provided dataset exists but is not present on the [graph](#graph).

## Updating a layer

> Example PATCH request that updates a layer's name:

```shell
curl -X PATCH "https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer_id>" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
'{
  "name":"foo"
}'
```

The update layer endpoint allows you to modify the details of an existing layer. As noted on the [layer concept](#layer) documentation, the layer object stores the details of how layer is meant to be rendered, but does not contain the actual data. As such, if you are looking to update the data that's being displayed on your map, this is probably not the endpoint you're looking for - you may want to [update your dataset](#updating-a-dataset) instead. Use this endpoint if you want to modify things like legend details, color schemes, etc - this will depend on your rendering implementation. 

Unless specified otherwise in their description, all the fields present in the [layer reference](#layer-reference) section can be updated using this endpoint. When passing new values for Object type fields, the new value will fully overwrite the previous one. It’s up to you, as an API user, to build any merging logic into your application.

To perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the layer
- the user must comply with [the RW API role-based access control guidelines](/index-rw.html#role-based-access-control).

#### Errors for updating a layer

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | - `<field>`: must be a `<restriction>` | The value provided for the mentioned field does not match the requirements.
401            | Unauthorized   | You need to be logged in to be able to update a layer.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the layer's owner (through the `userId` field of the layer).
403            | Forbidden      | You are trying to update a layer with one or more `application` values that are not associated with your user account. 
404            | Layer with id <id> doesn't exist   | A layer with the provided id does not exist.
404            | Dataset not found   | A dataset with the provided id does not exist.

## Deleting a layer

> Example DELETE request that deletes a layer:

```shell
curl -X DELETE "https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer_id>" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

> Response:

```json
{
    "data": {
        "id": "bd8a36df-2e52-4b2d-b7be-a48bdcd7c769",
        "type": "layer",
        "attributes": {
            "name": "Water stress",
            "slug": "Water-stress_7",
            "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
            "description": "water stress",
            "application": [
                "rw"
            ],
            "iso": [],
            "userId": "5dbadb06df2dc74d2ad054fb",
            "default": false,
            "protected": false,
            "published": true,
            "env": "production",
            "layerConfig": {},
            "legendConfig": {},
            "interactionConfig": {},
            "applicationConfig": {},
            "staticImageConfig": {},
            "createdAt": "2020-06-04T14:28:24.575Z",
            "updatedAt": "2020-06-04T14:28:24.575Z"
        }
    }
}
```


Use this endpoint if you'd like to delete a layer from the RW API. As a layer object does not store the actual data being displayed, this will only delete the layer settings, but the actual data will continue to be available at its source.

Besides deleting the layer itself, this endpoint also deletes graph vocabularies and metadata related to the layer itself. These delete operations are issued after the layer itself is deleted. The process is not atomic, and the output of the API request is based solely on the result of the deletion of the layer itself. For example, is the metadata service is temporarily unavailable when you issue your delete layer request, the layer itself will be deleted, but the associated metadata will continue to exist. The response will not reflect the failure to delete metadata in any way.

In order to delete a layer, the following conditions must be met:

- the layer's `protected` property must be set to `false`.
- the user must be logged in and belong to the same application as the layer.
- the user must comply with [the RW API role-based access control guidelines](/index-rw.html#role-based-access-control).

#### Errors for deleting a layer

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | Layer is protected | You are attempting to delete a layer that has `protected` set to prevent deletion.
401            | Unauthorized   | You need to be logged in to be able to delete a layer.
403            | Forbidden      | You need to either have the `ADMIN` role, or have role `MANAGER` and be the layer's owner (through the `userId` field of the layer)
404            | Dataset not found | A dataset with the provided id does not exist.
404            | Layer with id <id> doesn't exist   | A layer with the provided id does not exist.


## Layer reference

This section gives you a complete view at the properties that are maintained as part of layer. When interacting with a layer (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/resource-watch/layer/blob/master/app/src/models/layer.model.js).

Field name              | Type           | Required             | Default value              | Description                                                                  
----------------------- | -------------- | -------------------- |----------------------------| ---------------------------------------------------------------------------- 
id                      | String         | Yes (autogenerated)  |                            | Unique Id of the layer. Auto generated on creation. Cannot be modified by users.    
name                    | String         | Yes                  |                            | Name of the layer.              
dataset                 | String         | Yes                  |                            | Id of the dataset to which the layer corresponds. Set on layer creation, cannot be modified.   
slug                    | String         | Yes (autogenerated)  |                            | Slug of the layer. Auto generated on creation. Cannot be modified by users.  
description             | String         | No                   |                            | User defined description of the layer.   
application             | Array          | Yes                  |                            | Applications associated with this layer. Read more about this field [here](/index-rw.html#applications).
iso                     | Array          | No                   |                            | List of ISO3 codes of the countries that relate to the layer. If empty (or contains a single element: 'global') then the layer is a global layer.
provider                | String         | No                   |                            | Layer provider. It typically identifies the source service for the data displayed in the layer.
type                    | String         | No                   |                            | Layer type.
userId                  | String         | Yes (autopopulated)  |                            | Id of the user who created the layer. Set automatically on creation. Cannot be modified by users.
default                 | Boolean        | No                   | false                      | If the layer should be used as the dataset's default layer.
protected               | Boolean        | Yes                  | false                      | If the layer is protected. A protected layer cannot be deleted.               
published               | Boolean        | Yes                  | true                       | If the layer is published or not.                                               
env                     | String         | Yes                  | production                 | Environment to which the layer belongs. Read more about this field in the [Environments concept section](/index-rw.html#environments).
applicationConfig       | Object         | No                   |                            | Schema-less object meant to host application-specific data or behavior configuration.
layerConfig             | Object         | No                   |                            | Schema-less object meant to define layer specific data, like source of data, styling and animation settings.
legendConfig            | Object         | No                   |                            | Schema-less object meant to define how a layer legend should be represented visually.
staticImageConfig       | Object         | No                   |                            | 
interactionConfig       | Object         | No                   |                            | Schema-less object meant to define interactive layer element behavior, ie.: how tooltips behave on click.
userName                | String         | No (autogenerated)   | null                       | Name of the user who created the layer. This value is used only internally, and is never directly exposed through the API. Cannot be modified by users.        
userRole                | String         | No (autogenerated)   | null                       | Role of the user who created the layer. This value is used only internally, and is never directly exposed through the API. Cannot be modified by users. 
createdAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the layer was created. Cannot be modified by users.                     
updatedAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the layer was last updated. Cannot be modified by users.                





## Contextual layers

### What is a contextual layer

TODO: missing the why???

### Getting contextual layers

> Getting the list of contextual layers:

```shell
curl -X GET "https://api.resourcewatch.org/v1/contextual-layer" \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json
{
    "data": [
        {
            "type": "contextual-layers",
            "id": "59a979235f17780012d7dfcf",
            "attributes": {
                "isPublic": true,
                "name": "layers.treeCoverLoss2015",
                "url": "https://production-api.globalforestwatch.org/contextual-layer/loss-layer/2015/2016/{z}/{x}/{y}.png",
                "enabled": true,
                "owner": {
                    "type": "USER"
                },
                "createdAt": "2017-09-01T15:13:39.502Z"
            }
        }
    ]
}
```

This endpoint allows you to list the existing contextual layers and their properties. Keep in mind this endpoint is restricted to authenticated users, so always remember to provide your authentication token when calling this endpoint. The result is **not** paginated, so you will receive as many layers as there are available for your user or team in the `data` index of the response.

#### Filters

> Return only contextual layers with the `enabled` attribute equal to true:

```shell
curl -X GET "https://api.resourcewatch.org/v1/contextual-layer?enabled=true" \
-H "Authorization: Bearer <your-token>"
```

The contextual layer list endpoint allows you to filter by the `enabled` attribute, to retrieve only enabled or disabled layers.

#### Sorting

Sorting is currently not supported for contextual layers.

#### Errors for getting contextual layers

Error code | Error message                    | Description
---------- | -------------------------------- | ------------------------------------------------------------
401        | Unauthorized                     | You haven't provided your authentication token.
500        | Error while retrieving user team | An internal error occurred while fetching the request user's team.

### Creating a contextual layer for a user

> To create a contextual layer for a user, you need to provide at least the following fields:

```shell
curl -X POST "https://api.resourcewatch.org/v1/contextual-layer" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your-token>" \
-d  \
'{
    "name": "Test",
    "url": "https://example.com/contextual-layer/{z}/{x}/{y}.png"
}'
```

> Example successful response for creating a contextual layer:

```json
{
    "data": {
        "type": "contextual-layers",
        "id": "5fe9fe6bdc8bd5001bbcb9d0",
        "attributes": {
            "isPublic": false,
            "name": "Test",
            "url": "https://example.com/contextual-layer/{z}/{x}/{y}.png",
            "enabled": false,
            "owner": {
                "type": "USER"
            },
            "createdAt": "2020-12-28T15:48:59.812Z"
        }
    }
}
```

In the RW API, contextual layers can be associated with either a user or a team. This section details the information you need to provide to create a contextual layer associated with a user. This endpoint is available to all registered API users.

You can create a contextual layer by calling a POST request, passing the relevant data as body fields. The supported body fields are as defined on the [contextual layer reference](#contextual-layer-reference) section, but the minimum field list you must specify for all contextual layers is `name` and `url`.

#### Errors for creating a contextual layer for a user

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | Bad Request    | The structure of the JSON request payload is not valid.
401            | Unauthorized   | You haven't provided your authentication token.
500            | Layer creation Failed. | The creation of the contextual layer failed, check if you are sending all the required fields.

### Creating a contextual layer for a team

> To create a contextual layer for a team, you need to provide at least the following fields:

```shell
curl -X POST "https://api.resourcewatch.org/v1/contextual-layer/team/:teamId" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your-token>" \
-d  \
'{
    "name": "Test",
    "url": "https://example.com/contextual-layer/{z}/{x}/{y}.png"
}'
```

> Example successful response for creating a contextual layer:

```json
{
    "data": {
        "type": "contextual-layers",
        "id": "5fe9fe6bdc8bd5001bbcb9d0",
        "attributes": {
            "isPublic": false,
            "name": "Test",
            "url": "https://example.com/contextual-layer/{z}/{x}/{y}.png",
            "enabled": false,
            "owner": {
                "type": "USER"
            },
            "createdAt": "2020-12-28T15:48:59.812Z"
        }
    }
}
```

In the RW API, contextual layers can be associated with either a user or a team. This section details the information you need to provide to create a contextual layer associated with a team. This endpoint is available to all registered API users.

You can create a contextual layer by calling a POST request, passing the relevant data as body fields. The supported body fields are as defined on the [contextual layer reference](#contextual-layer-reference) section, but the minimum field list you must specify for all contextual layers is is `name` and `url`.

#### Errors for creating a contextual layer for a user

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | Bad Request    | The structure of the JSON request payload is not valid.
401            | Unauthorized   | You haven't provided your authentication token.
500            | Layer creation Failed. | The creation of the contextual layer failed, check if you are sending all the required fields.
500            | Team retrieval Failed. | An error occurred while fetching the information about the team with id provided, check your are providing a valid team id.

### Updating a contextual layer

> Example PATCH request to update a contextual layer:

```shell
curl -X PATCH "https://api.resourcewatch.org/v1/contextual-layer/:layerId" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
'{
    "name": "Test 2",
    "url": "https://example.com/contextual-layer/{z}/{x}/{y}.png"
}'
```

> Example successful response for updating a contextual layer:

```json
{
    "data": {
        "type": "contextual-layers",
        "id": "5fe9fe6bdc8bd5001bbcb9d0",
        "attributes": {
            "isPublic": false,
            "name": "Test 2",
            "url": "https://example.com/contextual-layer/{z}/{x}/{y}.png",
            "enabled": false,
            "owner": {
                "type": "USER"
            },
            "createdAt": "2020-12-28T15:48:59.812Z"
        }
    }
}
```

To update the details of an existing contextual layer (either created for a user or a team), you need to issue a PATCH request. This endpoint is available to all registered API users. Keep in mind that, as in the case of creating a contextual layer, you need to provide at least `name` and `url` in all update contextual layer requests. Remember that you can check the [contextual layer reference](#contextual-layer-reference) section for the list of fields available.

Updating contextual layers also has some caveats:

- you can only update the `enabled` attribute of contextual layers you own, or contextual layers that belong to a team which you manage - if one of these conditions is not met, the `enabled` attribute value is kept as is.
- you can only update the `isPublic` attribute of contextual layers if you are an `ADMIN` user and the contextual layer you are trying to update is owned by a user (not by a team) - in all other cases, the `isPublic` attribute value is kept as is.

#### Errors for updating a layer

Error code     | Error message           | Description
-------------- | ----------------------- | ---------------------------------------------------------------------------------
404            | Layer not found         | No contextual layer was found for the provided id.
500            | Layer retrieval failed. | An error occurred while fetching the layer information from the database.
500            | Team retrieval Failed.  | An error occurred while fetching the information about the team with id provided.
500            | Layer update failed.    | An error occurred while saving the updated information of the contextual layer.

### Deleting a contextual layer

> Example DELETE request to delete a contextual layer:

```shell
curl -X DELETE "https://api.resourcewatch.org/v1/contextual-layer/:layerId" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

Use this endpoint if you'd like to delete a contextual layer from the RW API. In order to delete a contextual layer, you must either be an `ADMIN` user, or, alternatively, meet the following conditions:

- the contextual layer's `isPublic` property must be set to `false`.
- if the contextual layer is owned by a user, you must be the owner of the contextual layer.
- if the contextual layer is owned by a team, you must be one of the managers of the team that owns the contextual layer.

If successful, the request to delete a contextual layer returns a 204 No Content response.

#### Errors for deleting a layer

Error code     | Error message           | Description
-------------- | ----------------------- | ---------------------------------------------------------------------------------
404            | Layer not found         | No contextual layer was found for the provided id.
500            | Layer retrieval failed. | An error occurred while fetching the layer information from the database.
500            | Team retrieval Failed.  | An error occurred while fetching the information about the team with id provided.
500            | Layer update failed.    | An error occurred while saving the updated information of the contextual layer.

### Contextual layer reference

This section gives you a complete view at the properties that are maintained as part of a contextual layer. When interacting with a contextual layer (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/gfw-api/fw-contextual-layers/blob/dev/app/src/models/layer.model.js).

Field name  | Type    | Required            | Default value  | Description                                                                  
----------- | ------- | ------------------- |--------------- | -------------------------------------- 
id          | String  | Yes (autogenerated) |                | Unique Id of the contextual layer. Auto generated on creation. Cannot be modified by users.
name        | String  | Yes                 |                | Name of the contextual layer.              
description | String  | No                  |                | Description of the contextual layer.              
url         | String  | Yes                 |                | URL to fetch tiles for the contextual layer.              
isPublic    | Boolean | Yes                 | false          | If the contextual layer is publicly accessible.
enabled     | Boolean | Yes                 | false          | If the contextual layer is enabled.
owner       | Object  | No                  |                | Object containing information about the owner of the contextual layer.
owner.type  | String  | Yes                 |                | Type of the owner of the layer - can be `USER` or `TEAM`.
owner.id    | String  | Yes                 |                | Id of the user or team (according to the value of the `owner.type` attribute) owner of the contextual layer.
createdAt   | Date    | No (autogenerated)  | <current date> | Automatically maintained date of when the contextual layer was created. Cannot be modified by users.
