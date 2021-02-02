# Topic

<aside class="warning">
    <span>Deprecation notice</span>
    <p>
      Topics are deprecated. Use Dashboards instead.
    </p>
</aside>

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
                "application":  ["rw"]
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
application | The application to which the topic belongs. Read more about this field [here](/concepts.html#applications). | Text (single value)

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

## Creating a topic

<aside class="warning">
    <span>Deprecation notice</span>
    <p>
      Topics are deprecated. Use Dashboards instead.
    </p>
</aside>

When creating a topic, the `application` field should be present and cannot contain any values that are not associated with the creating user's account. If an `application` value is not provided, `["rw"]` is used by default, and the process will fail if the user account does not belong to it. Any role can create a topic.

Supported fields:

Name          | Description                                                                  | Accepted values
------------- | ---------------------------------------------------------------------------- | ----------------------------
name          | Short name for the topic                                                 | any valid text
slug          | Unique identifier for the topic                                                 | any valid text
summary       | Summary of the content of the topic                                      | any valid text
description   | Description of the topic                                                 | any valid text
content       | Content of the topic, typically encoded as a JSON string                 | any valid text
published     | If the topic is in a publishable state                                   | boolean
photo         | Object containing a set of image urls associated with the topic          | object
user_id       | Id of the user who created the topic                                     | string with valid user id (not validated)
private       |                                                                              | boolean
application   | Application(s) to which the topic belongs. Defaults to `["rw"]`. Read more about this field [here](/concepts.html#applications). | array of strings

```shell
curl -X POST https://api.resourcewatch.org/v1/topics \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
      "data": {
          "type": "topics",
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
              "application":  ["rw"]
          }
      }
  }'
```

```json
{
    "data": {
        "id": "243",
        "type": "topics",
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
            "user": null,
            "application":  ["rw"]
        }
    }
}
```

## Editing a topic

<aside class="warning">
    <span>Deprecation notice</span>
    <p>
      Topics are deprecated. Use Dashboards instead.
    </p>
</aside>

In order to perform this operation, the following conditions must be met:

- the user must be logged in and belong to the same application as the topic
- the user must comply with [the RW API role-based access control guidelines](/concepts.html#role-based-access-control).
  
When updating the `application` field of a topic, a user cannot add values not associated with their user account.

```shell
curl -X PATCH https://api.resourcewatch.org/v1/topics/<id of the topic> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
      "data": {
          "attributes": {
              "description": "Topic related with cities."
          }
      }
  }'
```

```json
{
    "data": {
        "id": "243",
        "type": "topics",
        "attributes": {
            "name": "Cities",
            "slug": "cities-94bbc472-8970-4d9e-a3f2-d5422b1011e0",
            "summary": "Traditional models of city development can lock us into congestion, sprawl, and inefficient resource use. However, compact, ...",
            "description": "Topic related with cities.",
            "content": "[{...}]",
            "published": false,
            "photo": {
                "cover": "...",
                "thumb": "...",
                "original": "..."
            },
            "user-id": "eb63867922e16e34ef3ce862",
            "private": true,
            "user": null,
            "application":  ["rw"]
        }
    }
}
```

## Clone a topic

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
            "application":  ["rw"]
        }
    }
}
```
