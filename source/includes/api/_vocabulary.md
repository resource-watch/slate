# Vocabularies and tags

## What are vocabularies and tags?

[Vocabularies and tags concepts](#vocabularies-and-tags) are covered in their dedicated section, and we strongly recommend you read that section before diving into the details of the respective endpoints. In it, we explain in detail what is a tag and a vocabulary, and why you should use them to empower different use cases of the RW API.

Simply put, a tag is a keyword that can be associated to one or more `resources`. A vocabulary is a groups of tags, which also defines their scope or context. Every tag belongs to a vocabulary, and a vocabulary does not exist without tags, so more often than not you'll need to specify both when using the different endpoints covered here. 

It's important to keep in mind that these associations between a resource and a vocabulary/tag have an [applications](#applications) associated with them. Putting this in an example, `dataset` A may be associated with vocabulary/tag X for application `rw`, but not for application `gfw`. Most endpoints will allow you explicitly define which application you are referring to (some will even require it), and a `rw` default value will be assumed when no explicit value is provided.

## What are resources?

Throughout this section, we'll refer multiple times to `resources`. Simply put, a `resource` is either a dataset, a widget, or a layer. Tags and vocabularies work in a similar fashion for each of these 3 types of RW API entity, so often we'll refer to resources instead, for convenience.

We assume that, at this point, you are already familiar with the concepts of [dataset](#dataset), [layer](#layer) or [widget](#widget) (ideally you are familiar with the 3). If that's not the case, we strongly encourage you learn about those concepts first, and we also recommend you take some time to explore and experiment using actual [dataset](#dataset6), [layer](#layer8) or [widget](#widget9) endpoints before proceeding. Vocabularies and tags exist to improve and empower your use cases of those resources, so it should only be used by applications and users that are already comfortable with the basics, and want to take their knowledge of the RW API to the next level.

The behavior of vocabulary and tags endpoints aims to be, as much as possible, independent from the target resource it references. In the detailed endpoint documentation below we'll cover the different endpoints in depth, and highlight the differences in behavior when handling different resource types, but you can safely assume that, for most of it, behavior described for a type of resource will be the same for all 3 types.

## Endpoint overview

In broad terms, there are two types of endpoints for manipulating vocabulary/tags: endpoints that allow to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) vocabulary/tags for a given resource, and endpoints that allow you to query for resources for a given vocabulary/tag.

We'll start by covering how you can manipulate associations between vocabulary/tags and resources, and further down will cover how to list vocabulary/tags, and their associated resources.

## Getting vocabulary/tags for a resource

There are two types endpoints that will allow you to get vocabularies and tags for a resource: one to retrieve all vocabularies and their tags, and another to retrieve all tags for a given vocabulary.

### Getting all vocabularies and tags for a resource

> Getting vocabularies and tags associated with a dataset

```shell
curl -L -X GET 'https://api.resourcewatch.org/dataset/<dataset-id>/vocabulary' \
-H 'Content-Type: application/json'
```

> Getting vocabularies and tags associated with a layer

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer_id>/vocabulary' \
-H 'Content-Type: application/json'
```

> Getting vocabularies and tags associated with a widget

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget_id>/vocabulary' \
-H 'Content-Type: application/json'
```

> Example response

```json
{
    "data": [
        {
            "id": "testVocabulary1",
            "type": "vocabulary",
            "attributes": {
                "tags": [
                    "tag1",
                    "tag2"
                ],
                "name": "testVocabulary1",
                "application": "rw"
            }
        },
        {
            "id": "testVocabulary2",
            "type": "vocabulary",
            "attributes": {
                "tags": [
                    "tag3",
                    "tag2"
                ],
                "name": "testVocabulary2",
                "application": "rw"
            }
        }
    ]
}
```

These endpoints allow you to get vocabulary/tags for a single dataset, widget or layer. By default, vocabulary/tags for the `rw` application are returned, but you can use the optional `app` or `application` query parameters to load data for a different application.

One important detail to keep in mind when getting vocabulary/tags for widgets or layers is that the dataset id used in these queries will need to match the dataset id provided when creating the association between a widget or layer, and the vocabulary/tags. If you provide an incorrect dataset id, you will not get the correct data.

### Getting a single vocabulary and its tags for a resource


> Getting a single vocabulary and tags associated with a dataset

```shell
curl -L -X GET 'https://api.resourcewatch.org/dataset/<dataset-id>/vocabulary/<vocabulary-id>' \
-H 'Content-Type: application/json'
```

> Getting a single vocabulary and tags associated with a layer

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer_id>/vocabulary/<vocabulary-id>' \
-H 'Content-Type: application/json'
```

> Getting a single vocabulary and tags associated with a widget

```shell
curl -L -X GET 'https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget_id>/vocabulary/<vocabulary-id>' \
-H 'Content-Type: application/json'
```

> Example response

```json
{
    "data": [
        {
            "id": "test1",
            "type": "vocabulary",
            "attributes": {
                "tags": [
                    "tag1",
                    "tag2"
                ],
                "name": "test1",
                "application": "rw"
            }
        }
    ]
}
```

These endpoints allow you to get a single vocabulary and its tags for a single dataset, widget or layer. By default, vocabulary/tags for the `rw` application are returned, but you can use the optional `app` or `application` query parameters to load data for a different application.

One important detail to keep in mind when getting vocabulary/tags for widgets or layers is that the dataset id used in these queries will need to match the dataset id provided when creating the association between a widget or layer, and the vocabulary/tags. If you provide an incorrect dataset id, you will not get the correct data.

## Creating vocabulary/tags for a resource

There are two types of endpoints for associating vocabulary/tags with resources: one allows you to create a single vocabulary (and its tags) for a resource, while the other supports creating multiple vocabularies/tags for a single resource.

### Creating a single vocabulary/tags for a resource

> Creating a new vocabulary/tag for a dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "tags": [<tags>]
  }'
```

> Creating a new vocabulary/tag for a widget

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "tags": [<tags>]
  }'
