# Dashboard

## What is a Dashboard?

A dashboard contains the information to display a web page belonging to a user.

## Getting all dashboards

This endpoint will allow to get all dashboards belonging to a user:


```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard -H 'Authorization: Bearer exampleToken' 
```

> Response:

```json
{
    "data": [
        {
            "id": "10",
            "type": "dashboards",
            "attributes": {
                "name": "Cities Dashboard",
                "slug": "cities-dashboard",
                "summary": "",
                "description": "",
                "content": "<p></p>\n<iframe width=\"500\" height=\"410\" src=\"/embed/widget/5ebeddda-8f3d-4e63-8a52-08e15c3e148c\" frameBorder=\"0\"></iframe>\n<p></p>\n<iframe width=\"500\" height=\"410\" src=\"/embed/widget/73c574b9-f9ab-4f77-87be-651ff8dac5fe\" frameBorder=\"0\"></iframe>\n<p>test1</p>\n",
                "published": true,
                "photo": {
                    "cover": "https://s3.amazonaws.com/image.jpg",
                    "thumb": "https://s3.amazonaws.com/image.jpg",
                    "original": "https://s3.amazonaws.com/image.jpg"
                },
                "user-id": "eb63867922e16e34ef3ce862",
                "private": true,
                "production": true,
                "preproduction": false,
                "staging": false,
                "application":  ["rw"],
                "is-highlighted": false,
            }
        },
        ...
    ],
    "links": {
        "self": "http://staging-api.globalforestwatch.org/v1/dashboard?page%5Bnumber%5D=1&page%5Bsize%5D=10",
        "first": "http://staging-api.globalforestwatch.org/v1/dashboard?page%5Bnumber%5D=1&page%5Bsize%5D=10",
        "prev": null,
        "next": "http://staging-api.globalforestwatch.org/v1/dashboard?page%5Bnumber%5D=2&page%5Bsize%5D=10",
        "last": "http://staging-api.globalforestwatch.org/v1/dashboard?page%5Bnumber%5D=14&page%5Bsize%5D=10"
    },
    "meta": {
        "total-pages": 14,
        "total-items": 140,
        "size": 10
    }
}
```


### Filters

Available filters parameters:

