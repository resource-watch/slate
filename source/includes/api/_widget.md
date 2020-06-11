# Widget

## What is a widget?

In a nutshell, a RW API widget is a toolset to help you render your data in a visually more appealing way. The [widget concept documentation](#widget) will give you a more detailed description of this, and we encourage you to read it before proceeding. We also recommend you take a look at our section about [Vega](#widget-configuration-using-vega-grammar) if you plan on reusing existing widgets or uploading widgets that are reusable by other users. The RW API does not require you to use Vega, but we highly recommend that you do, as it's the technology used by many of the widgets you'll find on the RW API.


## Getting all widgets

> Getting a list of widgets

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget"
```

> Example response:

```json
{
   "data":[
      {
         "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
         "type": "widget",
         "attributes": {
             "name": "Example Widget",
             "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
             "slug": "example-widget",
             "userId": "5820ad9469a0287982f4cd18",
             "description": null,
             "source": null,
             "sourceUrl": null,
             "authors": null,
             "application": [
                 "rw"
             ],
             "verified": false,
             "default": false,
             "protected": false,
             "defaultEditableWidget": false,
             "published": true,
             "freeze": false,
             "env": "production",
             "queryUrl": null,
             "widgetConfig": "{}",
             "template": false,
             "layerId": null,
             "createdAt": "2017-02-08T15:30:34.505Z",
             "updatedAt": "2017-02-08T15:30:34.505Z"
         }
      },
      {...}
   ],
   "links":{
      "first":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=1",
      "prev":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=1",
      "next":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=2&page%5Bsize%5D=10",
      "last":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=64&page%5Bsize%5D=10",
      "self":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=1&page%5Bsize%5D=10"
   },
   "meta": {
      "total-pages": 38,
      "total-items": 372,
      "size": 10
   }
}
```

This endpoint allows you to list existing widgets and their properties. The result is a paginated list of 10 widgets, followed by metadata on total number of widgets and pages, as well as useful pagination links. By default, only widgets with `env` value `production` are displayed. In the sections below, we’ll explore how you can customize this endpoint call to match your needs.


### Getting all widgets for a dataset

> Return the widgets associated with a dataset


```shell
curl -X GET "https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget"
```

> Example response:

```json
{
    "data": [
        {
            "id": "73f00267-fe34-42aa-a611-13b102f38d75",
            "type": "widget",
            "attributes": {
                "name": "Precipitation Change in Puget Sound",
                "dataset": "06c44f9a-aae7-401e-874c-de13b7764959",
                "slug": "precipitation-change",
                "userId": "58333dcfd9f39b189ca44c75",
                "description": "NOAA nCLIMDIV Precipitation: Historical Precipitation",
                "source": null,
                "sourceUrl": null,
                "authors": null,
                "application": [
                    "prep"
                ],
                "verified": false,
                "default": true,
                "protected": false,
                "defaultEditableWidget": false,
                "published": true,
                "freeze": false,
                "env": "production",
                "queryUrl": "query/06c44f9a-aae7-401e-874c-de13b7764959?sql=select annual as x, year as y from index_06c44f9aaae7401e874cde13b7764959%20order%20by%20year%20asc",
                "widgetConfig": {...},
                "template": false,
                "layerId": null,
                "createdAt": "2016-08-03T16:17:06.863Z",
                "updatedAt": "2017-03-21T16:07:57.631Z"
            }
        },
        {...}
    ],
    "links": {
        "self": "http://api.resourcewatch.org/v1/dataset/06c44f9a-aae7-401e-874c-de13b7764959/widget?page[number]=1&page[size]=10",
        "first": "http://api.resourcewatch.org/v1/dataset/06c44f9a-aae7-401e-874c-de13b7764959/widget?page[number]=1&page[size]=10",
        "last": "http://api.resourcewatch.org/v1/dataset/06c44f9a-aae7-401e-874c-de13b7764959/widget?page[number]=2&page[size]=10",
        "prev": "http://api.resourcewatch.org/v1/dataset/06c44f9a-aae7-401e-874c-de13b7764959/widget?page[number]=1&page[size]=10",
        "next": "http://api.resourcewatch.org/v1/dataset/06c44f9a-aae7-401e-874c-de13b7764959/widget?page[number]=2&page[size]=10"
    },
    "meta": {
        "total-pages": 2,
        "total-items": 18,
        "size": 10
    }
}
```

When handling widgets, it's common to want to limit results to those widgets associated with a given dataset. Besides the [filters](#filters135) covered below, there's an additional convenience endpoint to get the widgets associated with a dataset, as shown in this example. 

### Getting all widgets for multiple datasets

> Return all widgets associated with two datasets

```shell
curl -X POST "https://api.resourcewatch.org/widget/find-by-ids" \
-H "Authorization: Bearer <your-token>" \
-H 'Content-Type: application/json' \
-d '{
	"ids": ["<dataset 1 id>", "<dataset 2 id>"]
}'
```

> Example response:

```json
{
    "data": [
        {
            "id": "73f00267-fe34-42aa-a611-13b102f38d75",
            "type": "widget",
            "attributes": {
                "name": "Precipitation Change in Puget Sound",
                "dataset": "06c44f9a-aae7-401e-874c-de13b7764959",
                "slug": "precipitation-change",
                "userId": "58333dcfd9f39b189ca44c75",
                "description": "NOAA nCLIMDIV Precipitation: Historical Precipitation",
                "source": null,
                "sourceUrl": null,
                "authors": null,
                "application": [
                    "prep"
                ],
                "verified": false,
                "default": true,
                "protected": false,
                "defaultEditableWidget": false,
                "published": true,
                "freeze": false,
                "env": "production",
                "queryUrl": "query/06c44f9a-aae7-401e-874c-de13b7764959?sql=select annual as x, year as y from index_06c44f9aaae7401e874cde13b7764959%20order%20by%20year%20asc",
                "widgetConfig": {...}
            }
        },
        {...}
    ]
}
```

This endpoint allows authenticated users to load all widgets belonging to multiple datasets in a single request. 

> Return all widgets associated with two datasets, that are associated with either `rw` or `prep` applications 

```shell
curl -X POST "https://api.resourcewatch.org/widget/find-by-ids" \
-H "Authorization: Bearer <your-token>" \
-H 'Content-Type: application/json' \
-d '{
	"ids": ["<dataset 1 id>", "<dataset 2 id>"],
    "app" "rw,prep"
}'
```

> Return all widgets associated with two datasets, that are associated with both `rw` and `prep` applications simultaneously 

```shell
curl -X POST "https://api.resourcewatch.org/widget/find-by-ids" \
-H "Authorization: Bearer <your-token>" \
-H 'Content-Type: application/json' \
-d '{
	"ids": ["<dataset 1 id>", "<dataset 2 id>"],
    "app" "rw@prep"
}'
```

Besides the required `ids` array, your request body may optionally include a `app` string value if you'd like to filter the returned widgets by their `application`:

- Use a single value, like `rw`, if you want to show only widgets that have `rw` as one of their applications. 
- Use a comma separated list, like `rw,prep`, if you want to show only widgets that have `rw` or `prep` as one of their applications.
- Use a @ separated list, like `rw@prep`, if you want to show only widgets that have both `rw` and `prep` as their applications.
- None of the filters require exact matching - a widget that simultaneously contain the applications `rw`, `prep` and `gfw` would match all 3 filters above.

Please note that, unlike [getting all widgets](#getting-all-widgets) or [getting all widgets for a dataset](#getting-all-widgets-for-a-dataset), this endpoint does not come with paginated results, nor does it support [pagination](#pagination134), [filtering](#filters135) or [sorting](#sorting136) or [including related entities](#include-related-entities137) described in their respective sections.


### Pagination

By default, widgets are listed in pages of 10 widgets each, and the first page is loaded. However, you can customize this behavior using the following query parameters:  

> Custom pagination: load page 2 using 25 results per page

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?page[number]=2&page[size]=25"
```