```

> Creating a new vocabulary/tag for a layer

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "tags": [<tags>]
  }'
```

> Example response

```json
{
    "data": [
        {
            "id": "testVocabulary1",
            "type": "vocabulary",
            "attributes": {
                "tags": [
                    "tag1",
                    "tag2"
                ],
                "name": "testVocabulary1",
                "application": "rw"
            }
        },
        {
            "id": "testVocabulary2",
            "type": "vocabulary",
            "attributes": {
                "tags": [
                    "tag3",
                    "tag2"
                ],
                "name": "testVocabulary2",
                "application": "rw"
            }
        }
    ]
}
```


This set of endpoints will allow you to create a new vocabulary/tags for a resource. The primary use case for these endpoint is when you just created a new dataset/layer/widget, and want to add vocabulary/tags to them.

The request body must contain both an array of tags, and the `application` under which the vocabulary/tags are being created. If a vocabulary with the same name already exists for the specified application, you will get an error message - you can use the update endpoints to modify an existing vocabulary.

Assuming the creation was successful, the response will contain a list of all vocabularies and their respective tags associated with the specified resource, for all applications.

If you want to create new vocabulary/tags for your resources, you must have the necessary user account permissions. Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must have role `ADMIN` or `MANAGER`

#### Errors for creating a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | This relationship already exists | The resource already has a vocabulary with the same name for the specified application
400            | - tags: tags check failed. -  | Either the `tags` or `applications` body fields are missing or have an invalid value
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create a vocabulary for resource which `application` value is not associated with your user account.


### Creating multiple vocabulary/tags for a resource

> Creating new vocabularies/tags for a dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "tags": [<tags>]
  }'
```

> Creating new vocabularies/tags for a widget

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary \
-H "Content-Type: application/json"  -d \
'{
    "vocabulary1": {
        "tags":["tag1", "tag2"],
        "application": "rw"
    },
    "vocabulary2": {
        "tags":["tag3", "tag4"],
        "application": "rw"
    }
}'
```

