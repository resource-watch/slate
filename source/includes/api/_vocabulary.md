# Vocabulary (and Tags)

## Tags definition

A way to categorize a resource within a vocabulary context.

## Vocabulary definition

The Vocabulary can be described as a cluster of tags.

It is currently possible to just create a Vocabulary without any tags or relationships.
To do it, the only parameter that is required is the name of the Vocabulary.

| Field             | Description                                                       | Type
| ------------------|:-----------------------------------------:                        | -----:
| name              | The name of the Vocabulary (**it has to be unique and it represents the "primaryKey"**) | String

However, the most common use case relies on the relationships creation.

## Relationships

This section describes how to associate an existing or new Vocabulary to a resource.

Some important points:

- A **Vocabulary** can have **N** associated **Resources**.
- A **Resource** can have **M** associated **Vocabularies**.
- The way of building these **relationships** is creating **Tags**.

## Assign a Vocabulary to an existing Resource

To create a relationship between a resource and a Vocabulary (even if the vocabulary doesn't exist yet) it is only required that you set the tags that define the relationship.

Some writing operations can take a little more time than reading ones. Even if the relationships are not strong, the writing operations have to ensure consistency along entities.

<aside class="notice">
Please, be sure that the request is properly authenticated and the current user has permission to the resource.
If you don't know how to do this, please go to the <a href="#authentication">Authentication section</a>
</aside>

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "tags": [<tags>]
  }'
```

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "tags": [<tags>]
  }'
```

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "tags": [<tags>]
  }'
```

> real example

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary/science
-H "Content-Type: application/json"  -d \
 '{
   "tags": ["biology", "chemistry"]
  }'
```

> real Response

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
          "biology",
          "chemistry"
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

## Updating Tags of an existing relationship

If a relationship has to be updated, it's necessary to define it's new tags.
The previous tags will be deleted in benefit of the new ones.

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "tags": [<tags>]
  }'
```

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "tags": [<tags>]
  }'
```

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "tags": [<tags>]
  }'
```

> real example

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary/science
-H "Content-Type: application/json"  -d \
 '{
   "tags": ["maths", "astronomy"]
  }'
```

> response

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

## Creating several relationships

There is also an endpoint that allows you to create some relationships in the same request.

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary \
-H "Content-Type: application/json"  -d \
 '{
   "vocabularyOne": {
       "tags": [<tags>]
   },
   "vocabularyTwo": {
       "tags": [<tags>]
   }
  }'
```

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary\
-H "Content-Type: application/json"  -d \
'{
  "vocabularyOne": {
      "tags": [<tags>]
  },
  "vocabularyTwo": {
      "tags": [<tags>]
  }
 }'
```

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary \
-H "Content-Type: application/json"  -d \
'{
  "vocabularyOne": {
      "tags": [<tags>]
  },
  "vocabularyTwo": {
      "tags": [<tags>]
  }
 }'
```

> real example

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary
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

> response

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

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id>
```

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id>
```

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id>
```

> real example

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary/science
```

> response

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

## Getting vocabularies associated to a resource

You can be request all vocabularies that are associated to a particular resource.

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary
```

> real example

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary
```

> response

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


```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id>
```

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id>
```

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

> real example

```shell
curl -X GET http://api.resourcewatch.org/v1/dataset/vocabulary/find?legacy=cdi,coasts
```

## Getting all vocabularies

This endpoint is quite useful to have a quick overview of all existing vocabularies and resources.

```shell
curl -X GET https://api.resourcewatch.org/v1/vocabulary
```

## Finding (getting) by ids

The "ids" property is required in the payload. In other cases the endpoint responds with a 400 HTTP ERROR (Bad Request)
This property can be an Array or a String (comma-separated)
payload -> {"ids": ["112313", "111123"]}
payload -> {"ids": "112313, 111123"}

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

> real example

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
	"ids": "942b3f38-9504-4273-af51-0440170ffc86, 08ff8183-48dc-457a-8924-bb4e7a87b8a8"
  }'
```

> response

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
   "name": <vocabularyName>
  }'
```

It is also possible to update and delete an entire vocabulary. Said that, because
it's necessary to keep consistency between entities with weak relationship, these
operations are only available to SUPERADMINS.
