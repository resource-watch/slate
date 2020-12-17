# API Overview

This section covers a list of topics you should be familiar with before using the API. The concepts described in this section span across multiple API endpoints and are fundamental for a better understanding of how to interact with the RW API.

## Authentication

The RW API provides most of its data through endpoints that are available to all users, without requiring any form of registration. However, some actions, like uploading data or flagging a resource as a favourite, require having a user account and using an access token when issuing requests to the API.

In this section you will learn the very basics of how you can quickly create a user account and use your token to authenticate requests. For more in-depth details on authentication, token and user management, refer to the [User Management](#user-management) section of the documentation.

### Logging in or registering a new user account

The easiest way to access your account is through the [login page](https://api.resourcewatch.org/auth/sign-up) of the RW API. Here you can authenticate using your existing Facebook, Google, Twitter or Apple account, or you can register or login using your email address and password. 

*Note: if you create a new user account using email and password, a confirmation link will be sent to the email address you provided. Your account will only be active once you've clicked the link in that email, so ensure that you use a valid email address. If you don't receive this email message within a few minutes, check your spam.*

Once you've successfully logged in using your browser, you'll see a "Welcome to the RW API message" on your browser. You can now generate user tokens.

![Auth success](images/authentication/auth-success.png)

### How to generate your private token

The RW API uses JWT [(JSON Web Tokens)](https://tools.ietf.org/html/rfc7519) tokens to identify and authenticate its users. If your are not familiar with the details of JWT, just think of them as a very long strings of characters that you need to attach to your requests to the RW API, to prove that you are you.

To get you token, you first need to login using your browser and the steps above. No matter which login strategy you prefer, once you've logged in, you can visit [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to get your token.

**Warning**: treat a token in the same way you would treat a password - don't share it and always store it in a safe place (like a password manager, for example). A token is sufficient to authenticate you on the RW API, meaning that, if someone else gains access to your token, they'll be able to do anything that you would be able to do on the RW API, even without access to your Facebook/Google/Twitter/Apple login or your email and password.

### How to use your private token to authenticate a request

> Example of how a request with a token is structured

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your token>" \
-H "Content-Type: application/json"  -d \
'{
  "dataset": {
    "name":"World Database on Protected Areas -- Global",
    "connectorType":"rest",
    "provider":"cartodb",
    "connectorUrl":"https://wri-01.carto.com/tables/wdpa_protected_areas/table",
    "application":[
      "gfw", 
      "forest-atlas"
    ]
  }
}'
```

Once you have your token, you can use it to authenticate your requests to the RW API. Depending on which endpoints you are trying to use, certain actions may become available by simply authenticating your request. Other will require your account to have a special role or applications, which we'll cover in more detail in the [User Management](#user-management) documentation.

Tokens must be provided in HTTP request header, named as `Authorization`, with the structure `Bearer <your token>`.

Once generated, a token is valid until any of the associated user information (name, email, or associated applications) changes. If your token becomes invalid, you will need to log in and go to [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to generate a new token.

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
* [Dataset](/index-rw.html#dataset7)
* [Graph](/index-rw.html#graph)
* [Layer](/index-rw.html#layer9)
* [Metadata](/index-rw.html#metadata14)
* [Subscriptions](/index-rw.html#subscriptions)
* [Topics](/index-rw.html#topic)
* [Users](/index-rw.html#user-management)
* [Vocabulary](/index-rw.html#vocabulary-and-tags)
* [Widgets](/index-rw.html#widget10)

<!-- ## Authentication

TODO

## Roles

TODO

## Environments

TODO

## Caching

TODO -->