> Creating new vocabularies/tags for a layer

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary \
-H "Content-Type: application/json"  -d \
'{
    "vocabulary1": {
        "tags":["tag1", "tag2"],
        "application": "rw"
    },
    "vocabulary2": {
        "tags":["tag3", "tag4"],
        "application": "rw"
    }
}'
```
> Example response

```json
{
    "data": [
        {
            "id": "vocabulary1",
            "type": "vocabulary",
            "attributes": {
                "tags": [
                    "tag1",
                    "tag2"
                ],
                "name": "vocabulary1",
                "application": "rw"
            }
        },
        {
            "id": "vocabulary2",
            "type": "vocabulary",
            "attributes": {
                "tags": [
                    "tag3",
                    "tag4"
                ],
                "name": "vocabulary2",
                "application": "rw"
            }
        }
    ]
}
```

This set of endpoints will allow you to create multiple vocabularies/tags for a single resource in a single request. The primary use case for these endpoint is when you just created a new dataset/layer/widget, and want to add multiple vocabularies/tags to them.

The request body must contain at least one key, each of them corresponding to the names of the vocabularies you want to create. Each of these keys must have an object-type value, which in turn must contain the following keys:

- `tags`: an array of tags
- `application`: the application associated with the vocabulary.
  
You can create different vocabularies for different applications in a single request.

Assuming the creation was successful, the response will contain a list of all vocabularies and their respective tags associated with the specified resource, for all applications.

If you want to create new vocabulary/tags for your resources, you must have the necessary user account permissions. Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must have role `ADMIN` or `MANAGER`

#### Errors for creating a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | This relationship already exists | The resource already has one or more vocabularies with the same name(s) for the specified application(s)
400            | - `<value>`: `<value>` check failed. -  | The body object has a `<value>` key which content is invalid (is not an object, or is missing `tags` and/or `application`).
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create a vocabulary for resource which `application` value is not associated with your user account.

## Updating vocabulary/tags

As described above, 

> Updating a relationship between a Vocabulary and a Dataset

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
 "application": <application>,
   "tags": [<tags>]
  }'
```

> Updating a relationship between a Vocabulary and a Widget

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
 "application": <application>,
   "tags": [<tags>]
  }'
```

> Updating a relationship between a Vocabulary and a Layer

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
 "application": <application>,
   "tags": [<tags>]
  }'
```

> Example of request with real data

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary/science
-H "Content-Type: application/json"  -d \
 '{
 "application": <application>,
   "tags": ["maths", "astronomy"]
  }'
```

> Example of response with real data

```json
{
  "data": [
    {
      "id": "vocabularyNameOne",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "tag1",
          "tag2",
          "tag3"
        ]
      }
    },
    {
      "id": "science",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "maths",
          "astronomy"
        ]
      }
    },
    {
      "id": "aaa",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "biology",
          "chemistry"
        ]
      }
    }
  ]
}
```

## Creating several Vocabulary-Resource relationships

There is also an endpoint that allows you to create multiple relationships in the same request.

> Creating multiple relationships between a Vocabulary and a Dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary \
-H "Content-Type: application/json"  -d \
 '{
   "vocabularyOne": {
   "application": <application>,
       "tags": [<tags>]
   },
   "vocabularyTwo": {
   "application": <application>,
       "tags": [<tags>]
   }
  }'
```

> Creating multiple relationships between a Vocabulary and a Widget

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary\
-H "Content-Type: application/json"  -d \
'{
  "vocabularyOne": {
  "application": <application>,
      "tags": [<tags>]
  },
  "vocabularyTwo": {
  "application": <application>,
      "tags": [<tags>]
  }
 }'
```

> Creating multiple relationships between a Vocabulary and a Layer

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary \
-H "Content-Type: application/json"  -d \
'{
  "vocabularyOne": {
  "application": <application>,
      "tags": [<tags>]
  },
  "vocabularyTwo": {
  "application": <application>,
      "tags": [<tags>]
  }
 }'
```

> Example of request with real data

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary?application=<application>
-H "Content-Type: application/json"  -d \
 '{
     "country": {
         "tags": ["Spain", "Italy", "Portugal"]
     },
     "sport": {
         "tags": ["football", "basketball", "voleyball"]
     },
     "color": {
         "tags": ["red", "green", "blue"]
     }
  }'
```

> Example of response with real data

```json
{
  "data": [
    {
      "id": "vocabularyNameTwo",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "tag1",
          "tag2",
          "tag3"
        ]
      }
    },
    {
      "id": "vocabularyNameOne",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "tag1",
          "tag2",
          "tag3"
        ]
      }
    },
    {
      "id": "a",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "tag1",
          "tag2",
          "tag3"
        ]
      }
    },
    {
      "id": "b",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "tag1",
          "tag2",
          "tag3"
        ]
      }
    },
    {
      "id": "newV",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "test1",
          "test2"
        ]
      }
    },
    {
      "id": "country",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "Spain",
          "Italy",
          "Portugal"
        ]
      }
    },
    {
      "id": "sport",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "football",
          "basketball",
          "voleyball"
        ]
      }
    },
    {
      "id": "color",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "red",
          "green",
          "blue"
        ]
      }
    }
  ]
}
```

## Deleting relationships

> Deleting relationships between a Vocabulary and a Dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id>
```