Field        |         Description          |   Type |   Default
------------ | :--------------------------: | -----: | ----------:
page[size]   | The number elements per page. Values above 100 are not officially supported. | Number | 10
page[number] |       The page number        | Number | 1

### Filters

> Return the widgets filtered by those whose name contains emissions

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?name=emissions"
```

> Return the widgets filtered by dataset

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?dataset=11de2bc1-368b-42ed-a207-aaff8ece752b"
curl -X GET "https://api.resourcewatch.org/v1/dataset/11de2bc1-368b-42ed-a207-aaff8ece752b/widget"
```

> Filter widgets by default value

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?default=false"
```

> Filter widgets by environment


```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?env=staging"
```

> Return the widgets filtered by those whose applications contain both `rw` and `prep` applications simultaneously

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?app=rw@prep"
```

The widget list endpoints provide a wide range of filters that you can use to tailor your widget listing. The great majority of the widget fields you'll find on the [widget reference](#widget-reference) section can be used as filters when listing widgets, with the following exceptions:

- `id`
- `userName`
- `userRole`: filtering by the role of the owning user can be done using the `user.role` query argument.

Additionally, you can use the following filters:

- `collection`: filters by a [collection](#collections) id. Requires being authenticated.
- `favourite`: if defined, only the widgets set by the user as [favorites](#favorites) will be returned. Requires being authenticated.

Multiple parameters can be combined into a complex `and` logic filter. Depending on the type of the field you're filtering by, the following behavior is available:

- String type fields support both regular expressions and partial matches.
- Array type fields support `,` as `OR` and `@` as `AND` separators for multiple values.
- Object type fields will match the whole object, not just its parts.

### Sorting

The API currently supports sorting by means of the `sort` parameter. Sorting can be done using any field from the widget, as well as `user.name` and `user.role` (sorting by user data is restricted to `ADMIN` users).

Sorting by nested fields is not supported at the moment.

> Sorting widgets

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?sort=name"
```

Multiple sorting criteria can be used, separating them by commas.


> Sorting widgets by multiple criteria

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?sort=name,slug"
```

You can specify the sorting order by prepending the criteria with either `-` or `+`. By default, `asc` order is assumed.

> Explicit order of sorting

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?sort=-name,+slug"
```

> Sorting widgets by the role of the user who owns the widget

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?sort=user.role"
```

### Include related entities

When loading widget data, you can optionally pass an `includes` query argument to load additional data.

#### Vocabulary

Loads related vocabularies. If none are found, an empty array is returned.

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?includes=vocabulary"
```

> Example response:

```json
{
    "data": [
        {
            "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
            "type": "widget",
            "attributes": {
                "name": "Example widget",
                "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
                "slug": "example-widget",
                "userId": "5820ad9469a0287982f4cd18",
                "description": null,
                "source": null,
                "sourceUrl": null,
                "authors": null,
                "application": [
                    "rw"
                ],
                "verified": false,
                "default": false,
                "protected": false,
                "defaultEditableWidget": false,
                "published": true,
                "freeze": false,
                "env": "production",
                "queryUrl": null,
                "widgetConfig": "{}",
                "template": false,
                "layerId": null,
                "createdAt": "2017-02-08T15:30:34.505Z",
                "updatedAt": "2017-02-08T15:30:34.505Z",
                "vocabulary": [
                    {
                        "id": "resourcewatch",
                        "type": "vocabulary",
                        "attributes": {
                            "tags": [
                                "inuncoast",
                                "rp0002",
                                "historical",
                                "nosub"
                            ],
                            "name": "resourcewatch",
                            "application": "rw"
                        }
                    }
                ]
            }
        }
    ]
}
```

#### User

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?includes=user"
```

> Example response:

```json
{
    "data": [{
        "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
        "type": "widget",
        "attributes": {
            "name": "Example widget",
            "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
            "slug": "example-widget",
            "userId": "5820ad9469a0287982f4cd18",
            "description": null,
            "source": null,
            "sourceUrl": null,
            "authors": null,
            "application": [
                "rw"
            ],
            "verified": false,
            "default": false,
            "protected": false,
            "defaultEditableWidget": false,
            "published": true,
            "freeze": false,
            "env": "production",
            "queryUrl": null,
            "widgetConfig": "{}",
            "template": false,
            "layerId": null,
            "createdAt": "2017-02-08T15:30:34.505Z",
            "updatedAt": "2017-02-08T15:30:34.505Z",
            "user": {
              "name": "John Sample",
              "email": "john.sample@vizzuality.com"
            }
        }
    }]
}
```

Loads the name and email address of the author of the widget. If the user issuing the request has role `ADMIN`, the response will also display the role of the widget's author. If the data is not available (for example, the user has since been deleted), no `user` property will be added to the widget object.


#### Metadata

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?includes=metadata"
```

> Example response:

```json
{
    "data": [
        {
            "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
            "type": "widget",
            "attributes": {
                "name": "Example widget",
                "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
                "slug": "example-widget",
                "userId": "5820ad9469a0287982f4cd18",
                "description": null,
                "source": null,
                "sourceUrl": null,
                "authors": null,
                "application": [
                    "rw"
                ],
                "verified": false,
                "default": false,
                "protected": false,
                "defaultEditableWidget": false,
                "published": true,
                "freeze": false,
                "env": "production",
                "queryUrl": null,
                "widgetConfig": "{}",
                "template": false,
                "layerId": null,
                "createdAt": "2017-02-08T15:30:34.505Z",
                "updatedAt": "2017-02-08T15:30:34.505Z",
                "metadata": [
                    {
                        "id": "5aeb1c74a096b50010f3843f",
                        "type": "metadata",
                        "attributes": {
                            "dataset": "86777822-d995-49cd-b9c3-d4ea4f82c0a3",
                            "application": "rw",
                            "resource": {
                                "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
                                "type": "widget"
                            },
                            "language": "en",
                            "info": {
                                "caption": "t",
                                "widgetLinks": []
                            },
                            "createdAt": "2018-05-03T14:28:04.482Z",
                            "updatedAt": "2018-06-07T11:30:40.054Z",
                            "status": "published"
                        }
                    }
                ]
            }
        }
    ]
}
```

Loads the metadata available for the widget. If none are found, an empty array is returned.


#### Requesting multiple additional entities

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget?includes=metadata,user,vocabulary"
```

You can request multiple related entities in a single request using commas to separate multiple keywords


## Getting a widget by id

> Getting a widget by id:

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget/<widget_id>"
curl -X GET "https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget/<widget_id>"
```

> Example response:

```json
{
    "data": {
        "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
        "type": "widget",
        "attributes": {
            "name": "Example widget",
            "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
            "slug": "example-widget",
            "userId": "5820ad9469a0287982f4cd18",
            "description": null,
            "source": null,
            "sourceUrl": null,
            "authors": null,
            "application": [
                "rw"
            ],
            "verified": false,
            "default": false,
            "protected": false,
            "defaultEditableWidget": false,
            "published": true,
            "freeze": false,
            "env": "production",
            "queryUrl": null,
            "widgetConfig": "{}",
            "template": false,
            "layerId": null,
            "createdAt": "2017-02-08T15:30:34.505Z",
            "updatedAt": "2017-02-08T15:30:34.505Z"
        }
    }
}
```

If you know the `id` of a widget, then you can access it directly. Ids are case-sensitive.


### Overwrite the query url of a widget response

> Getting a widget by id with a custom query url value:

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget/<widget_id>?queryUrl=/v1/query?sql=Select%20*%20from%20data"
```

> Example response:

```json
{
    "data": {
        "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
        "type": "widget",
        "attributes": {
            "name": "Example widget",
            "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
            "slug": "example-widget",
            "userId": "5820ad9469a0287982f4cd18",
            "description": null,
            "source": null,
            "sourceUrl": null,
            "authors": null,
            "application": [
                "rw"
            ],
            "verified": false,
            "default": false,
            "protected": false,
            "defaultEditableWidget": false,
            "published": true,
            "freeze": false,
            "env": "production",
            "queryUrl": "/v1/query?sql=Select * from data",
            "widgetConfig": {
                "data": {
                    "url": "/v1/query?sql=Select * from data"
                }
            },
            "template": false,
            "layerId": null,
            "createdAt": "2017-02-08T15:30:34.505Z",
            "updatedAt": "2017-02-08T15:30:34.505Z"
        }
    }
}
```

When getting a single widget, you can optionally provide a `queryUrl` query parameter. If provided, this parameter will overwrite the following response values:

- `data.attributes.queryUrl`
- `data.attributes.widgetConfig.data.url`
- `data.attributes.widgetConfig.data[0].url`
 
This overwrite will only happen if a previous value already existed for the respective field. Also, keep in mind that these changes will NOT be persisted to the database, and will only affect the current request's response. 
 
### Customize the query url of a widget response

> Getting a widget by id with a custom query url parameters:

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget/<widget_id>?geostore=ungeostore"
```

> Example response:

```json
{
    "data": {
        "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
        "type": "widget",
        "attributes": {
            "name": "Example widget",
            "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
            "slug": "example-widget",
            "userId": "5820ad9469a0287982f4cd18",
            "description": null,
            "source": null,
            "sourceUrl": null,
            "authors": null,
            "application": [
                "rw"
            ],
            "verified": false,
            "default": false,
            "protected": false,
            "defaultEditableWidget": false,
            "published": true,
            "freeze": false,
            "env": "production",
            "queryUrl": "<previous queryUrl value>?geostore=ungeostore",
            "widgetConfig": {
                "data": {
                    "url": "<previous widgetConfig.data.url value>?geostore=ungeostore"
                }
            },
            "template": false,
            "layerId": null,
            "createdAt": "2017-02-08T15:30:34.505Z",
            "updatedAt": "2017-02-08T15:30:34.505Z"
        }
    }
}
```


> Getting a widget by id with a custom query url value parameters:

```shell
curl -X GET "https://api.resourcewatch.org/v1/widget/<widget_id>?queryUrl=/v1/query?sql=Select%20*%20from%20data&geostore=ungeostore"
```

> Example response:


```json
{
    "data": {
        "id": "51851e22-1eda-4bf5-bbcc-cde3f9a3a943",
        "type": "widget",
        "attributes": {
            "name": "Example widget",
            "dataset": "be76f130-ed4e-4972-827d-aef8e0dc6b18",
            "slug": "example-widget",
            "userId": "5820ad9469a0287982f4cd18",
            "description": null,
            "source": null,
            "sourceUrl": null,
            "authors": null,
            "application": [
                "rw"
            ],
            "verified": false,
            "default": false,
            "protected": false,
            "defaultEditableWidget": false,
            "published": true,
            "freeze": false,
            "env": "production",
            "queryUrl": "/v1/query?sql=Select * from data&geostore=ungeostore",
            "widgetConfig": {
                "data": {
                    "url": "/v1/query?sql=Select * from data&geostore=ungeostore"
                }
            },
            "template": false,
            "layerId": null,
            "createdAt": "2017-02-08T15:30:34.505Z",
            "updatedAt": "2017-02-08T15:30:34.505Z"
        }
    }
}
```

When getting a single widget, you can optionally provide additional custom query parameter. These parameters will be appended to the following response values:

- `data.attributes.queryUrl`
- `data.attributes.widgetConfig.data.url`
- `data.attributes.widgetConfig.data[0].url`

The widget service assumes these values are URLs, and will append your custom query parameters as such:

- If the value already has a `?` character present, your custom query parameters will be appended with `&` preceding them. 
- If no `?` is present, the first custom query parameter will be appended with a `?`, and the following with a `&` before them.

This overwrite will only happen if a previous value already existed for the respective field. Also, keep in mind that these changes will NOT be persisted to the database, and will only affect the current request's response. You can combine these custom query parameters with an [overwritten query url](#overwrite-the-query-url-of-a-widget-response), as seen on the included example.


### Include related entities

You can load related `user`, `vocabulary` and `metadata` data in the same request. See [this section](#include-related-entities137) for more details.


## Creating a widget

> To create a widget, you need to provide at least the following details:

```shell
curl -X POST "https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "application":[
      "gfw"
    ],
    "name":"Example Widget"
  }'


