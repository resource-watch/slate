# Topic

## What is a Topic?

A topic contains the information to display a web page belonging to a user. 

## Getting all topics

This endpoint will allow to get all topics belonging to a user:


```shell
curl -X GET https://api.resourcewatch.org/v1/topic -H 'Authorization: Bearer exampleToken' 
```

> Response:

```json
{
    "data": [
        {
            "id": "10",
            "type": "topics",
            "attributes": {
                "name": "Cities topic",
                "slug": "cities-topic",
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

## Clone topic

Clones an existing topic using its ID.
If the original topic contains functioning widgets, they will be duplicated and the new ids will be used by the new topic.

```shell
curl -X POST https://api.resourcewatch.org/v1/topics/10/clone -H 'Authorization: Bearer exampleToken' 
```

```json
{
    "data": {
        "id": "224",
        "type": "topics",
        "attributes": {
            "name": "Cities",
            "slug": "cities-a9cb2c87-f6b6-48cf-9b52-9e0de4fd8d6f",
            "summary": "Traditional models of city development can lock us into congestion, sprawl, and inefficient resource use. However, compact, ...",
            "description": "",
            "content": "[{\"id\":1511952250652,\"type\":\"widget\",\"content\":{\"widgetId\":\"b9186ce9-78ae-418b-a6d3-d521283ce485\",\"categories\":[]}},...}]",
            "published": false,
            "photo": {
                "cover": "/system/topics/photos/data?1523301918",
                "thumb": "/system/topics/photos/data?1523301918",
                "original": "/system/topics/photos/data?1523301918"
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

## Clone dashboard

Creates a new dashboard with the information of the provided topic

```shell
curl -X POST https://api.resourcewatch.org/v1/topics/10/clone-dashboard -H 'Authorization: Bearer exampleToken' 
```

```json
{
    "data": {
        "id": "333",
        "type": "dashboards",
        "attributes": {
            "name": "Cities",
            "slug": "cities",
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