Field     |                         Description                          |    Type
--------- | :----------------------------------------------------------: | ------:
name      |   Filter dashboards by name (partial matches supported       | Text
published |   Filter dashboards by publishing status (true, false)       | Boolean
private   |   Filter dashboards by private status (true, false)          | Boolean
user      |           Filter dashboards by author user id                | Text
user.role | The role of the user who created the dashboard. If the requesting user does not have the ADMIN role, this filter is ignored. | `ADMIN`, `MANAGER` or `USER`
application | The application to which the dashboard belongs             | Text (single value)
is-highlighted | Filter dashboards by highlighted ones (true,false)       | Boolean


```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard?user=57bc2608f098ce98007985e4&private=false
```

<aside class="warning">
    <span>Deprecation notice</span>
    <p>
      The format <b><i>filter[filterName]=value</i></b> which was previously supported for some filters, is now deprecated, in favor of <b><i>filterName=value</i></b>.
    </p>
</aside>


```shell
# Deprecated syntax
curl -X GET https://api.resourcewatch.org/v1/dashboard?filter[user]=57bc2608f098ce98007985e4&filter[private]=false
```


### Pagination

Field        |         Description          |   Type|   Default value
------------ | :--------------------------: | -----:| -----:
page[size]   | The number elements per page. The maximum allowed value is 100 | Number|   10
page[number] |       The page number        | Number|   1


```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard?page[size]=15&page[number]=2
```

### Sorting

There's currently no support for custom sorting of dashboards. The dashboards are listed on a pseudo-random order.

### Include related entities

When loading dashboards, you can optionally pass an `includes` query argument to load additional data.

#### User

Loads the name and email address of the author of the dashboard. If you request this issue as an authenticated user with ADMIN role, you will additionally get the author's role.

If the data is not available (for example, the user has since been deleted), no `user` property will be added to the layer object.

```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard?includes=user
```

> Example response:

```json
{
    "data": [
      {
        "id": "86",
        "type": "dashboards",
        "attributes": {
          "name": "Test dashboard three",
          "slug": "test-dashboard-three-cd4305e9-e3c8-456b-85a0-32eccb6100e6",
          "summary": "test dashboard three summary",
          "description": "test dashboard three description",
          "content": "test dashboard three description",
          "published": true,
          "photo": "user",
          "user-id": "57ac9f9e29309063404573a2",
          "private": true,
          "production": true,
          "preproduction": false,
          "staging": false,
          "application":  ["rw"],
          "user": {
            "name": "John Doe",
            "role": "ADMIN",
            "email": "john.doe@vizzuality.com"
          }
        }
      }
   ]
}
```

## Getting a dashboard by its ID

> How to get a dashboard by its ID:

```shell
curl -X GET http://api.resourcewatch.org/dashboard/24
```

> Response:

```shell
{
"data": {
"id": "24",
"type": "dashboards",
"attributes": {
"name": "Cities",
"slug": "cities",
"summary": "Traditional models of city development can lock us into congestion, sprawl, and inefficient resource use. However, compact, connected, and efficient growth can help ensure more competitive cities, and provide a better quality of life for citizens.  The decisions that national leaders, local officials, developers, and planners make today will determine how billions of urban cities will live over the next century. Already, half the global population resides in cities. That figure is set to increase to 70 percent by 2050.",
"description": "",
"content": "[{\"id\":1511952250652,\"type\":\"widget\",\"content\":{\"widgetId\":\"b9186ce9-78ae-418b-a6d3-d521283ce485\",\"categories\":[]}},{\"id\":1512381447629,\"type\":\"text\",\"content\":\"\\u003cp\\u003e\\u003cspan style=\\\"color: rgb(0, 0, 0); background-color: transparent;\\\"\\u003eUrbanized areas in 2014 occupied \\u003c/span\\u003e\\u003cstrong style=\\\"color: rgb(0, 0, 0); background-color: transparent;\\\"\\u003e2.84 millions sq km\\u003c/strong\\u003e\\u003cspan style=\\\"color: rgb(0, 0, 0); background-color: transparent;\\\"\\u003e, up from\\u003c/span\\u003e\\u003cstrong style=\\\"color: rgb(0, 0, 0); background-color: transparent;\\\"\\u003e 2.26 millions sq km\\u003c/strong\\u003e\\u003cspan style=\\\"color: rgb(0, 0, 0); background-color: transparent;\\\"\\u003e in 2000, an increase of\\u003c/span\\u003e\\u003cstrong style=\\\"color: rgb(0, 0, 0); background-color: transparent;\\\"\\u003e 25.6 %\\u003c/strong\\u003e\\u003c/p\\u003e\"},{\"id\":1511952286724,\"type\":\"grid\",\"content\":[{\"id\":1511952306751,\"type\":\"widget\",\"content\":{\"widgetId\":\"2c613f97-973b-4b33-8906-a904396ab7d5\",\"categories\":[]}},{\"id\":1511952319137,\"type\":\"widget\",\"content\":{\"widgetId\":\"5ab7cfe5-73b1-433d-82dc-351f9f08d51c\",\"categories\":[]}}]},{\"id\":1511952325253,\"type\":\"grid\",\"content\":[{\"id\":1511952328051,\"type\":\"text\",\"content\":\"\\u003cp\\u003e\\u003cspan style=\\\"background-color: transparent; color: rgb(0, 0, 0);\\\"\\u003eThere are over 5,600 kilometers of Bus Rapid Transit (BRT) systems globally. These 10 countries have the most BRT infrastructure by population.\\u003c/span\\u003e\\u003c/p\\u003e\\u003cp\\u003e\\u003cbr\\u003e\\u003c/p\\u003e\\u003cp\\u003e\\u003cspan style=\\\"background-color: transparent; color: rgb(0, 0, 0);\\\"\\u003e\\u003cspan class=\\\"ql-cursor\\\"\\u003e﻿\\u003c/span\\u003eThis widget shows the Bus Rapid Transit System Length by country normalized by population.\\u003c/span\\u003e\\u003c/p\\u003e\"},{\"id\":1511952330008,\"type\":\"text\",\"content\":\"\\u003cp\\u003e\\u003cspan style=\\\"background-color: transparent; color: rgb(0, 0, 0);\\\"\\u003eOver 34 million people use Bus Rapid Transit (BRT) systems each day. These 10 countries have the highest rates of passengers by population. \\u003c/span\\u003e\\u003c/p\\u003e\\u003cp\\u003e\\u003cbr\\u003e\\u003c/p\\u003e\\u003cp\\u003e\\u003cspan style=\\\"background-color: transparent; color: rgb(0, 0, 0);\\\"\\u003eThis widget shows the Bus Rapid Transit System ridership by country normalized for population.\\u0026nbsp;\\u003c/span\\u003e\\u003c/p\\u003e\"}]},{\"id\":1511952437683,\"type\":\"widget\",\"content\":{\"widgetId\":\"f6d1919a-f4fc-4f08-a7a5-7fe3cb497354\",\"categories\":[]}},{\"id\":1511952456564,\"type\":\"text\",\"content\":\"\\u003cp\\u003e\\u003cspan style=\\\"color: rgb(0, 0, 0);\\\"\\u003eThe proportion of the urban population living in slum households. A slum household is defined as a group of individuals living under the same roof lacking one or more of the following conditions: access to improved water, access to improved sanitation, sufficient living area, and durability of housing.﻿\\u003c/span\\u003e\\u003c/p\\u003e\"},{\"id\":1511952492108,\"type\":\"widget\",\"content\":{\"widgetId\":\"52a03b39-c826-48c0-b57e-e2d1d033221c\",\"categories\":[]}},{\"id\":1511952496186,\"type\":\"text\",\"content\":\"\\u003cp\\u003e\\u003cspan style=\\\"color: rgb(0, 0, 0);\\\"\\u003eThe percentage of the Urban Population with Access to an improved water source in 2015.\\u003c/span\\u003e\\u003c/p\\u003e\"},{\"id\":1512381390724,\"type\":\"widget\",\"content\":{\"widgetId\":\"bb11f652-2467-4ac1-b310-b7c4fd791b86\",\"categories\":[]}},{\"id\":1512381398799,\"type\":\"text\",\"content\":\"\\u003cp\\u003e\\u003cstrong style=\\\"color: rgb(0, 0, 0);\\\"\\u003e18%\\u003c/strong\\u003e\\u003cspan style=\\\"color: rgb(0, 0, 0);\\\"\\u003e of the world’s urban population does not have access to improved sanitation facilities.\\u003c/span\\u003e\\u003c/p\\u003e\"},{\"id\":1511952583440,\"type\":\"widget\",\"content\":{\"widgetId\":\"c4bb527c-fcea-405b-a763-d39c5741a87d\",\"categories\":[]}},{\"id\":1511952631446,\"type\":\"widget\",\"content\":{\"widgetId\":\"c4bac72c-04b4-44d8-b220-40b0779e8ffb\",\"categories\":[]}},{\"id\":1511952634228,\"type\":\"text\",\"content\":\"\\u003cp\\u003e\\u003cspan style=\\\"color: rgb(0, 0, 0);\\\"\\u003eEstimated road traffic fatal injury deaths per 100,000 population.\\u003c/span\\u003e\\u003c/p\\u003e\"}]",
"published": false,
"photo": {
"cover": "https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/dashboards/photos/000/000/024/cover/data?1523301918",
"thumb": "https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/dashboards/photos/000/000/024/thumb/data?1523301918",
"original": "https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/dashboards/photos/000/000/024/original/data?1523301918"
},
"user-id": "58f63c81bd32c60206ed6b12",
"private": true,
"production": true,
"preproduction": false,
"staging": false,
"user": null
}
}
}
```


## Creating a dashboard

When creating a dashboard, the `application` field should be present and cannot contain any values that are not associated with the creating user's account. If an `application` value is not provided, `["rw"]` is used by default, and the process will fail if the user account does not belong to it. Any role can create a dashboard.

Supported fields:

Name            | Description                                                                  | Accepted values
-------------   | ---------------------------------------------------------------------------- | ----------------------------
name            | Short name for the dashboard                                                 | any valid text
summary         | Summary of the content of the dashboard                                      | any valid text
description     | Description of the dashboard                                                 | any valid text
content         | Content of the dashboard, typically encoded as a JSON string                 | any valid text
published       | If the dashboard is in a publishable state                                   | boolean
photo           | Object containing a set of image urls associated with the dashboard          | object
user_id         | Id of the user who created the dashboard                                     | string with valid user id (not validated)
private         |                                                                              | boolean
production      |                                                                              | boolean
preproduction   |                                                                              | boolean
staging         |                                                                              | boolean
application     | Application(s) to which the dashboard belongs. Defaults to `["rw"]`.         | array of strings
is-highlighted  | If this dashboard is highlighted (`true`/`false`). Defaults to `false`. Only accessible to users with `ADMIN` role. | boolean

```shell
curl -X POST https://api.resourcewatch.org/v1/dashboard \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
      "data": {
          "type": "dashboards",
          "attributes": {
              "name": "Cities",
              "summary": "Traditional models of city development can lock us into congestion, sprawl, and inefficient resource use. However, compact, ...",
              "description": "",
              "content": "[{...}]",
              "published": false,
              "photo": {
                  "cover": "...",
                  "thumb": "...",
                  "original": "..."
              },
              "user-id": "eb63867922e16e34ef3ce862",
              "private": true,
              "production": true,
              "preproduction": false,
              "staging": false,
              "application":  ["rw"]
          }
      }
  }' 
```


```json
{
    "data": {
        "id": "243",
        "type": "dashboards",
        "attributes": {
            "name": "Cities",
            "slug": "cities-94bbc472-8970-4d9e-a3f2-d5422b1011e0",
            "summary": "Traditional models of city development can lock us into congestion, sprawl, and inefficient resource use. However, compact, ...",
            "description": "",
            "content": "[{...}]",
            "published": false,
            "photo": {
                "cover": "...",
                "thumb": "...",
                "original": "..."
            },
            "user-id": "eb63867922e16e34ef3ce862",
            "private": true,
            "production": true,
            "preproduction": false,
            "staging": false,
            "user": null,
            "application":  ["rw"],
            "is-highlighted": false,
        }
    }
}
```
 
 
## Editing a dashboard

In order to perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the dashboard
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dashboard's owner (through the `user-id` field of the dashboard)
  
When updating the `application` field of a dashboard, a user cannot add values not associated with their user account.

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dashboard/<id of the dashboard> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
      "data": {
          "attributes": {
              "description": "Dashboard that uses cities"
          }
      }
  }' 