curl -X POST "https://api.resourcewatch.org/v1/widget" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "application":[
      "gfw"
    ],
    "name":"Example Widget",
    "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90"    
  }'
```

> Response

```json
{
    "data": {
        "id": "7946bca1-6c2a-4329-a127-558ef9551eba",
        "type": "widget",
        "attributes": {
            "name": "Example Widget",
            "dataset": "7fa6ec77-5ab0-43f4-9a4c-a3d19bed1e90",
            "slug": "Example-Widget_2",
            "userId": "5dbadb0adf2dc74d2ad05dfb",
            "application": [
                "gfw"
            ],
            "verified": false,
            "default": false,
            "protected": false,
            "defaultEditableWidget": false,
            "published": true,
            "freeze": false,
            "env": "production",
            "template": false,
            "createdAt": "2020-06-11T14:13:19.677Z",
            "updatedAt": "2020-06-11T14:13:19.677Z"
        }
    }
}
```
In this section we'll guide you through the process of creating a widget in the RW API. Widget creation is available to all registered API users, and will allow you to store your own widget visualisation settings on the API, for reusing and sharing.

Before creating a widget, there are a few things you must know and do:

- In order to be able to create a widget, you need to be [authenticated](#authentication).
- Depending on your user account's role, you may have permission to create a widget but not delete it afterwards.
- The widgets you create on the RW API will be publicly visible and available to other users.

Creating a widget is done using a POST request and passing the relevant data as body files. The supported body fields are as defined on the [widget reference](#widget-reference) section, but the minimum field list you must specify for all widgets is:

- name
- application
- dataset - which can be specified either through the URL or the POST body.

The widget service was built to be very flexible, and not be restricted to specific widget rendering libraries or tools. While we recommend using [Vega](#widget-configuration-using-vega-grammar), it's up to you to decide which library to use, and how to save your custom data within a widget's `widgetConfig` field. While there is no hard limit on this, widgets that rely on excessively large `widgetConfig` objects have been known to cause issues, so we recommend being mindful of this.


#### Widget thumbnails

> Preview of the thumbnail of a widget

```shell
curl -X GET "https://resourcewatch.org/embed/widget/<widget_id>"
```

When a widget is created or updated, the RW API will automatically try to generate a thumbnail preview of it. This is done using the renderer that's part of the [Resource Watch](https://resourcewatch.org) website, and will only produce a thumbnail if your widget uses the same approach as the RW website for declaring its widgets. Searching for widgets belonging to the `rw` application will give you an idea of how this is achieved.

The thumbnail process is asynchronous, meaning it may take up to one minute for your newly created or updated widget to have a valid and/or up to date `thumbnailUrl` value. If the thumbnail generation process fails (for example, if you decide to use a different rendering tool and data structure), the thumbnail generation will fail silently, but will not affect the actual widget creation or update process.


#### Errors for creating a widget

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | `<field>`: `<field>` can not be empty | Your are missing a required field value.
400            | - `<field>`: must be a `<restriction>` | The value provided for the mentioned field does not match the requirements.
401            | Unauthorized   | You are not authenticated.
403            | Forbidden      | You are trying to create a widget with one or more `application` values that are not associated with your user account. 
404            | Dataset not found | The provided dataset id does not exist. 


## Updating a widget


To update a widget, you need to define all of the required fields in the request body. The fields that compose a widget are:

Field        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
name         |           Name of the widget            |    Text |                                        Any Text |      Yes
description  |       Description of the dataset        |    Text |                                        Any text |       No
source       |     Publisher of the original code      |    Text |                                        Any text |       No
sourceUrl    |         Link to publisher page          |    Text |                                         Any url |       No
application  | Application to which the widget belongs |   Array | gfw, forest-atlas, rw, prep, aqueduct, data4sdg |      Yes
authors      |           Name of the authors           |    Text |                                        Any text |       No
queryUrl     |  Url with the data of the chart shows   |    Text |                                 Any valid query |       No
widgetConfig |           Vega configuration            |  Object |                                    Valid object |       No
published    |        If it's available to use         | Boolean |                                    true - false |       No
freeze       |        If the data is frozen            | Boolean |                                    true - false |       No
verified     |     If it's verified by other user      | Boolean |                                    true - false |       No
template     |           If it's a template            | Boolean |                                    true - false |       No
default      |       If it's default for dataset       | Boolean |                                    true - false |       No
layerId      |   UuId of the relationship with layer   |    Text |                                   Uuid of layer |       No
dataset      |           UuId of the dataset           |    Text |                                 Uuid of Dataset |       No
env          |               Environment               |    Text |                 `production` or `preproduction` |      Yes


A user with role `USER` can update their own widgets, based on the `userId` field. A user with `ADMIN` role can update any widget.

> To update a widget, you have to do a PATCH request with the following body:

```shell
curl -X PATCH "https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget/<widget_id>" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "widget": {
      "application":[
         "your", "apps"
      ],
      "name":"New Example Widget Name",
      "widgetConfig": {}
   }
}'
```

<aside class="notice">
Updating a widget will cause a thumbnail to be generated in the background for the new widget. As it is generated asyncronously, the newly generated thumbnail url may only become available on subsequent requests.
</aside>


## Cloning a widget

You can clone an existing widget as long as you have permissions to the applications associated with it. Basic usage requires no body params, but you can optionally pass a new `name` or `description` to be used in the creation of the new widget.


> To clone a widget, you should use one of the following POST requests:

```shell
curl -X POST "https://api.resourcewatch.org/v1/widget/<widget_id>/clone" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

