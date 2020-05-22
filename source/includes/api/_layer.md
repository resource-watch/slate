# Layer

## What is a layer?

By now, you are probably already familiar with [datasets](#dataset) and [querying](#query) them (if you are not, now is a good time to get up to speed on those). Many of the datasets you'll find on the RW API - and perhaps the datasets you are uploading too - contain georeferenced information. If that's the case, then you may want to render your data as a web map layer, and the RW API's *layer* endpoints can help you with that.

As we've seen in the [layer concept docs](#layer), a RW API layer may store data in different formats, depending on the needs of its author. This is done using the several open format fields a layer has. To keep this documentation easy to understand, we'll spit our approach to layers into two sections:

- We'll first discuss the details of the endpoints that allow you to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) layers, without focusing on the actual data contained in it.
- In an upcoming section, we'll dive deeper into some of the most common structures used to store data in the layer's open format fields, and help you use that data to render an actual layer on a web application.

## Getting all layers

To obtain all layers:

```shell
curl -X GET https://api.resourcewatch.org/v1/layer
```

> Example response:

```json
{
   "data":[
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
   "links":{
      "first":"https://api.resourcewatch.org/v1/layer?page%5Bnumber%5D=1",
      "prev":"https://api.resourcewatch.org/v1/layer?page%5Bnumber%5D=1",
      "next":"https://api.resourcewatch.org/v1/layer?page%5Bnumber%5D=2&page%5Bsize%5D=10",
      "last":"https://api.resourcewatch.org/v1/layer?page%5Bnumber%5D=64&page%5Bsize%5D=10",
      "self":"https://api.resourcewatch.org/v1/layer?page%5Bnumber%5D=1&page%5Bsize%5D=10"
   },
   "meta": {
      "total-pages": 63,
      "total-items": 628,
      "size": 10
   }
}
```

### Filter params

Available filters:

Field     |                                     Description                                      |    Type
--------- | :----------------------------------------------------------------------------------: | ------:
name      |                Filter the layers whose name contains the filter text                 |    Text
dataset   |                          Filter the layers by dataset uuid                           |    Text
sort      |                      Sort json response by specific attributes                       |    Text
status    |                Filter layers on status (pending, saved, failed, all)                 |    Text
published |                   Filter layers on published status (true, false)                    | Boolean
app       |                   Filter layers on application (prep, gfw, etc..)                    |    Text
env       | Environment in witch the layer was published, one of `staging`, `preproduction` or `production`. Defaults to `production` |    Text
user.role | The role of the user who created the layer. If the requesting user does not have the ADMIN role, this filter is ignored. | `ADMIN`, `MANAGER` or `USER`


> Return the layers filtered by those whose name contains emissions

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?name=emissions
```

> Return the layers filtered by dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?dataset=11de2bc1-368b-42ed-a207-aaff8ece752b
curl -X GET https://api.resourcewatch.org/v1/dataset/11de2bc1-368b-42ed-a207-aaff8ece752b/layer
```

> Sort by name

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?sort=name
```

> Filter layers by status

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?status=failed
```

> Filter layers by published status

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?published=false
```

> Filter layers by environment

If no `env` is specified, `production` is used as default.

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?env=staging
```

> Return the layers filtered by those whose applications contain rw

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?app=rw
```

### Pagination params

Field        |       Description        |   Type
------------ | :----------------------: | -----:
page[size]   | Number elements per page. There's a limit of 100 to the size of each page, which is not being enforced at the moment, but queries for larger page sizes are not supported. This means future requests may fail if not respecting the page size limit. | Number
page[number] |      Number of page      | Number

> Return the layers of page 2 with 5 elements per page

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?page[size]=5&page[number]=2
```

### Sorting

The API currently supports sorting by means of the `sort` parameter. Sorting can be done using any field from the layer, as well as `user.name` and `user.role` (sorting by user data is restricted to ADMIN users).

Sorting by nested fields is not supported at the moment.

> Sorting layers

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?sort=name
```

Multiple sorting criteria can be used, separating them by commas.

> Sorting layers by multiple criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?sort=name,slug
```

You can specify the sorting order by prepending the criteria with either `-` or `+`. By default, `asc` order is assumed.

> Explicit order of sorting

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?sort=-name,+slug
```

> Sorting layers by the role of the user who owns the layer

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?sort=user.role
```

### Include related entities

When loading layer data, you can optionally pass an `includes` query argument to load additional data.

#### Vocabulary

Loads related vocabularies. If none are found, no `vocabulary` property will be added to the layer object.

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?includes=vocabulary
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
          "vocabulary": []
        }
      }
   ]
}
```

#### User

Loads the name and email address of the author of the layer. If you request this issue as an authenticated user with ADMIN role, you will additionally get the author's role.

If the data is not available (for example, the user has since been deleted), no `user` property will be added to the layer object.

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?includes=user
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
curl -X GET https://api.resourcewatch.org/v1/layer?includes=user,vocabulary
```


