# Before you get started

This section covers a list of topics you should be familiar with before using the API. The concepts described in this section span across multiple API endpoints and are fundamental for a better understanding of how to interact with the RW API.

## Applications

As you might have come across while reading these docs, different applications and websites rely on the RW API as the principal source for their data. While navigating through the catalog of available datasets, you will find some datasets used by the [Resource Watch website](https://resourcewatch.org/), others used by [Global Forest Watch](https://www.globalforestwatch.org/). In many cases, applications even share the same datasets!

To ensure the correct separation of content across the different applications that use the RW API, you will come across a field named `application` in many of the API's resources (such as datasets, layers, widgets, and others). Using this field, the RW API allows users to namespace every single resource, so that it's associated only with the applications that use it.

### Existing applications

Currently, the following applications are using the API as the principal source for their data:

* the [Resource Watch website](https://resourcewatch.org/), where the `application` field takes the value `rw`;
* the [Global Forest Watch website](https://www.globalforestwatch.org/), where the `application` field takes the value `gfw`;
* the [Partnership for Resilience and Preparedness website](https://prepdata.org/), where the `application` field takes the value `prep`;
* the [Forest Atlases websites](https://www.wri.org/our-work/project/forest-atlases) for different countries of the world also rely on the RW API - in the case of these websites, the `application` field takes the value `forest-atlas`;

If you would like to see your application added to the list of applications supported by the RW API, please contact us.

### Filtering content by the application field

> Fetching datasets for the Resource Watch application

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?application=rw
```

> Fetching datasets for the Global Forest Watch application

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?application=gfw
```

You can use the `application` field as a query parameter filter in many of the resources of the RW API to filter content specific to the given application. Check out on the side some examples of the usage of the `application` field when fetching RW API datasets.

Please keep in mind that some API resources might not use the `application` field. Filtering capabilities may also vary from one resource to another. Always make sure you check the specific documentation for the `application` field of the corresponding API resource.

### Usage of applications for access management

As you'll be able to understand from reading the [General notes on RW API users](#general-notes-on-rw-api-users) section, RW API users' values in the `application` field are also used to determine if a given user can administrate a given API resource. Typically, to manipulate said RW API resource, that resource and the user account must have at least one overlapping value in the `application` field.

Keep in mind that it’s up to each RW API service to define how they restrict or allow actions based on these or other factors. Refer to the documentation of each resource and endpoint for more details on restrictions they may have regarding the usage of the `application` field for access management.

<!-- ## Authentication

TODO

## Roles

TODO

## Environments

TODO

## Caching

TODO -->
