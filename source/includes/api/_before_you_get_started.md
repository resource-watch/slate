# Before you get started

This section covers a list of topics you should be familiar with before using the API. The concepts described in this section span across multiple API endpoints and are fundamental for a better understanding of how to interact with the RW API.

## Applications

As you might come across while reading these docs, different applications and websites rely on the RW API as the principal source for their data. While navigating through the catalog of available datasets, you will find some datasets used by the [Resource Watch website](https://resourcewatch.org/), others used by [Global Forest Watch](https://www.globalforestwatch.org/). In many cases, applications even share the same datasets!

To ensure the correct separation of content across the different applications that use the RW API, you will come across a field named `application` in many of the API's resources (such as datasets, layers, widgets, and others). Using this field, the RW API allows users to namespace every single resource, so that it's associated only with the applications that use it.

### Existing applications

Currently, the following applications are using the API as the principal source for their data:

* the [Resource Watch website](https://resourcewatch.org/), where the `application` field takes the value `rw`;
* the [Global Forest Watch website](https://www.globalforestwatch.org/), where the `application` field takes the value `gfw`;
* the [Partnership for Resilience and Preparedness website](https://prepdata.org/), where the `application` field takes the value `prep`;
* the [Forest Atlases websites](https://www.wri.org/our-work/project/forest-atlases) for different countries of the world also rely on the RW API - in the case of these websites, the `application` field takes the value `forest-atlas`;
* the [Forest Watcher mobile application](https://forestwatcher.globalforestwatch.org/), where the `application` field takes the value `fw`;

If you would like to see your application added to the list of applications supported by the RW API, please contact us.

### Best practices for the application field

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

## Environments

Certain RW API resources, like datasets, layers, or widgets, use the concept of `environment` (also called `env`) as a way to help you manage your data's lifecycle. The main goal of `environments` is to give you an easy way to separate data that is ready to be used in production-grade interactions from data that is still being improved on.

When you create a new resource, like a dataset, it's given the `production` env value by default. Similarly, if you list datasets, there's an implicit default filter that only returns datasets whose `env` value is `production`. This illustrates two key concepts of `environments`:

- By default, when you create data on the RW API, it assumes it's in a production-ready state.
- By default, when you list resources from the RW API, it assumes you want only to see production-ready data.

However, you may want to modify this behavior. For example, let's say you want to create a new widget on the RW API and experiment with different configuration options, without displaying it publicly. To achieve this, you can set a different `environment` on your widget - for example, `test`. Or you may want to deploy a staging version of your application, that also relies on the same RW API, but displays a different set of resources - you can set those resources to use the `staging` environment, and have your application load only that environment, or load both `production` and `staging` resources simultaneously.

Resources that use `environment` can also be updated with a new `environment` value, so you can use it to control how your data is displayed. Refer to the documentation of each resource to learn how you can achieve this.

It's worth pointing out that endpoints that retrieve a resource by id typically don't filter by `environment` - mostly only listing endpoints have different behavior depending on the requested `environment` value. Also worth noting is that this behavior may differ from resource to resource, and you should always refer to each endpoint's documentation for more details.

### Which services comply with these guidelines

* [Dataset](/index-rw.html#dataset6)
* [Graph](/index-rw.html#graph)
* [Layer](/index-rw.html#layer8)
* [Subscriptions](/index-rw.html#subscriptions)
* [Widgets](/index-rw.html#widget9)

<!-- ## Authentication

TODO

## Roles

TODO


## Caching

TODO -->
