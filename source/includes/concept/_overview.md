# RW API Overview

Welcome to the Resource Watch API Documentation. In the sections below, you'll find all the information you need to get started using the RW API.

## About these docs

This documentation page aims to cover the Resource Watch API functionality and details. In it, you'll find a top-level description of the services it provides, as well as a breakdown of the different endpoints, their functionality, parameters and output. The goal is to give you the tools to create powerful applications and data products.

The RW API is [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) and [JSON](https://en.wikipedia.org/wiki/JSON) based, and these docs assume you are familiar with both technologies. Besides endpoint descriptions, the documentation will include example code snippets that use [cURL](https://en.wikipedia.org/wiki/CURL) to illustrate how you would use each endpoint. Knowing the basics of cURL will help you better understand those examples. 

For readability, URLs and query parameters may be displayed without escaping/encoding, but be sure to encode your URLs before issuing a request to the API, or it may produce undesired results. If you are using the RW API to build your own application, there's probably a library out there that does this for you automatically.

In these examples, you'll also find references to a `Authorization: Bearer <your-token>` HTTP header. You can find more details about tokens in the [authentication](#authentication) section, which you should read before you get started.   

Last but not least, the RW API and its docs are made by humans, who will occasionally make mistakes. If you find something that you think is incorrect, could be improved, if you want to contribute yourself, or just want to say "thank you", you can reach us through [the RW API documentation Github project page](https://github.com/resource-watch/doc-api).


## Before you get started

This section covers a list of topics you should be familiar with before using the API. The concepts described in this section span across multiple API endpoints and are fundamental for a better understanding of how to interact with the RW API.

### Applications

As you might come across while reading these docs, different applications and websites rely on the RW API as the principal source for their data. While navigating through the catalog of available datasets, you will find some datasets used by the [Resource Watch website](https://resourcewatch.org/), others used by [Global Forest Watch](https://www.globalforestwatch.org/). In many cases, applications even share the same datasets!

To ensure the correct separation of content across the different applications that use the RW API, you will come across a field named `application` in many of the API's resources (such as datasets, layers, widgets, and others). Using this field, the RW API allows users to namespace every single resource, so that it's associated only with the applications that use it.

#### Existing applications

Currently, the following applications are using the API as the principal source for their data:

* the [Resource Watch website](https://resourcewatch.org/), where the `application` field takes the value `rw`;
* the [Global Forest Watch website](https://www.globalforestwatch.org/), where the `application` field takes the value `gfw`;
* the [Partnership for Resilience and Preparedness website](https://prepdata.org/), where the `application` field takes the value `prep`;
* the [Forest Atlases websites](https://www.wri.org/our-work/project/forest-atlases) for different countries of the world also rely on the RW API - in the case of these websites, the `application` field takes the value `forest-atlas`;
* the [Forest Watcher mobile application](https://forestwatcher.globalforestwatch.org/), where the `application` field takes the value `fw`;

If you would like to see your application added to the list of applications supported by the RW API, please contact us.

#### Best practices for the application field

> Fetching datasets for the Resource Watch application

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?application=rw
```

> Fetching datasets for the Global Forest Watch application

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?application=gfw
```

This section describes some best practices when using the `application` field. Please keep in mind that, since it is up to each RW API service to implement how this field is used, there might be some differences in the usage of this field between RW API services. Refer to each RW API resource or endpoint's documentation for more details on each specific case.

As a rule of thumb, the `application` field is an array of strings, required when creating an RW API resource that uses it. You can edit the `application` values by editing the RW API resource you are managing. You can then use the `application` field as a query parameter filter to filter content specific to the given application (check some examples of the usage of the `application` field when fetching RW API datasets on the side).

[RW API users](/index-rw.html#user-management) also use the `application` field and can be associated with multiple applications. In this case, the `application` field is used to determine which applications a user manages (access management). As you'll be able to understand from reading [General notes on RW API users](#general-notes-on-rw-api-users), each user's `application` values are used to determine if a given user can administrate an RW API resource. Typically, to manipulate said RW API resource, that resource, and the user account, must have at least one overlapping value in the `application` field.

#### Which services comply with these guidelines

Below you can find a list of RW API resources that use the `application` field:

* [Areas v1](/index-rw.html#areas)
* [Areas v2](/index-rw.html#areas-v2)
* [Collections](/index-rw.html#collections)
* [Dashboards](/index-rw.html#dashboard)
* [Dataset](/index-rw.html#dataset6)
* [Graph](/index-rw.html#graph)
* [Layer](/index-rw.html#layer8)
* [Metadata](/index-rw.html#metadata14)
* [Subscriptions](/index-rw.html#subscriptions)
* [Topics](/index-rw.html#topic)
* [Users](/index-rw.html#user-management)
* [Vocabulary](/index-rw.html#vocabulary-and-tags)
* [Widgets](/index-rw.html#widget9)

### Environments

Certain RW API resources, like datasets, layers, or widgets, use the concept of `environment` (also called `env`) as a way to help you manage your data's lifecycle. The main goal of `environments` is to give you an easy way to separate data that is ready to be used in production-grade interactions from data that is still being improved on.

When you create a new resource, like a dataset, it's given the `production` env value by default. Similarly, if you list datasets, there's an implicit default filter that only returns datasets whose `env` value is `production`. This illustrates two key concepts of `environments`:

- By default, when you create data on the RW API, it assumes it's in a production-ready state.
- By default, when you list resources from the RW API, it assumes you want only to see production-ready data.

However, you may want to modify this behavior. For example, let's say you want to create a new widget on the RW API and experiment with different configuration options without displaying it publicly. To achieve this, you can set a different `environment` on your widget - for example, `test`. Or you may want to deploy a staging version of your application that also relies on the same RW API but displays a different set of resources. You can set those resources to use the `staging` environment and have your application load only that environment, or load both `production` and `staging` resources simultaneously. Keep in mind that `production` is the only "special" value for the `environment` field. Apart from it, the `environment` can take any value you want, without having any undesired side-effects.

Resources that use `environment` can also be updated with a new `environment` value, so you can use it to control how your data is displayed. Refer to the documentation of each resource to learn how you can achieve this.

It's worth pointing out that endpoints that retrieve a resource by id typically don't filter by `environment` - mostly only listing endpoints have different behavior depending on the requested `environment` value. Also worth noting is that this behavior may differ from resource to resource, and you should always refer to each endpoint's documentation for more details.

#### Which services comply with these guidelines

* [Dataset](/index-rw.html#dataset6)
* [Graph](/index-rw.html#graph)
* [Layer](/index-rw.html#layer8)
* [Subscriptions](/index-rw.html#subscriptions)
* [Widgets](/index-rw.html#widget9)

### User roles

RW API users have a role associated with it, defined in the `role` field of each user. You can check your own role by consulting your user information using the [`GET /users/me` endpoint](/index-rw.html#get-the-current-user) or getting a JWT token and decoding its information. The `role` of the user is defined as a string, and it can take one of the following values:

* `USER`
* `MANAGER`
* `ADMIN`

#### Role-based access control

> Typical hierarchy for roles:

```
USER (least privileges) < MANAGER < ADMIN (most privileges)
```

The role field is usually used across the RW API for controlling access to API resources. While not required nor enforced, typically user roles are used hierarchically, being `USER` the role with the least privileges, and `ADMIN` the one with most privileges. A common pattern you’ll find on some services is: 

* `USER` accounts can read (usually all data or just data owned by the user, depending on any privacy or security concerns in the service in question), but only create new resources; 
* `MANAGER` accounts can perform all of the `USER` actions, complemented with editing or deleting resources owned by them;
* `ADMIN` accounts can do all of the above even for resources created by other users.

Role-based access control is usually conjugated with the list of applications associated with the user: typically, in order to manipulate a given resource, that resource and the user account must have at least one overlapping application value. Read more about the application field and which services use it in the [Applications concept documentation](/index-rw.html#applications).

Keep in mind that it’s up to each individual RW API service (dataset, widget, layer, etc) to define how they restrict or allow actions based on these or other factors, so the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on restrictions they may have regarding user accounts and their properties.

#### How to change the role of an user

Changing role of users is restricted to `ADMIN` users, so if you intend to upgrade your user role to a `MANAGER` or `ADMIN` role, please get in touch with one of the `ADMIN` users and request the change. If you are already an `ADMIN` user and you intend to change the role of another user, you can do so using the [`PATCH /users/:id` endpoint](/index-rw.html#update-another-user-39-s-account-details).

#### Which services comply with these guidelines

The following endpoints adhere to the user role conventions defined above:

* [Dashboards](/index-rw.html#dashboard)
* [Datasets](/index-rw.html#dataset6)
* [Layers](/index-rw.html#layer8)
* [Metadata](/index-rw.html#metadata14)
* [Widgets](/index-rw.html#widget9)

### Sorting

> Example request sorting by a single condition:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=name
```

> Example request sorting by multiple conditions:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=name,description
```

> Example request sorting by multiple conditions, descending and ascending:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-name,+description
```

As a rule of thumb, you can sort RW API resources using the `sort` query parameter. Usually, sorting can be performed using any field from the resource schema, so be sure to check each resource's model reference to find which fields can be used for sorting. Sorting by nested model fields is not generally supported, but may be implemented for particular resources. In some exceptional cases, you also have the possibility of sorting by fields that are not present in the resource model (e.g., when fetching datasets, you can sort by `user.name` and `user.role` to sort datasets by the name or role of the owner of the dataset) - be sure to check each resource's documentation to find out which additional sorting criteria you have available.

Multiple sorting criteria can be used, separating them by commas. You can also specify the sorting order by prepending the criteria with either `-` for descending order or `+` for ascending order. By default, ascending order is assumed.

Keep in mind that it’s up to each individual RW API service (dataset, widget, layer, etc) to define and implement the sorting mechanisms. Because of this, the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on sorting.

#### Which services comply with these guidelines

The following endpoints adhere to the Sorting conventions defined above:

* [Get v2 areas endpoint](/index-rw.html#getting-all-user-areas)
* [Get areas endpoint](/index-rw.html#get-user-areas)
* [Get collections endpoint](/index-rw.html#getting-collections-for-the-request-user)
* [Get dashboards endpoint](/index-rw.html#getting-all-dashboards)
* [Get datasets endpoint](/index-rw.html#getting-all-datasets)
* [Get layers endpoint](/index-rw.html#getting-all-layers)
* [Get metadata endpoint](/index-rw.html#getting-all-metadata)
* [Get widgets endpoint](/index-rw.html#getting-all-widgets)

### Filtering

> Example request filtering using a single condition:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?name=viirs
```

> Example request filtering using multiple conditions:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?name=birds&provider=cartodb
```

> Example request filtering by an array field using the `,` OR multi-value separator:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?application=rw,gfw
```

> Example request filtering by an array field using the `@` AND multi-value separator:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?application=rw@gfw
```

Like in the case of sorting, most RW API resources allow filtering the returned results of list endpoints using query parameters. As a rule of thumb, you can use the API resource's fields as query parameter filters, as shown in the examples on the side. You can also combine different query parameters into a complex `and` logic filter. Note that you can achieve a logical `or` by passing a regular expression with two disjoint options, like this: `?name=<substr_a>|<substr_b>`.

For string type fields, the filter you pass will be interpreted as a regular expression, _not_ as a simple substring filter. This gives you greater flexibility in your search capabilities. However, it means that, if you intend to search by substring, you must escape any regex special characters in the string.

Array fields (like the `application` field present in some of the API resources - read more about the [application field](/index-rw.html#applications)) support more complex types of filtering. In such cases, you can use `,` as an `or` multi-value separator, or `@` as a multi-value, exact match separator.

Object fields expect a boolean value when filtering, where `true` matches a non-empty object and `false` matches an empty object. Support for filtering by nested object fields varies for different API resource, so be sure to check the documentation of the API endpoint for more detailed information.

Again, as in the case of sorting, keep in mind that it’s up to each individual RW API service (dataset, widget, layer, etc) to define and implement the filtering mechanisms. Because of this, the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on filtering and the available fields to use as query parameter filters.

#### Which services comply with these guidelines

The following endpoints adhere to the Filtering conventions defined above:

* [Get all datasets endpoint](/index-rw.html#getting-all-datasets)
* [Get all layers endpoint](/index-rw.html#getting-all-layers)
* [Get all widgets endpoint](/index-rw.html#getting-all-widgets)
* [Get all users endpoint](/index-rw.html#getting-all-users)

### Pagination

> Example request where default pagination is applied, returning one page of 10 elements (1st - 10th elements):

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset
```

> Example request fetching the 3rd page of 10 elements (21st - 30th elements):

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?page[number]=3
```

> Example request fetching the 5th page of 20 elements (81st - 100th elements):

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?page[number]=5&page[size]=20
```

Many times, when you're calling RW API's list endpoints, there will be a lot of results to return. Without pagination, a simple search could return thousands or even millions of elements, causing extraneous network traffic. For that reason, many services list their resources as pages, to make sure that not only responses are easier to handle, but also that services are scalable.

Paged results have a built-in default limit of 10 elements, but we recommend you always explicitly set the limit parameter to ensure you know how many results per page you'll get. The pagination strategy used across the RW API relies on two query parameters:

Field          | Description                   |   Type |   Default
-------------- | ----------------------------- | -----: | ----------:
`page[size]`   | The number elements per page. | Number | 10
`page[number]` | The page number.              | Number | 1

Note that values above 100 for the `page[size]` query parameter are not officially supported. Also, pagination requires an implied ordering - by default, the item’s unique identifier is used, but you can use any other model field to sort the returned results.

Once again, keep in mind that it’s up to each individual RW API service (dataset, widget, layer, etc) to define and implement the pagination strategy. Because of this, the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on how to correctly paginate your list requests.

#### Which services comply with these guidelines

The following endpoints adhere to the Filtering conventions defined above:

* [Get all datasets endpoint](/index-rw.html#getting-all-datasets)
* [Get all layers endpoint](/index-rw.html#getting-all-layers)
* [Get all widgets endpoint](/index-rw.html#getting-all-widgets)
* [Get all users endpoint](/index-rw.html#getting-all-users)

# Concepts
