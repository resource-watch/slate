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
                "private": true
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
published |   Filter topics by publishing status (true, false)       | Boolean
private   |   Filter topics by private status (true, false)          | Boolean
user      |           Filter topics by author user id                | Text


```shell
curl -X GET https://api.resourcewatch.org/v1/topic?user=57bc2608f098ce98007985e4&private=false
```

<aside class="warning">
    <span>Deprecation notice</span>
    <p>
      The format <b><i>filter[filterName]=value</i></b> which was previously supported for some filters, is now deprecated, in favor of <b><i>filterName=value</i></b>.
    </p>
</aside>


```shell
# Deprecated syntax
curl -X GET https://api.resourcewatch.org/v1/topic?filter[user]=57bc2608f098ce98007985e4&filter[private]=false
```


### Sorting

There's currently no support for custom sorting of topics. The topics are listed on a pseudo-random order.

### Include related entities

When loading topics, you can optionally pass an `includes` query argument to load additional data.

#### User

Loads the name and email address of the author of the topic. If you request this issue as an authenticated user with ADMIN role, you will additionally get the author's role.

If the data is not available (for example, the user has since been deleted), no `user` property will be added to the layer object.

```shell
curl -X GET https://api.resourcewatch.org/v1/topic?includes=user
```

> Example response:

```json
{
    "data": [
      {
        "id": "86",
        "type": "topics",
        "attributes": {
          "name": "Test topic three",
          "slug": "test-topic-three-cd4305e9-e3c8-456b-85a0-32eccb6100e6",
          "summary": "test topic three summary",
          "description": "test topic three description",
          "content": "test topic three description",
          "published": true,
          "user-id": "57ac9f9e29309063404573a2",
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
            "private": true
        }
    }
}
```

## Clone topic

Creates a new topic with the information of the provided topic

```shell
curl -X POST https://api.resourcewatch.org/v1/topics/10/clone-topic -H 'Authorization: Bearer exampleToken' 
```

```json
{
    "data": {
        "id": "333",
        "type": "topics",
        "attributes": {
            "name": "Cities",
            "slug": "cities",
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
            "private": true
        }
    }
}
```
