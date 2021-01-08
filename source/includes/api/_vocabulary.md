# Vocabularies and tags

## What are vocabularies and tags?

[Vocabularies and tags concepts](#vocabularies-and-tags) are covered in their dedicated section, and we strongly
recommend you read that section before diving into the details of the respective endpoints. In it, we explain in detail
what is a tag and a vocabulary, and why you should use them to empower different use cases of the RW API.

Simply put, a tag is a keyword that describes a `resource` (we'll talk in depth about what these are in the next
section). A vocabulary is a group of tags and has a name (also called and used as an `id` for the vocabulary) that
should define the scope or context of the tags it contains.

It's important to keep in mind that these associations between a resource and a vocabulary have
an [application](#applications) associated with them. Putting this in an example, `dataset` `AAA` may be associated with
vocabulary `BBB` for application `rw`, but not for application `gfw`. Most endpoints will allow you explicitly define
which application you are referring to (some will even require it), and a `rw` default value will be assumed when no
explicit value is provided.

## What are resources?

Throughout this section, we'll refer multiple times to `resources`. Simply put, a `resource` is either a dataset, a
widget, or a layer. Tags and vocabularies work in a similar fashion for each of these 3 types of RW API entity, so often
we'll refer to resources instead, for convenience.

We assume that, at this point, you are already familiar with the concepts of [dataset](#dataset), [layer](#layer)
or [widget](#widget) (ideally you are familiar with the 3). If that's not the case, we strongly encourage you to learn
about those concepts first, and we also recommend you take some time to explore and experiment using
actual [dataset](#dataset6), [layer](#layer8), or [widget](#widget9) endpoints before proceeding. Vocabularies and tags
exist to improve and empower your use cases of those resources, so it should only be used by applications and users that
are already comfortable with the basics, and want to take their knowledge of the RW API to the next level.

The behavior of vocabulary and tags endpoints aims to be, as much as possible, independent from the type of the target
resource it references. In the detailed endpoint documentation below we'll cover the different endpoints in depth, and
highlight the differences in behavior when handling different resource types, but you can safely assume that, for most
of it, the behavior described for a type of resource will be the same for all 3 types.

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

In the context of the vocabulary/tag service, widgets and layers are identified not only by their own id but also by the
id you specify as being their associated dataset. Using the side example as reference, this API request would create a
vocabulary `VVV` for the resource widget `BBB` associated with dataset `AAA`. If you later reference the same widget id,
but as belonging to a different dataset, it will be treated as a different resource altogether, and thus will have
different vocabularies and tags.

## The special `knowledge_graph` vocabulary

Throughout the whole vocabulary/tags service, there is a special vocabulary named `knowledge_graph`. When used, this
vocabulary acts as any other vocabulary but has additional logic built-in for the purpose of integrating vocabulary/tags
with the [graph](#graph) available as part of the RW API.

Whenever you create or clone a vocabulary named `knowledge_graph` for a resource,
the [dataset](#creating-dataset-graph-nodes), [layer](#creating-layer-graph-nodes)
or [widget](#creating-widget-graph-nodes) node is added to the graph if not already present, and
the [tags are associated to it](#associating-concepts-to-graph-nodes). Updating the `knowledge_graph` vocabulary also
updates the corresponding [tags associated to it](#updating-concepts-associated-with-graph-nodes) on the graph side, and
deleting the vocabulary
also [deletes the corresponding tags in the graph](#deleting-concepts-associated-with-graph-nodes).

For more details on the graph, its purpose, and how to use it, please refer to the dedicated documentation section on
the [graph](#graph) and [its endpoints](#graph7).

## Associations between vocabularies, tags and resources

### Vocabularies and resources

Despite not being 100% accurate, when manipulating vocabularies in the context of a single resource, it's useful to
think that a vocabulary is uniquely identified by a tuple of 3 values:

- The resource (id and type) to which it's associated
- Its `name` or `id` (these are 2 names for the same underlying value)
- Its `application`

Putting it in other words: if you reuse the name of an existing vocabulary, but associate it with a different resource
and/or application, you are effectively creating a different vocabulary.

Later on, we'll cover endpoints that aggregate multiple vocabularies in different ways, as a convenience for resource
browsing and discovery.

### Vocabularies and tags

Tags are simply strings associated with an individual vocabulary. They have no direct connection to a resource and have
no logic or complexity within the context of a vocabulary. Tags that have the same value but belong to different
vocabularies are not matched or related in any way.

## Endpoint overview

In broad terms, there are two types of endpoints for manipulating vocabulary/tags: endpoints that allow
to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) vocabulary/tags for a given resource, and
endpoints that allow you to query for resources for a given vocabulary/tag.

We'll start by covering how you can manipulate associations between vocabulary/tags and resources, and further down will
cover how to list vocabulary/tags, and their associated resources.

## Getting vocabulary/tags for a resource

There are two types of endpoints that will allow you to get vocabularies and tags for a resource: one to retrieve all
vocabularies and their tags, and another to retrieve all tags for a given vocabulary.

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

These endpoints allow you to get vocabulary/tags for a single dataset, widget, or layer. By default, vocabulary/tags for
the `rw` application are returned, but you can use the optional `app` or `application` query parameters to load data for
a different application.

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

These endpoints allow you to get a single vocabulary and its tags for a single dataset, widget, or layer. By default,
vocabulary/tags for the `rw` application are returned, but you can use the optional `app` or `application` query
parameters to load data for a different application.

### Getting vocabularies and tags for multiple resources

> Getting vocabularies and tags for multiple datasets

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Getting vocabularies and tags for multiple widgets

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Getting vocabularies and tags for multiple layers

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/vocabulary/find-by-ids \
-H "Content-Type: application/json"  -d \
 '{
   "ids": [<ids>]
  }'
```

> Example response

```json
{
    "data": [
        {
            "type": "vocabulary",
            "attributes": {
                "resource": {
                    "id": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                    "type": "dataset"
                },
                "tags": [
                    "tag1",
                    "tag5"
                ],
                "name": "vocabulary1",
                "application": "cw"
            }
        },
        {
            "type": "vocabulary",
            "attributes": {
                "resource": {
                    "id": "ca6817fd-130c-47d4-8a95-303083b2cffa",
                    "type": "dataset"
                },
                "tags": [
                    "tag3",
                    "tag2"
                ],
                "name": "test2",
                "application": "gfw"
            }
        }
    ]
}
```

This group of endpoints allows you to retrieve the vocabularies for multiple resources of the same type using a single
request. It expects a body containing an `ids` value, which can either be an array of ids, or a string containing
multiple ids separated by commas.

When retrieving widgets or layers using these endpoints, the dataset id passed in the URL is ignored, and will not
affect the result of the endpoint.

These endpoints return vocabularies for all applications by default, but you can pass an optional `application` value as
a query parameter to filter by a specific application.

#### Errors for getting vocabularies and tags for multiple resources

Error code     | Error message  | Description
-------------- | -------------- | --------------
404            | Bad request - Missing 'ids' from request body   | Your request body is missing the `ids` field

## Creating vocabularies/tags for a resource

There are two types of endpoints for associating vocabulary/tags with resources: one allows you to create a single
vocabulary (and its tags) for a resource, while the other supports creating multiple vocabularies/tags for a single
resource. The primary use case for these endpoints is when you just created a new dataset/layer/widget, and want to add
vocabularies/tags to them.

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

The request body must contain both an array of tags and the `application` under which the vocabulary/tags are being
created. If a vocabulary with the same name already exists for the specified application, you will get an error message

- you can use the update endpoints to modify an existing vocabulary.

Assuming the creation was successful, the response will contain a list of all vocabularies and their respective tags
associated with the specified resource, for all applications.

If you want to create new vocabulary/tags for your resources, you must have the necessary user account permissions.
Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must match one of the following:
    - have role `ADMIN`
    - have role `MANAGER` and be the resource's owner (through the `userId` field of the resource)

When creating vocabulary/tags for a resource, the dataset id specified in the URL is validated, and the requests fail if
a dataset with the given id does not exist. When creating a vocabulary for a widget or layer, you should ensure you
specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a
known limitation of the current implementation, and may be modified at any time, and invalid resources (those where the
layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior warning.

#### Errors for creating a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | This relationship already exists | The resource already has a vocabulary with the same name for the specified application
400            | - tags: tags can not be empty. -  | `tags` body fields is empty
400            | - tags: tags check failed. -  | Either the `tags` or `applications` body fields are missing or have an invalid value
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create a vocabulary for a resource whose `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.

### Creating multiple vocabularies/tags for a resource

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

The request body must contain at least one key, each of them corresponding to the names of the vocabularies you want to
create. Each of these keys must have an object-type value, which in turn must contain the following keys:

- `tags`: an array of tags
- `application`: the application associated with the vocabulary.

You can create different vocabularies for different applications in a single request.

Assuming the creation was successful, the response will contain a list of all vocabularies and their respective tags
associated with the specified resource, for all applications.

If you want to create new vocabulary/tags for your resources, you must have the necessary user account permissions.
Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must match one of the following:
    - have role `ADMIN`
    - have role `MANAGER` and be the resource's owner (through the `userId` field of the resource)

When creating vocabularies/tags for a resource, the dataset id specified in the URL is validated, and the requests fail
if a dataset with the given id does not exist. When creating a vocabulary for a widget or layer, you should ensure you
specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a
known limitation of the current implementation, and may be modified at any time, and invalid resources (those where the
layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior warning.

#### Errors for creating a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | This relationship already exists | The resource already has one or more vocabularies with the same name(s) for the specified application(s)
400            | - `<value>`: `<value>` check failed. -  | The body object has a `<value>` key which content is invalid (is not an object or is missing `tags` and/or `application`).
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create a vocabulary for a resource whose `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.

## Updating vocabularies/tags

If you have already associated vocabularies and tags to your resources and would like to modify those tags, the next set
of endpoints is for you.

There are three types of endpoints for updating existing vocabulary/tags:

- endpoints that allow you to modify a single vocabulary (and its tags) for a resource
- endpoints that allow you to modify multiple vocabularies/tags for a single resource with a single request
- endpoint that allow you to add new tags to an existing dataset vocabulary

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

The request body must contain the `application` of the vocabulary you want to update, and it will fail if you specify a
vocabulary name/application pair that does not exist. Additionally, it must contain a `tags` array of strings with a
list of new tags to use. Any existing tags that already existed for that vocabulary (for that resource and application)
will be deleted, and replaced with the values you provide through this request.

Assuming the update was successful, the response will contain a list of all vocabularies and their respective tags
associated with the specified resource, for all applications.

If you want to update vocabulary/tags for your resources, you must have the necessary user account permissions.
Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must match one of the following:
    - have role `ADMIN`
    - have role `MANAGER` and be the resource's owner (through the `userId` field of the resource)

When updating vocabulary/tags for a resource, the dataset id specified in the URL is validated, and the requests fail if
a dataset with the given id does not exist. When updating a vocabulary for a widget or layer, you should ensure you
specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a
known limitation of the current implementation, and may be modified at any time, and invalid resources (those where the
layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior warning.

#### Errors for updating a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | - `<value>`: `<value>` check failed. -  | The body object has a `<value>` key which content is invalid (is not an object, or is missing `tags` and/or `application`).
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to update a vocabulary for a resource whose `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.
404            | Relationship between undefined and dataset - `<dataset id>` and dataset: `<dataset id>` doesn't exist      | You are trying to update a vocabulary that doesn't exist. Check your vocabulary name and application

### Updating multiple vocabularies/tags for a dataset

> Updating multiple vocabularies/tags for a dataset

```shell
curl -X PUT https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary \
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

**Know issue warning** There's a known issue where you may experience a `400 - This relationship already exists` error
when using this endpoint. There's currently no ETA for its resolution. As a workaround, we suggest updating vocabularies
individually.

This endpoint will allow you to update multiple vocabularies/tags for a single dataset in a single request.

The request body must contain at least one key, each of them corresponding to the names of the vocabularies you want to
update. Each of these keys must have an object-type value, which in turn must contain the following keys:

- `tags`: an array of tags that will replace all the tags for that vocabulary (associated with that dataset and
  application)
- `application`: the application associated with the vocabulary you want to update.

You can update different vocabularies for different applications in a single request.

Assuming the update was successful, the response will contain a list of all vocabularies and their respective tags
associated with the specified dataset, for all applications.

If you want to update vocabulary/tags for your datasets, you must have the necessary user account permissions.
Specifically:

- the user must be logged in and belong to the same application as the dataset
- the user must match one of the following:
    - have role `ADMIN`
    - have role `MANAGER` and be the dataset's owner (through the `userId` field of the dataset)

#### Errors for updating multiple vocabularies/tags for a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | - tags: tags can not be empty. -  | `tags` body fields is empty
400            | - tags: tags check failed. -  | Either the `tags` or `applications` body fields are missing or have an invalid value.
401 | Unauthorized | You are not authenticated.
403 | Forbidden | You are trying to update a vocabulary for a resource whose `application` value is not associated with your user account.
404 | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]} | You are trying to create a vocabulary for a dataset that doesn't exist.
404 | Relationship between undefined and dataset - `<dataset id>` and dataset: `<dataset id>` doesn't exist | You are trying to update a vocabulary that doesn't exist. Check your vocabulary name and application

### Concatenating tags to a dataset vocabulary

> Concatenating tags to a dataset vocabulary

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id>/concat \
-H "Content-Type: application/json"  -d \
'{
    "tags":["tag1", "tag2"],
    "application": "rw"
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

This endpoint allows you to add more tags to an existing vocabulary for a dataset. The dataset is identified by the id provided in the URL, while the specific vocabulary to update is determined by the vocabulary id in the URL and the `application` value in the POST body - if no matching vocabulary is found, a new one is created. The body should also contain an array of `tags` which will be appended to the target vocabulary. The endpoint validates and requires that a dataset with the provided id exists. Any tags that exist both in the request and in the vocabulary prior to the concat are merged - the resulting tags list won't have duplicated values.

Should the request be successful, the response will have a complete list of vocabularies/tags for the dataset, for all applications.

#### Errors for concatenating tags to a dataset vocabulary

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | - tags: tags can not be empty. -  | `tags` body fields is empty
400            | - tags: tags check failed. -  | Either the `tags` or `applications` body fields are missing or have an invalid value.
401 | Unauthorized | You are not authenticated.
403 | Forbidden | You are trying to concatenate a vocabulary for a dataset whose `application` value is not associated with your user account.
404 | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]} | The dataset specified in the request URL doesn't exist.

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

The URL should include the id of the source dataset, while the POST body should include a `newDataset` field containing
the id of the target dataset. The target dataset id is not validated - the cloning will still occur even if the target
id doesn't correspond to an existing dataset.

The dataset you use as the target dataset can have existing vocabularies - the cloning operation is an additive, and
will not update nor destroy any existing vocabulary that may have already been associated with the target dataset.
However, the cloning operation will fail if it tries to overwrite a vocabulary (ie. if the target dataset already has a
vocabulary with the same name and application as one being created as part of the cloning). This failure is not atomic -
the target dataset may end up with some of the vocabularies of the source dataset. It's up to you, as the RW API user,
to both manage these collisions, and recover from them should they happen.

Assuming the cloning was successful, the response will contain a list of all vocabularies (both newly cloned and
preexisting) and their respective tags, for all applications, for the target dataset.

If you want to clone vocabularies/tags for your datasets, you must have the necessary user account permissions.
Specifically:

- the user must be logged in and belong to the same application as the source dataset
- the user must match one of the following:
    - have role `ADMIN`
    - have role `MANAGER` and be the resource's owner (through the `userId` field of the resource)

When cloning vocabularies/tags for a dataset, the source dataset id specified in the URL is validated, and the requests
fails if a dataset with the given id does not exist. When creating a vocabulary for a widget or layer, you should ensure
you specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is
a known limitation of the current implementation, and may be modified at any time, and invalid resources (those where
the layer's/widget's dataset id does not match the dataset id defined in the resource) may be purged without prior
warning.

#### Errors for cloning vocabularies/tags for a dataset

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | This relationship already exists | The target dataset already has one or more vocabularies with the same name(s) and application(s) as the source dataset.
400            | - newDataset: newDataset can not be empty. -   | The body object must have a `newDataset` key with the id of the target dataset.
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to clone vocabulary for a source dataset whose `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to clone a vocabularies for a source dataset that doesn't exist.

## Deleting vocabularies/tags for a resource

There are two types of endpoints for deleting vocabularies/tags: one allows you to delete a single vocabulary (and its
tags) for a resource, while the other supports deleting all the vocabularies/tags for a single resource. Some use cases
for these include deleting vocabularies prior to deleting the actual resource, or typical housekeeping tasks you may
want to carry out on your data.

### Deleting a single vocabulary/tags for a resource

> Deleting a single vocabulary/tag for a dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id>
```

> Deleting a single vocabulary/tag for a widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id>
```

> Deleting a single vocabulary/tag for a layer

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id>
```

> Example response

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

This set of endpoints will allow you to delete a single vocabulary and its tags, for a resource.

As a query param, you can optionally provide an `app` or `application` values, to identify the application of the
vocabulary to delete - by default, `rw` is assumed.

Assuming the operation was successful, the response will contain a list of all vocabularies and their respective tags
associated with the specified resource, for all applications - including the vocabulary that was deleted.

If you want to delete vocabularies/tags for your resources, you must have the necessary user account permissions.
Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must match one of the following:
    - have role `ADMIN`
    - have role `MANAGER` and be the resource's owner (through the `userId` field of the resource)

When deleting vocabulary/tags for a resource, the dataset id specified in the URL is validated, and the requests fail if
a dataset with the given id does not exist. When deleting a vocabulary for a widget or layer, you should ensure you
specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a
known limitation of the current implementation and may be modified at any time.

#### Errors for deleting a single vocabulary/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to delete a vocabulary for a resource whose `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.
404            | Relationship between `<vocabulary id> and dataset - `<dataset id> and dataset: `<dataset id> doesn't exist      | You are trying to delete a vocabulary that doesn't exist.

### Deleting all vocabulary/tags for a resource

> Deleting all vocabularies/tag for a dataset

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/vocabulary/<vocabulary-id>
```

> Deleting all vocabularies/tag for a widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/<widget-id>/vocabulary/<vocabulary-id>
```

> Deleting all vocabularies/tag for a layer

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/<layer-id>/vocabulary/<vocabulary-id>
```

> Example response

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

**Know issue warning** There's a known issue where you may experience
a `404 - Relationship between undefined and dataset - <dataset id> and dataset: <dataset id> doesn't exist` error when
using these endpoints. If you experience this issue, keep in mind that some vocabularies may have already been deleted,
despite the error message. Those are not recoverable. There's currently no ETA for its resolution. As a workaround, we
suggest deleting vocabularies individually.

This set of endpoints will allow you to delete all vocabularies and their tags for a resource.

Assuming the operation was successful, the response will contain a list of all vocabularies and their respective tags
associated with the specified resource, for all applications - all of which were already deleted.

If you want to delete vocabularies/tags for your resources, you must have the necessary user account permissions.
Specifically:

- the user must be logged in and belong to the same application as the resource
- the user must match one of the following:
    - have role `ADMIN`
    - have role `MANAGER` and be the resource's owner (through the `userId` field of the resource)

When deleting vocabulary/tags for a resource, the dataset id specified in the URL is validated, and the requests fail if
a dataset with the given id does not exist. When deleting vocabularies for a widget or layer, you should ensure you
specify the dataset id that matches that of the widget/layer, as that validation is not done automatically - this is a
known limitation of the current implementation and may be modified at any time.

#### Errors for deleting all vocabularies/tags for a resource

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to delete vocabularies for a resource whose `application` value is not associated with your user account.
404            | 404 - {\"errors\":[{\"status\":404,\"detail\":\"Dataset with id `<dataset id>` doesn't exist\"}]}      | You are trying to create a vocabulary for a dataset that doesn't exist.

## Getting vocabularies and tags across resources

There are several endpoints you can use to retrieve vocabularies and their details, independently from the resources to
which they are associated

### Getting all vocabularies

> Getting all vocabularies, their resources and tags

```shell
curl -X GET https://api.resourcewatch.org/v1/vocabulary
```

> Example response

```json
{
    "data": [
        {
            "id": "test1",
            "type": "vocabulary",
            "attributes": {
                "resources": [
                    {
                        "tags": [
                            "tag1",
                            "tag2"
                        ],
                        "id": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                        "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                        "type": "dataset"
                    },
                    {
                        "tags": [
                            "tag1",
                            "tag2"
                        ],
                        "id": "0002ed77-f07d-4231-b4eb-cfda77eeafe5",
                        "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                        "type": "layer"
                    },
                    {
                        "tags": [
                            "tag1",
                            "tag2"
                        ],
                        "id": "0002ed77-f07d-4231-b4eb-cfda77eeafe5",
                        "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e91",
                        "type": "layer"
                    }
                ],
                "name": "test1",
                "application": "rw"
            }
        },
        {
            "id": "forestChange",
            "type": "vocabulary",
            "attributes": {
                "resources": [],
                "name": "forestChange",
                "application": "gfw"
            }
        }
    ]
}
```

This endpoint will give you a list of vocabularies. Inside each, you'll find a list of resources, identifying the
resource id, type, associated dataset (if the resource is a dataset, the dataset id will be equal to the resource id)and
the tags that said vocabulary associates to that resource

You can optionally pass a `limit` integer value as a query parameter if you wish to limit the number of vocabularies
returned by calls to this endpoint

### Getting a single vocabulary

> Getting a single vocabulary, all its resources and tags

```shell
curl -X GET https://api.resourcewatch.org/v1/vocabulary/<vocabulary id>
```

> Example response

```json
{
    "data": [
        {
            "id": "test1",
            "type": "vocabulary",
            "attributes": {
                "resources": [
                    {
                        "tags": [
                            "tag1",
                            "tag2"
                        ],
                        "id": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                        "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                        "type": "dataset"
                    },
                    {
                        "tags": [
                            "tag1",
                            "tag2"
                        ],
                        "id": "0002ed77-f07d-4231-b4eb-cfda77eeafe5",
                        "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                        "type": "layer"
                    },
                    {
                        "tags": [
                            "tag1",
                            "tag2"
                        ],
                        "id": "0002ed77-f07d-4231-b4eb-cfda77eeafe5",
                        "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e91",
                        "type": "layer"
                    }
                ],
                "name": "test1",
                "application": "rw"
            }
        }
    ]
}
```

This endpoint will give you the details for a single vocabulary, identified by name. In it, you'll find a list of
resources, identified by the resource id, type, associated dataset (if the resource is a dataset, the dataset id will be
equal to the resource id) and the tags that said vocabulary associates to that resource.

Keep in mind that there's an implicit application filter applied to the data returned - only vocabularies and
associations for the corresponding application are returned. By default, this filter uses the `rw` value, but you can
modify it with the `application` or `app` query parameters.

### Getting tags for single vocabulary

> Getting the tags for a single vocabulary

```shell
curl -X GET https://api.resourcewatch.org/v1/vocabulary/<vocabulary id>/tags
```

> Example response

```json
{
    "data": [
        "tag11",
        "tag21",
        "tag1",
        "tag2"
    ]
}
```

This endpoint will give you a flat list of all the tags associated with the specified vocabulary.

Keep in mind that there's an implicit application filter applied to the data returned - only tags for the corresponding
application are returned. By default, this filter uses the `rw` value, but you can modify it with the `application`
or `app` query parameters.

## Getting resources by vocabulary and tag

> Getting datasets by vocabulary and tag

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/vocabulary/find
```

> Getting widgets by vocabulary and tag

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/widget/vocabulary/find
```

> Getting layers by vocabulary and tag

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/<dataset-id>/layer/vocabulary/find
```

> Example response

```json
{
    "data": [
        {
            "type": "vocabulary",
            "attributes": {
                "resources": [
                    {
                        "id": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                        "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
                        "type": "dataset"
                    },
                    {
                        "id": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e92",
                        "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e92",
                        "type": "dataset"
                    }
                ]
            }
        }
    ]
}
```

This is perhaps the most useful endpoint when it comes to data discovery - it allows you to specify a vocabulary name
and a tag or set of tags, and see resources that match that search criteria.

All three endpoints require at least one query parameter, in the format `<vocabulary-id>=<tag>`. This will return all
resources of that type, associated with a vocabulary with the name `vocabulary-id`, and having a tag with value `tag`
for that vocabulary.

You can expand these filters by specifying multiple tags for a single vocabulary, using
the `<vocabulary-id>=<tag1>,<tag2>` syntax. This type of filter will return resources that have either `tag1` or `tag2`
for vocabulary `vocabulary-id`

You can also filter by multiple vocabularies using multiple query parameters with the formats described above. The
result will contain any resource that matches either vocabulary/tags filters.

The filters described above do not take into account the `application` for which the vocabularies were defined. If you
wish to only see results matching the vocabulary of a specific application, you can pass either an `app`
or `application`
query parameter with the value of the application you wish to filter by.

#### Errors for getting resources by vocabulary and tag

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | Vocabulary and Tags are required in the queryParams   | You must specify at least one vocabulary/tag to filter by.
