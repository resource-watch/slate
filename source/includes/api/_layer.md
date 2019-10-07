# Layer

## What is a Layer?

A layer is a geographical representation of a Dataset's data.

Layer contains the following fields:

Field             |                                     Description                                      |    Type
----------------- | :----------------------------------------------------------------------------------: | ------:
userId            |                                   Id of the owner                                    |    Text
application       |                       Application to which the dataset belongs                       |   Array
iso               |                        The isos to which the dataset belongs                         |   Array
slug              |                            Unique identifier of the layer                            |    Text
name              |                                  Name of the layer                                   |     Url
description       |                               Description of the layer                               |   Array
dataset           |                      UuId of the dataset that the layer belongs                      |    Text
layerConfig       |                                 Custom configuration                                 |  Object
legendConfig      |                                 Custom configuration                                 |  Object
applicationConfig |                                 Custom configuration                                 |  Object
staticImageConfig |                                 Custom configuration                                 |  Object
default           |               If it's a default layer for the dataset that it belongs                | Boolean
protected         |               If it's a protected layer (not is possible to delete if it's true)     | Boolean
published         |                               Is the layer published?                                | Boolean
env               | environment in witch the layer was published, one of `staging`, `preproduction` or `production` |    Text

## How obtain all layers

To obtain all layers:

```shell
curl -X GET https://api.resourcewatch.org/v1/layer
```

<aside class="success">
Remember — the response is jsonapi format
</aside>

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
page[size]   | Number elements per page | Number
page[number] |      Number of page      | Number

> Return the layers of page 2 with 5 elements per page

```shell
curl -X GET https://api.resourcewatch.org/v1/layer?page[size]=5&page[number]=2
```

### Include related layer entities

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

<aside class="success">
Remember — the response is jsonapi format
</aside>

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
