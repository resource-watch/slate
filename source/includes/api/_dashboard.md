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

#### Basics of sorting

The API currently supports sorting by means of the `sort` parameter.

> Sorting dashboards

```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard?sort=name
```

Multiple sorting criteria can be used, separating them by commas.

> Sorting dashboards by multiple criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard?sort=name,slug
```

You can specify the sorting order by prepending the criteria with either `-` or `+`. By default, `asc` order is assumed.

> Explicit order of sorting

```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard?sort=-name,+slug
```

#### Special sorting criteria

There are some criteria for special sorting in dashboards:

- `user.name`: sorts the dashboards according to the name of the user who owns the dashboard. Supports ascending/descending order.
- `user.role`: sorts the dashboards according to the role of the user who owns the dashboard. Supports ascending/descending order.

> Sorting dashboards with special criteria

```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard?sort=user.role,name
```

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

```json
{
  "data": {
    "id": "24",
    "type": "dashboards",
    "attributes": {
      "name": "Cities",
      "slug": "cities",
      "summary": "Traditional models of city development can lock us into congestion, sprawl, and inefficient resource use. However, compact, connected, and efficient growth can help ensure more competitive cities, and provide a better quality of life for citizens.  The decisions that national leaders, local officials, developers, and planners make today will determine how billions of urban cities will live over the next century. Already, half the global population resides in cities. That figure is set to increase to 70 percent by 2050.",
      "description": "",
      "content": "[]",
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

The data provided in the body of the request will override the data of the original dashboard. In the example on the side, the `name` and the `user-id` of the dashboard will be overridden.

```shell
curl -X POST https://api.resourcewatch.org/v1/dashboard/<id>/clone \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "data": {
        "attributes": {
            "name": "Copy of Cities dashboard",
            "user-id": "1111167922e16e34ef3ce872"
        }
    }
  }'
```

```json
{
    "data": {
        "id": "224",
        "type": "dashboards",
        "attributes": {
            "name": "Copy of Cities dashboard",
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
            "user-id": "1111167922e16e34ef3ce872",
            "private": true,
            "production": true,
            "preproduction": false,
            "staging": false,
            "application":  ["rw"]
        }
    }
}
```