```


```json
{
    "data": {
        "id": "243",
        "type": "dashboards",
        "attributes": {
            "name": "Cities",
            "slug": "cities-94bbc472-8970-4d9e-a3f2-d5422b1011e0",
            "summary": "Traditional models of city development can lock us into congestion, sprawl, and inefficient resource use. However, compact, ...",
            "description": "Dashboard that uses cities",
            "content": "[{...}]",
            "published": false,
            "photo": {
                "cover": "...",
                "thumb": "...",
                "original": "..."
            },
            "user-id": "eb63867922e16e34ef3ce862",
            "private": true,
            "production": true,
            "preproduction": false,
            "staging": false,
            "user": null,
            "application":  ["rw"]
        }
    }
}
```
 
## Delete dashboard

In order to perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the dashboard
- the user must match one of the following:
  - have role `ADMIN`
  - have role `MANAGER` and be the dashboard's owner (through the `user-id` field of the dashboard)


```shell
curl -X DELETE https://api.resourcewatch.org/v1/dashboard/<id of the dashboard> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

## Clone dashboard

Clones an existing dashboard using its ID.
If the original dashboard contains functioning widgets, they will be duplicated and the new ids will be used by the new dashboard.

```shell
curl -X POST https://api.resourcewatch.org/v1/dashboards/10/clone -H 'Authorization: Bearer exampleToken' 
```

```json
{
    "data": {
        "id": "224",
        "type": "dashboards",
        "attributes": {
            "name": "Cities",
            "slug": "cities-a9cb2c87-f6b6-48cf-9b52-9e0de4fd8d6f",
            "summary": "Traditional models of city development can lock us into congestion, sprawl, and inefficient resource use. However, compact, ...",
            "description": "",
            "content": "[{\"id\":1511952250652,\"type\":\"widget\",\"content\":{\"widgetId\":\"b9186ce9-78ae-418b-a6d3-d521283ce485\",\"categories\":[]}},...}]",
            "published": false,
            "photo": {
                "cover": "/system/dashboards/photos/data?1523301918",
                "thumb": "/system/dashboards/photos/data?1523301918",
                "original": "/system/dashboards/photos/data?1523301918"
            },
            "user-id": "eb63867922e16e34ef3ce862",
            "private": true,
            "production": true,
            "preproduction": false,
            "staging": false,
            "application":  ["rw"]
        }
    }
}
```