```shell
curl -X POST "https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget/<widget_id>/clone" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```

> You can optionally set a new name or description:


```shell
curl -X POST "https://api.resourcewatch.org/v1/widget/<widget_id>/clone" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "name for the cloned widget",
   "description": "
   "name": "name for the cloned widget", for the cloned widget",
}'
```

```shell
curl -X POST "https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget/<widget_id>/clone" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "name for the cloned widget",
   "description": "
   "name": "name for the cloned widget", for the cloned widget",
}'
```

### Cloning widgets from other microservices

When cloning a widget, the newly created clone will take the `userId` of the originating request. If you call this endpoint as an authenticated user from your custom application, that means it will get that authenticated user's `userId`. However, if invoked from another API microservice, that `userId` is no longer available. In this scenario, when the request to clone is originated internally, you can optionally pass a `userÌd` body value that will be set as the `userId` of the newly created widget.

<aside class="warning">
User IDs provided this way are not validated.
</aside>

```shell
curl -X POST "https://api.resourcewatch.org/v1/widget/<widget_id>/clone" \
-H "Authorization: Bearer <microservice-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "userId": "123456789",
}'
```

<aside class="notice">
Cloning a widget will cause a thumbnail to be generated in the background for the new widget. As it is generated asyncronously, the newly generated thumbnail url may only become available on subsequent requests.
</aside>