## How obtain specific layers

To obtain the layer:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/11de2bc1-368b-42ed-a207-aaff8ece752b/layer/e5c3e7c5-19ae-4ca0-a461-71f1f67aa553
curl -X GET https://api.resourcewatch.org/v1/layer/e5c3e7c5-19ae-4ca0-a461-71f1f67aa553
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

### Include related entities

You can load related `user` and `vocabulary` data in the same request. See [this section](#include-related-layer-entities) for more details.


## Create a Layer

To create a layer, you need to define all of the required fields in the request body. The fields that compose a layer are:

Field             |                                                                         Description                                                                         |   Type |                                          Values | Required
----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------: | -----: | ----------------------------------------------: | -------:
name              |                                                                      Name of the layer                                                                      |   Text |                                        Any Text |      Yes
description       |                                                                 Description of the dataset                                                                  |   Text |                                        Any text |       No
application       |                                                           Application to which the layer belongs                                                            |  Array | gfw, forest-atlas, rw, prep, aqueduct, data4sdg |      Yes
layerConfig       | Custom configuration, [rw definition example](https://github.com/resource-watch/notebooks/blob/develop/ResourceWatch/Api_definition/layer_definition.ipynb) | Object |                                    Valid object |       No
legendConfig      |                                                                    Custom configuration                                                                     | Object |                                    Valid object |       No
applicationConfig |                                                                    Custom configuration                                                                     | Object |                                    Valid object |       No
staticImageConfig |                                                                    Custom configuration                                                                     | Object |                                    Valid object |       No
iso               |                                                               Isos to which the layer belongs                                                               |  Array |                                         BRA, ES |       No
dataset           |                                                                     UuId of the dataset                                                                     |   Text |                                 Uuid of Dataset |       No
protected         |                                            If it's a protected layer (not is possible to delete if it's true)                                               |   Boolean |                                 true-false |       No
env         |                                            Environment of the Layer. Set to 'production' by default                                               |   String |                                 Valid string |       No

It is possible to create a layer that has a different `env` property to its parent dataset.

> To create a layer, you have to do a POST request with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset_id>/layer \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "application":[
       "your", "apps"
    ],
    "name":"Example layer",
    "status": 1
}'
```

> The following structure was previously supported but should now be considered deprecated:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset_id>/layer \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "layer": {
      "application":[
         "your", "apps"
      ],
      "name":"Example layer",
      "status": 1
   }
}'
```

## Update a layer

To update a layer, you need to define all of the required fields in the request body. The fields that compose a layer are:

Field             |              Description               |   Type |                                          Values | Required
----------------- | :------------------------------------: | -----: | ----------------------------------------------: | -------:
name              |           Name of the layer            |   Text |                                        Any Text |      Yes
description       |       Description of the dataset       |   Text |                                        Any text |       No
application       | Application to which the layer belongs |  Array | gfw, forest-atlas, rw, prep, aqueduct, data4sdg |      Yes
layerConfig       |          Custom configuration          | Object |                                    Valid object |       No
legendConfig      |          Custom configuration          | Object |                                    Valid object |       No
applicationConfig |          Custom configuration          | Object |                                    Valid object |       No
staticImageConfig |          Custom configuration          | Object |                                    Valid object |       No
iso               |  The isos to which the layer belongs   |  Array |                                         BRA, ES |       No
dataset           |          UuId of the dataset           |   Text |                                 Uuid of Dataset |       No
env               | The environment to which the layer belongs |   Text |                                    Any Text |       No

> To create a layer, you have to do a POST request with the following body:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset_id>/layer/<layer_id> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "layer": {
      "application":[
         "your", "apps"
      ],
      "name":"New Example layer Name",
      "layerConfig": {}
   }
}'
```

## Delete a Layer

In order to perform this operation, the following conditions must be met:

- the layer's `protected` property must be set to `false`.
- the user must be logged in and belong to the same application as the layer
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the layer's owner (through the `userId` field of the layer)


```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset_id>/layer/<layer_id> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

## Layer reference

This section gives you a complete view at the properties that are maintained as part of layer. When interacting with a layer (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/resource-watch/layer/blob/master/app/src/models/layer.model.js).

Filter                  | Type           | Required             | Default value              | Description                                                                  
----------------------- | -------------- | -------------------- |----------------------------| ---------------------------------------------------------------------------- 
id                      | String         | Yes (autogenerated)  |                            | Unique Id of the layer. Auto generated on creation. Cannot be modified by users.    
name                    | String         | Yes                  |                            | Name of the layer.              
dataset                 | String         | Yes                  |                            | Id of the dataset to which the layer corresponds. Set on layer creation, cannot be modified.   
slug                    | String         | Yes (autogenerated)  |                            | Slug of the layer. Auto generated on creation. Cannot be modified by users.  
description             | String         | No                   |                            | User defined description of the layer.   
application             | Array          | Yes                  |                            | Applications associated with this layer.                                   
iso                     | Array          | Yes                  |                            | List of ISO3 codes of the countries that relate to the layer. If empty (or contains a single element: 'global') then the layer is a global layer.
provider                | String         | No                   |                            | Layer provider. It typically identifies the source service for the data displayed in the layer.
type                    | String         | No                   |                            | Layer type.
userId                  | String         | Yes (autopopulated)  |                            | Id of the user who created the layer. Set automatically on creation. Cannot be modified by users.
default                 | Boolean        | No                   | false                      | If the layer should be used as the dataset's default layer.
protected               | Boolean        | Yes                  | false                      | If the layer is protected. A protected layer cannot be deleted.               
published               | Boolean        | Yes                  | true                       | If the layer is published or not.                                               
env                     | String         | Yes                  | production                 | Environment to which the layer belongs.
applicationConfig       | Object         | No                   |                            | Open schema object meant to host application-specific data or behavior configuration.
layerConfig             | Object         | No                   |                            | Open schema object meant to define layer specific data, like source of data, styling and animation settings.
legendConfig            | Object         | No                   |                            | Open schema object meant to define how a layer legend should be represented visually.
staticImageConfig       | Object         | No                   |                            | 
interactionConfig       | Object         | No                   |                            | Open schema object meant to define interactive layer element behavior, ie.: how tooltips behave on click.
userName                | String         | No (autogenerated)   | null                       | Name of the user who created the layer. This value is used only internally, and is never directly exposed through the API. Cannot be modified by users.        
userRole                | String         | No (autogenerated)   | null                       | Role of the user who created the layer. This value is used only internally, and is never directly exposed through the API. Cannot be modified by users. 
createdAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the layer was created. Cannot be modified by users.                     
updatedAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the layer was last updated. Cannot be modified by users.                
