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
                "staging": false
            }
        },
        ...
      ]
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


```shell
curl -X GET https://api.resourcewatch.org/v1/dashboard?user=57bc2608f098ce98007985e4&private=false
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
          "user": {
            "id": "57ac9f9e29309063404573a2",
            "name": null,
            "role": "ADMIN",
            "email": "john.doe@vizzuality.com",
            "apps": [
              "rw",
              "gfw"
            ]
          }
        }
      }
   ]
}
```
 


## Creating a dashboard

```shell
curl -X POST https://api.resourcewatch.org/v1/dashboards \
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
              "staging": false
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
            "user": null
        }
    }
}
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
            "staging": false
        }
    }
}
```