## Deleting a widget

Who can delete Widgets?

- Users with the `MANAGER` role who are in the same app as the widget and are in the widget's `userId`
- Users with the `ADMIN` role who are in the same app as the widget.

<aside class="notice">
   The endpoints `/widget/:widget` and `/dataset/:dataset/widget/:widget` perform the same action, with the only difference being that the latter checks if the dataset exists before deleting the widget.
</aside>

```shell
curl -X DELETE "https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget/<widget_id>" \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```


## Widget reference

This section gives you a complete view at the properties that are maintained as part of widget. When interacting with a widget (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/resource-watch/widget/blob/master/app/src/models/widget.model.js).

Field name              | Type           | Required             | Default value              | Description                                                                  
----------------------- | -------------- | -------------------- |----------------------------| ---------------------------------------------------------------------------- 
id                      | String         | Yes (autogenerated)  |                            | Unique Id of the widget. Auto generated on creation. Cannot be modified by users.
dataset                 | String         | Yes                  |                            | Id of the dataset to which the widget corresponds. Set on widget creation, cannot be modified.   
name                    | String         | Yes                  |                            | Name of the widget.                                                         
slug                    | String         | Yes (autogenerated)  |                            | Slug of the widget. Auto generated on creation. Cannot be modified by users.        
userId                  | String         | Yes (autopopulated)  |                            | Id of the user who created the widget. Set automatically on creation. Cannot be modified by users.
description             | String         | No                   |                            | User defined description of the widget.
source                  | String         | No                   |                            | Description of the source of the widget's data, as it's meant to be displayed to the end user.
sourceUrl               | String         | No                   |                            | URL of the source of the data, as it's meant to be displayed to the end user.
authors                 | String         | No                   |                            | Author or authors of the data displayed on the widget, as it's meant to be displayed to the end user.
queryUrl                | String         | No                   |                            | URL of the RW API query or external URL containing the data displayed on the widget
thumbnailUrl            | String         | No                   |                            | URL of a example thumbnail of the rendered widget.
env                     | String         | Yes                  | production                 | Environment to which the widget belongs.
widgetConfig            | Object         | No                   |                            | Open schema object meant to host widget behavior configuration.
application             | Array          | Yes                  |                            | Applications associated with this widget.
layerId                 | String         | No                   |                            | Id of the layer to which the widget corresponds.  
verified                | Boolean        | Yes                  | false                      | 
default                 | Boolean        | No                   | false                      | If the widget should be used as the dataset's default widget.
protected               | Boolean        | Yes                  | false                      | If the widget is protected. A protected widget cannot be deleted.               
defaultEditableWidget   | Boolean        | Yes                  | false                      | Used by the RW frontend to determine if a widget is the default widget displayed on the Explore detail page for a given dataset.
template                | Boolean        | Yes                  | false                      | If true, this widget is not necessarily meant to be rendered as-is, but rather as a template for other widgets to be generated from.
published               | Boolean        | Yes                  | true                       | If the widget is published or not.
freeze                  | Boolean        | Yes                  | false                      | If true, the widget is meant to represent data from a specific snapshot taken at a given moment in time, as opposed to using a potentially mutable dataset. This data capturing functionality must be implemented by consuming applications, as this value has no logic associated with it on the API side.
userName                | String         | No (autogenerated)   | null                       | Name of the user who created the widget. This value is used only internally, and is never directly exposed through the API. Cannot be modified by users.        
userRole                | String         | No (autogenerated)   | null                       | Role of the user who created the widget. This value is used only internally, and is never directly exposed through the API. Cannot be modified by users. 
createdAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the widget was created. Cannot be modified by users.                     
updatedAt               | Date           | No (autogenerated)   | <current date>             | Automatically maintained date of when the widget was last updated. Cannot be modified by users.                
