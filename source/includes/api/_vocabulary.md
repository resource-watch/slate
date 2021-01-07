# Vocabularies and tags

## What are vocabularies and tags?

[Vocabularies and tags concepts](#vocabularies-and-tags) are covered in their dedicated section, and we strongly recommend you read that section before diving into the details of the respective endpoints. In it, we explain in detail what is a tag and a vocabulary, and why you should use them to empower different use cases of the RW API.

Simply put, a tag is a keyword that describes a `resource` (we'll talk in depth about what these are in the next section). A vocabulary is a groups of tags, and has a name (also called and used as an `id` for the vocabulary) that should define the scope or context of the tags it contains.

It's important to keep in mind that these associations between a resource and a vocabulary have an [application](#applications) associated with them. Putting this in an example, `dataset` A may be associated with vocabulary X for application `rw`, but not for application `gfw`. Most endpoints will allow you explicitly define which application you are referring to (some will even require it), and a `rw` default value will be assumed when no explicit value is provided.

## What are resources?

Throughout this section, we'll refer multiple times to `resources`. Simply put, a `resource` is either a dataset, a widget, or a layer. Tags and vocabularies work in a similar fashion for each of these 3 types of RW API entity, so often we'll refer to resources instead, for convenience.

We assume that, at this point, you are already familiar with the concepts of [dataset](#dataset), [layer](#layer) or [widget](#widget) (ideally you are familiar with the 3). If that's not the case, we strongly encourage you learn about those concepts first, and we also recommend you take some time to explore and experiment using actual [dataset](#dataset6), [layer](#layer8) or [widget](#widget9) endpoints before proceeding. Vocabularies and tags exist to improve and empower your use cases of those resources, so it should only be used by applications and users that are already comfortable with the basics, and want to take their knowledge of the RW API to the next level.

The behavior of vocabulary and tags endpoints aims to be, as much as possible, independent from the target resource it references. In the detailed endpoint documentation below we'll cover the different endpoints in depth, and highlight the differences in behavior when handling different resource types, but you can safely assume that, for most of it, behavior described for a type of resource will be the same for all 3 types.

### A note on resources

> Creating a new vocabulary/tag for a widget

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/AAA/widget/BBB/vocabulary/VVV \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "tags": [<tags>]
  }'
```

In the context of the vocabulary/tag service, widgets and layers are identified not only by their own id, but also by the id you specify as being their associated dataset. Using the side example as reference, this API request would create a vocabulary `VVV` for the resource widget `BBB` associated with dataset `AAA`. If you later reference the same widget id, but as belonging to a different dataset, it will be treated as a different resource altogether, and thus will have different vocabularies and tags.

## Associations between vocabularies, tags and resources

### Vocabularies and resources

Despite not being 100% accurate, it's useful to think that a vocabulary is uniquely identified by a tuple of 3 values:

- The resource (id and type) to which it's associated
- Its `name` or `id` (these are 2 names for the same underlying value)
- Its `application`

Putting it in other words: if you reuse the name of an existing vocabulary, but associate with a different resource and/or application, you are effectively creating a different vocabulary. 

### Vocabularies and tags

Tags are simply strings associated with an individual vocabulary. They have no direct connection to a resource, and have no logic or complexity within the context of a vocabulary. Tags that have the same value but belong to different vocabularies are not matched or related in any way.

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

## Creating vocabulary/tags for a resource

There are two types of endpoints for associating vocabulary/tags with resources: one allows you to create a single vocabulary (and its tags) for a resource, while the other supports creating multiple vocabularies/tags for a single resource. The primary use case for these endpoint is when you just created a new dataset/layer/widget, and want to add vocabularies/tags to them.

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


This set of endpoints will allow you to create a new vocabulary/tags for a resource. 

The request body must contain both an array of tags, and the `application` under which the vocabulary/tags are being created. If a vocabulary with the same name already exists for the specified application, you will get an error message - you can use the update endpoints to modify an existing vocabulary.

Assuming the creation was successful, the response will contain a list of all vocabularies and their respective tags associated with the specified resource, for all applications.

If you want to create new vocabulary/tags for your resources, you must have the necessary user account permissions. Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must have role `ADMIN` or `MANAGER`

When creating vocabulary/tags for a resource, the dataset id specified in the URL is validated, and the requests fails if a dataset with the given id does not exist. When creating a vocabulary for a widget or layer, you should ensure you specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a known limitation of the current implementation, and may be modified at any time, and invalid resources (those where the layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior warning.

#### Errors for creating a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | This relationship already exists | The resource already has a vocabulary with the same name for the specified application
400            | - tags: tags can not be empty. -  | `tags` body fields is empty
400            | - tags: tags check failed. -  | Either the `tags` or `applications` body fields are missing or have an invalid value
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create a vocabulary for resource which `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.


### Creating multiple vocabulary/tags for a resource

> Creating new vocabularies/tags for a dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary \
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

This set of endpoints will allow you to create multiple vocabularies/tags for a single resource in a single request. 

The request body must contain at least one key, each of them corresponding to the names of the vocabularies you want to create. Each of these keys must have an object-type value, which in turn must contain the following keys:

- `tags`: an array of tags
- `application`: the application associated with the vocabulary.
  
You can create different vocabularies for different applications in a single request.

Assuming the creation was successful, the response will contain a list of all vocabularies and their respective tags associated with the specified resource, for all applications.

If you want to create new vocabulary/tags for your resources, you must have the necessary user account permissions. Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must have role `ADMIN` or `MANAGER`

When creating vocabularies/tags for a resource, the dataset id specified in the URL is validated, and the requests fails if a dataset with the given id does not exist. When creating a vocabulary for a widget or layer, you should ensure you specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a known limitation of the current implementation, and may be modified at any time, and invalid resources (those where the layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior warning.

#### Errors for creating a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | This relationship already exists | The resource already has one or more vocabularies with the same name(s) for the specified application(s)
400            | - `<value>`: `<value>` check failed. -  | The body object has a `<value>` key which content is invalid (is not an object, or is missing `tags` and/or `application`).
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create a vocabulary for resource which `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.


## Updating vocabulary/tags

If you have already associated vocabularies and tags to your resources, and would like to modify those tags, the next set of endpoints is for you.

There are two types of endpoints for updating existing vocabulary/tags: one allows you to modify a single vocabulary (and its tags) for a resource, while the other supports updating multiple vocabularies/tags for a single resource with a single request.

### Updating a single vocabulary/tags for a resource


> Updating a vocabulary for a dataset

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "tags": [<tags>]
  }'
```

> Updating a vocabulary for a widget

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id> \
-H "Content-Type: application/json"  -d \
 '{
   "application": <application>,
   "tags": [<tags>]
  }'
```

> Updating a vocabulary for a layer

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id> \
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

This set of endpoints will allow you to update the tags of an existing vocabulary/tags for a resource.

The request body must contain the `application` of the vocabulary you want to update, and it will fail if you specify an vocabulary name/application pair that does not exist. Additionally, it must contain a `tags` array of strings with a list of new tags to use. Any existing tags that already existed for that vocabulary (for that resource and application) will be deleted, and replaced with the values you provide through this request. 

Assuming the update was successful, the response will contain a list of all vocabularies and their respective tags associated with the specified resource, for all applications.

If you want to update vocabulary/tags for your resources, you must have the necessary user account permissions. Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must have role `ADMIN` or `MANAGER`

When updating vocabulary/tags for a resource, the dataset id specified in the URL is validated, and the requests fails if a dataset with the given id does not exist. When updating a vocabulary for a widget or layer, you should ensure you specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a known limitation of the current implementation, and may be modified at any time, and invalid resources (those where the layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior warning.

#### Errors for updating a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | - `<value>`: `<value>` check failed. -  | The body object has a `<value>` key which content is invalid (is not an object, or is missing `tags` and/or `application`).
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to update a vocabulary for resource which `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.
404            | Relationship between undefined and dataset - `<dataset id>` and dataset: `<dataset id>` doesn't exist      | You are trying to update a vocabulary that doesn't exist. Check your vocabulary name and application


### Updating multiple vocabulary/tags for a resource

> Updating multiple vocabularies/tags for a dataset

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary \
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

> Updating multiple vocabularies/tags for a widget

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary \
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

> Updating multiple vocabularies/tags for a layer

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary \
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

**Know issue warning** There's a known issue where you may experience a `400 - This relationship already exists` error when using these endpoints. There's currently no ETA for its resolution.

This set of endpoints will allow you to update multiple vocabularies/tags for a single resource in a single request.

The request body must contain at least one key, each of them corresponding to the names of the vocabularies you want to update. Each of these keys must have an object-type value, which in turn must contain the following keys:

- `tags`: an array of tags that will replace all the tags for that vocabulary (associated with that resource and application)
- `application`: the application associated with the vocabulary you want to update.

You can update different vocabularies for different applications in a single request.

Assuming the update was successful, the response will contain a list of all vocabularies and their respective tags associated with the specified resource, for all applications.

If you want to update vocabulary/tags for your resources, you must have the necessary user account permissions. Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must have role `ADMIN` or `MANAGER`

When updating vocabulary/tags for a resource, the dataset id specified in the URL is validated, and the requests fails if a dataset with the given id does not exist. When updating a vocabulary for a widget or layer, you should ensure you specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a known limitation of the current implementation, and may be modified at any time, and invalid resources (those where the layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior warning.

#### Errors for updating multiple vocabularies/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | - tags: tags can not be empty. -  | `tags` body fields is empty
400            | - tags: tags check failed. -  | Either the `tags` or `applications` body fields are missing or have an invalid value.
401
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to update a vocabulary for resource which `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.
404            | Relationship between undefined and dataset - `<dataset id>` and dataset: `<dataset id>` doesn't exist      | You are trying to update a vocabulary that doesn't exist. Check your vocabulary name and application


## Cloning vocabularies/tags for a dataset

> Cloning vocabularies/tags for a dataset

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/clone/dataset \
-H "Content-Type: application/json"  -d \
 '{
    "newDataset": "<target-dataset-id>"
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

This endpoint allows you to clone all vocabularies/tags for all applications, for a single dataset. 

The URL should include the id of the source dataset, while the POST body should include a `newDataset` field containing the id of the target dataset. The target dataset id is not validated - the cloning will still occur even if the target id doesn't correspond to an existing dataset.

The dataset you use as the target dataset can have existing vocabularies - the cloning operation is an additive, and will not update nor destroy any existing vocabulary that may have already been associated with the target dataset. However, the cloning operation will fail if it tries to overwrite a vocabulary (ie. if the target dataset already has a vocabulary with the same name and application as one being created as part of the cloning). This failure is not atomic - the target dataset may end up with some of the vocabularies of the source dataset. It's up to you, as the RW API user, to both manage these collisions, and recover from them should they happen.

Assuming the cloning was successful, the response will contain a list of all vocabularies (both newly cloned and preexisting) and their respective tags, for all applications, for the target dataset.

If you want to clone vocabularies/tags for your datasets, you must have the necessary user account permissions. Specifically:

- the user must be logged in and belong to the same application as the source dataset
- the user must have role `ADMIN` or `MANAGER`

When cloning vocabularies/tags for a dataset, the source dataset id specified in the URL is validated, and the requests fails if a dataset with the given id does not exist. When creating a vocabulary for a widget or layer, you should ensure you specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a known limitation of the current implementation, and may be modified at any time, and invalid resources (those where the layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior warning.

#### Errors for cloning vocabularies/tags for a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | This relationship already exists | The target dataset already has one or more vocabularies with the same name(s) and application(s) as the source dataset.
400            | - newDataset: newDataset can not be empty. -   | The body object must have a `newDataset` key with the id of the target dataset.
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to clone vocabulary for a source dataset which `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to clone a vocabularies for a source dataset that doesn't exist.


## Deleting relationships

> Deleting relationships between a Vocabulary and a Dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id>
```

> Deleting relationships between a Vocabulary and a widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id>
```

> Deleting relationships between a Vocabulary and a layer

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id>
```

> Example of request 

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary/science
```

> Example of response 

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

> Getting Vocabularies related with a widget

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary
```

> Getting Vocabularies related with a layer

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary
```

> Example of request 

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/942b3f38-9504-4273-af51-0440170ffc86/vocabulary
```

> Example of response 

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

> Example of response 

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

> Example of request 

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
	"ids": "942b3f38-9504-4273-af51-0440170ffc86, 08ff8183-48dc-457a-8924-bb4e7a87b8a8"
  }'
```

> Example of response 

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

> Deleting all Vocabulary associated with a widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/datasetId/widget/:widgetId/vocabulary \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your-token>"
```

> Deleting all Vocabulary associated with a layer

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