> Deleting relationships between a Vocabulary and a Widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id>
```

> Deleting relationships between a Vocabulary and a Layer

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id>
```

> Example of request with real data

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary/science
```

> Example of response with real data

```json
{
  "data": [
    {
      "id": "country",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "Spain",
          "Italy",
          "Portugal"
        ]
      }
    },
    {
      "id": "color",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "red",
          "green",
          "blue"
        ]
      }
    }
  ]
}
```

## Getting Vocabularies associated to a Resource

You can be request all vocabularies that are associated to a particular resource. It optionally accepts a `app` or `application` query parameter, that will filter the vocabulary's `application`. If none is provided, `rw` is used as default.

> Getting Vocabularies related with a Dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary
```

> Getting Vocabularies related with a Widget

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary
```

> Getting Vocabularies related with a Layer

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary
```

> Example of request with real data

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary
```

> Example of response with real data

```json
{
  "data": [
    {
      "id": "country",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "Spain",
          "Italy",
          "Portugal"
        ]
      }
    },
    {
      "id": "color",
      "type": "vocabulary",
      "attributes": {
        "tags": [
          "red",
          "green",
          "blue"
        ]
      }
    }
  ]
}
```

## Getting a single relationship (broken now)

> Getting a single relationship between a Vocabulary and a Dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id>
```

> Getting a single relationship between a Vocabulary and a Widget

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id>
```

> Getting a single relationship between a Vocabulary and a Layer

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id>
```

## Getting resources (COMMON USE CASE)

There is also an endpoint available which accepts requests just indicating resource type and
the desired vocabulary-tag matching.

It currently supports DOUBLE-OR pattern matching, meaning the API will return
all resources that at least have one (or more) tags in a particular vocabulary. At the same time it will also apply an OR to the entities of other vocabulary-tag matchings.

The query has to be set in the url by the query params.

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/vocabulary/find
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/vocabulary/find
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/vocabulary/find
```

> Example of response with real data

```shell
curl -X GET http://api.resourcewatch.org/v1/dataset/vocabulary/find?legacy=cdi,coasts
```

## Getting all vocabularies

This endpoint is quite useful to have a quick overview of all existing vocabularies and resources.

```shell
curl -X GET https://api.resourcewatch.org/v1/vocabulary
```

## Finding vocabularies by ids

The `ids` property is required in the body of the request. It can be either an array of ids or a string of comma-separated ids:

- `{"ids": ["112313", "111123"]}`
- `{"ids": "112313, 111123"}`


```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Example of request with real data

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
	"ids": "942b3f38-9504-4273-af51-0440170ffc86, 08ff8183-48dc-457a-8924-bb4e7a87b8a8"
  }'
```

> Example of response with real data

```json
{
  "data": [
    {
      "type": "resource",
      "id": "08ff8183-48dc-457a-8924-bb4e7a87b8a8",
      "attributes": {
        "legacy": [
          "cdi",
          "inundation",
          "national",
          "united states",
          "local",
          "coasts",
          "flooding",
          "health"
        ]
      }
    },
    {
      "type": "resource",
      "id": "942b3f38-9504-4273-af51-0440170ffc86",
      "attributes": {
        "country": [
          "Spain",
          "Italy",
          "Portugal"
        ],
        "color": [
          "red",
          "green",
          "blue"
        ]
      }
    }
  ]
}
```

## Vocabulary Creation

As was mentioned before, it is possible to just create a new and empty vocabulary

```shell
curl -X POST https://api.resourcewatch.org/v1/vocabulary/vocabularyName \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "name": <vocabularyName>
  }'
```

It is also possible to update and delete an entire vocabulary. Said that, because
it's necessary to keep consistency between entities with weak relationship, these
operations are only available to SUPERADMINS.

## Bulk delete of resource's vocabulary

> Deleting all Vocabulary associated with a Dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/:datasetId/vocabulary \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your-token>"
```

> Deleting all Vocabulary associated with a Widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/datasetId/widget/:widgetId/vocabulary \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your-token>"
```

> Deleting all Vocabulary associated with a Layer

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/datasetId/layer/:layerId/vocabulary \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your-token>"
```

In order to use these endpoints, you need to meet one of the following criteria:

- being authenticated as a SUPERADMIN;
- being authenticated as an ADMIN who has access to the apps of the resource associated (dataset/widget/layer);
- being authenticated as a MANAGER who has access to the apps of the resource associated AND own the resource.

All endpoints return `200 OK` in case of success, along with the list of the deleted entities.
