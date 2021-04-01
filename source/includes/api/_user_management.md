# User management

The following endpoints expose the RW API's functionality regarding user management. These endpoints will allow you to login, recover a forgotten password, create, edit or delete a user account. We've already covered the basics of getting a user account in the [quickstart guide](quickstart.html) section, and here we'll dive deeper into all the functionality exposed by these endpoints.

These endpoints have a key difference from most of the endpoint covered so far. The great majority of the RW API endpoints are meant to be used by your applications, and as such produce JSON responses, which are easily interpreted by computers. However, some of the functionality we'll cover in this section is meant to be used only or also by humans, making JSON a less than ideal response format. 

Some (but not all) of the endpoints documented here will produce a response in either JSON or HTML format, depending on the value you provide on the `Content-type` HTTP request header. 
Use `Content-Type: application/json` if you are calling the endpoint from an application, and would like to get a JSON formatted response. 
If you are accessing these endpoints from a browser, it will typically generate a request with the `Content-Type: text/html` header, in which case the reply will be in HTML format.

Keep in mind that not all endpoints support both formats, and will output either HTML or JSON, no matter which `Content-Type` value you provide.

## General notes on RW API users

User accounts in the RW API work pretty much like you would expect: you create a user account, login with it, and use it on your day-to-day interactions to access certain actions and associate certain RW API resources with it.

Besides authentication, user accounts are also used for authorization. Authorization is implemented on a per-service basis, but is commonly built on top of 3 elements associated with your a user account:

- `id`
- `role`
- `application`

`id` is a unique identifier of your account. Certain actions may be limited to specific users, typically in the context of a given resource being associated directly with a specific user `id`.

`role` can be one of 3 values: `USER`, `MANAGER` and `ADMIN` and it is usually used for role-based access control - read more about this field in the [User roles concept documentation](concepts.html#user-roles).

`application` is a list of keys meant to identify the different client applications that are built using the RW API. It's present not only on user accounts, but also on many of the resources found on the RW API, either as a single value or as a list of values. Typically, in order to manipulate a given resource, that resource and the user account must have at least one overlapping `application` value. You can find out more about how the `application` field works [here](concepts.html#applications).

Keep in mind that it's up to each individual RW API service (dataset, widget, layer, etc) to define how they restrict or allow actions based on these or other factors, so the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on restrictions they may have regarding user accounts and their properties.

**Deprecation notice:** Throughout these endpoints, you'll notice that many API responses contain both `id` and `_id` (with and without an underscore prefix). Whenever both are present, they will always have the same value, and you should rely on `id` (no prefix) - `_id` is present for BC reasons, but should be considered deprecated, and will be removed in the near future. 

## User management and applications 

As we've covered in previous sections, several RW API resources, like users, datasets or widgets, are associated with one or more applications. Applications are a way to identify the different tools that rely on the RW API, and are used to make resource management easier.

The user management service can also models its behavior based on the application that's making use of it - this can be controlled by the `origin` query parameter. This parameter can be passed on every request, or on the first request only, if you are relying on cookie-based sessions. In it, you can identify the application using the RW API. If it's a known application, certain elements will be adjusted:

- Logo and color scheme on HTML pages and emails.
- Fallback redirects on login.
- Available 3rd party authentication mechanisms and associated accounts on those platforms.

If you use an `origin` application that's not known to the RW API, you will see a fallback configuration of these elements, and 3rd party login will be disabled. If you'd like your application to be supported, please [contact us](https://resourcewatch.org/about/contact-us) - we'd love to hear about how the RW API can help your projects.

## Login (email + password)

Login endpoints support both HTML and JSON output formats, depending on the `Content-type` provided in the request. Keep in mind that HTML-based requests will result in redirects - for example, after successfully logging in, you will be taken to `/auth/success` - while JSON based requests will simply return the matching HTTP code - 200 in case of a successful login.

### GET `<BASE API URL>/auth/`

Convenience URL that redirects to `<BASE API URL>/auth/login` - the HTML login page.


### GET `<BASE API URL>/auth/login`

HTML page that displays the login, registration and password reset links. This is the most common entry point when using the HTML UI provided by the RW API for user management.


### POST `<BASE API URL>/auth/login`

> Email + password based login - JSON format

```shell
curl -X POST "https://api.resourcewatch.org/auth/login" \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com",
    "password":"potato"
}'
```

> Response:

```json
{
  "data": {
    "id": "5bfd237767b3176dd63f2eb7",
    "_id": "5bfd237767b3176dd63f2eb7",
    "email": "your-email@provider.com",
    "createdAt": "2018-11-15T04:46:35.313Z",
    "updatedAt": "2018-11-15T04:46:35.313Z",
    "role": "USER", 
    "provider": "local",
    "extraUserData": {
      "apps": [
        "rw"
      ]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZWNmYTJiNjdkYTBkM2VjMDdhMjdmNiIsInJvbGUiOiJVU0VSIiwicHJvdmlkZXIiOiJsb2NhbCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImV4dHJhVXNlckRhdGEiOnsiYXBwcyI6WyJydyJdfSwiY3JlYXRlZEF0IjoxNTQzMzE1NzMxNzcwLCJpYXQiOjE1NDMzMTU3MzF9.kIdkSOb7mCMOxE2ipqVOBrK7IefAjLDhaPG9DT1qvCw"
  }
}
```

Endpoint for email + password based login.

For HTML requests, it will redirect to either `<BASE API URL>/auth/success` or `<BASE API URL>/auth/fail` depending on whether the login was successful or not. If successful, the HTTP reply will have a session cookie that may be used in subsequent requests. An optional `callbackUrl` query parameter can be provided, in which case the user will be redirected to that URL in case of login success. 

For JSON requests, in case of successful logins, the user details will be returned as a JSON object.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Invalid email or password. | Login credentials are missing or incorrect.

### GET `<BASE API URL>/auth/fail`

Displays login errors for HTML requests. Not supported on JSON requests.

### GET `<BASE API URL>/auth/check-logged`

> Check if the user is logged

```shell
curl -X GET "https://api.resourcewatch.org/auth/check-logged" \
    -H 'Cookie: <your cookie values>'
```

> Response

```json
{
  "data": {
    "id": "5bfd237767b3176dd63f2eb7",
    "_id": "5bfd237767b3176dd63f2eb7",
    "email": "your-email@provider.com",
    "createdAt": "2018-11-27T10:59:03.531Z",
    "updatedAt": "2018-11-27T10:59:03.531Z",
    "role": "USER",
    "provider": "local",
    "extraUserData": {
      "apps": ["rw"]
    }
  }
}
```

Checks if you are logged in. This is typically used to determine if a session has been established between the the user's browser and the RW API. 

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You are not logged in.

### GET `<BASE API URL>/auth/success`

Successful login page for HTML requests. Not supported on JSON requests.

### GET `<BASE API URL>/auth/logout`

Login invalidation endpoint. Only invalidates the session cookie set on login. If using JSON Web Token based authentication, this endpoint will NOT invalidate the token.

### GET `<BASE API URL>/auth/generate-token`

> Generate the user's JSON Web Token

```shell
curl -X GET "https://api.resourcewatch.org/auth/generate-token" \
    -H 'Cookie: <your cookie values>'
```

> Response:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZWNmYTJiNjdkYTBkM2VjMDdhMjdmNiIsInJvbGUiOiJVU0VSIiwicHJvdmlkZXIiOiJsb2NhbCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImV4dHJhVXNlckRhdGEiOnsiYXBwcyI6WyJydyJdfSwiY3JlYXRlZEF0IjoxNTQzMzE1NzMxNzcwLCJpYXQiOjE1NDMzMTU3MzF9.kIdkSOb7mCMOxE2ipqVOBrK7IefAjLDhaPG9DT1qvCw"
}
```

Generates a JSON Web Token for the current user session. This is useful when using the HTML UI through a browser, where a session is established using a cookie returned on login. This cookie authenticates the user, and allows retrieving the token.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You are not logged in.

## Login (3rd party oauth)

Besides its own email + password login mechanism, that you can interact with and build your own UI on top of, the RW API also provides authentication using 3rd party accounts, like Facebook, Twitter, Apple or Google. These 4 authentication mechanisms use [OAuth](https://en.wikipedia.org/wiki/OAuth) access delegation, meaning users can use their accounts on these platforms to access the RW API. For each mechanism, users will be informed, when logging in, which data the RW API requires to provide this access.

For each provider, there's a corresponding endpoint that starts the authentication flow. These endpoints simply redirect the user to the respective provider page, along with some data that allows the provider to contact the RW API when the login process is finished. You can forward users to these endpoints if, for example, you want to have your own login links on your UI.

Keep in mind that, depending on the `origin` application you specify, different Twitter, Facebook or Google applications will be used. Also, not all `origin` applications support all 3 providers.

### 3rd party authentication using Google

- GET `<BASE API URL>/auth/google` - Starts authentication using the configured Google settings
- GET `<BASE API URL>/auth/google/token?access_token=<Google token>` - Endpoint that expects the Google token used by the API to validate the user session. It

### 3rd party authentication using Facebook

- GET `<BASE API URL>/auth/facebook` - Starts authentication using the configured Facebook settings
- GET `<BASE API URL>/auth/facebook/token?access_token=<Facebook token>` - Endpoint that expects the Facebook token used by the API to validate the user session.

### 3rd party authentication using Apple

- GET `<BASE API URL>/auth/apple` - Starts authentication using the configured Apple settings
- GET `<BASE API URL>/auth/apple/token?access_token=<Apple JSON Web Token>` - Endpoint that expects the Apple JSON Web Token obtained by the user while authenticating using another application. It validates that token using Apple's services, and if valid, creates/updates the user's RW API account. It returns a RW API JSON Web Token.

### Common authorization callback

All forms of 3rd party login return to the same endpoint:

- POST `<BASE API URL>/auth/authorization-code/callback`

## Registration

Registration endpoints support both HTML and JSON output formats, depending on the `Content-type` provided in the request.

### View the registration page

```shell
curl -X GET "https://api.resourcewatch.org/auth/sign-up"
```

Account creation page, for accounts using email-based login for HTML requests. Not supported on JSON requests.


### Register a new user account

> Account creation using email

```shell
curl -X POST "https://api.resourcewatch.org/auth/sign-up" \
-H "Content-Type: application/json"  -d \
 '{
    "name: "Your name"
    "email":"your-email@provider.com",
    "apps": ["rw"]
}'
```

> Response

```json
{
  "data": {
    "id": "5bfd237767b3176dd63f2eb7",
    "name": "Your name",
    "email": "your-email@provider.com",
    "createdAt": "2018-11-27T10:59:03.531Z",
    "role": "USER",
    "extraUserData": {
      "apps": ["rw"]
    }
  }
}
```

> Account creation using email with a user defined origin app

```shell
curl -X POST "https://api.resourcewatch.org/auth/sign-up?origin=rw" \
-H "Content-Type: application/json"  -d \
 '{
    "name: "Your name"
    "email":"your-email@provider.com",
    "apps": ["rw"]
}'
```

Account creation endpoint, for accounts using email-based login for both HTML and JSON requests. The `email` must be unique, otherwise a 422 HTTP response will be returned.

For HTML requests, it will display a message informing about any validation error, or informing the user in case of success.

For JSON requests, successful logins will return a JSON object containing the details of the user.

Keep in mind that this endpoint creates a **deactivated** user account. A successful call to this endpoint send an email to the user, with a link that the user must click in order to confirm their account and define their password. Once confirmed using this process, the user account becomes activated and fully functional, and the user will be able to log in.

While optional, it's highly recommended that you specify which apps the user will be granted access to, as most API operation validate the user's apps match datasets, widgets, etc. All accounts created this way will have the `USER` role.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
422            | Email exists.  | An account already exists for the provided email address.
422            | Email is required.  | You are missing one of the required fields.


## Password recovery

Password recovery endpoints support both HTML and JSON output formats, depending on the `Content-type` provided in the request. These can be used either as part of your application (for example, if you want your UI to have these features built in) or as a standalone, end user facing interface (for applications that prefer to rely on the existing UI elements provided by the RW API).

### GET `<BASE API URL>/auth/reset-password`

Displays the password reset form HTML page.


### POST `<BASE API URL>/auth/reset-password`

> Request a password reset

```shell
curl -X POST "https://api.resourcewatch.org/auth/reset-password" \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com"
}'
```

> Response (JSON)

```json
{
    "message": "Email sent"
}
```

Endpoint where the password reset request is sent. If an account associated with the provided email address exists, a message will be sent to it with a link that will allow the user to reset their account's password. That link will be valid for 24 hours.

Note that, for security reasons, if no account associated with the provided email address exists, the output will be the same.  

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
422            | Mail required. | You need to specify the email address in the request body.


## User details management

This section covers endpoints that focus on retrieving, modifying or deleting user accounts. Unlike previous endpoints, these are meant to be consumed by applications, and will always produce a JSON response.

### Getting all users

> Lists all currently active users belonging to the same apps as the requester

```shell
curl -X GET "https://api.resourcewatch.org/auth/user"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> Response:

```json
{
    "data": [
        {
            "id": "5d2fadb3adf1dc74d2ad05dfb",
            "_id": "5d2fadb3adf1dc74d2ad05dfb",
            "email": "john.doe@vizzuality.com",
            "provider": "local",
            "createdAt": "2019-10-31T13:00:58.191Z",
            "updatedAt": "2019-10-31T13:00:58.191Z",
            "role": "USER",
            "extraUserData": {
                "apps": []
            }
        },
        {...}
    ],
     "links": {
         "self": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10",
         "first": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10",
         "prev": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10",
         "next": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10"
     }
}
```

This endpoint allows users with `ADMIN` role to list and filter existing user accounts. Through this endpoint, only 3rd party-based and confirmed email-based user accounts are listed - user accounts that have not been confirmed will not be listed. It's also important to keep in mind that, by default, only users belonging to the same apps as the requesting user will be shown - you can use [filters](#filters449) to modify this behavior.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You need to be logged in to use this endpoint.

#### Pagination

> Example request using the "cursor" strategy:

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?strategy=cursor"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> Example request using the "offset" strategy:

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?strategy=offset"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

Currently, this endpoint supports 2 pagination strategies: **"cursor"** and **"offset"**. Both strategies are available via the "strategy" query parameter: `strategy=offset` to use the "offset" strategy, and `strategy=cursor` to use the "cursor" strategy;

**Until May 1st 2021, if nothing is provided, the default strategy used will be "offset".** After May 1st, the "offset" strategy will be officially deprecated, and the "cursor" strategy will become the default. During this period, the "offset" strategy will still be accessible by passing the `strategy=offset` parameter in the request.

**After September 30th 2021, the "offset" strategy will be officially deprecated.** Passing the `strategy=offset` parameter will no longer be supported, and the "cursor" strategy will remain the default going forward.

**If you are here for the first time, you should use the "cursor" strategy.**

#### Pagination using cursor strategy

> Example request to the first page with "cursor" strategy:

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?strategy=cursor"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> Example response, including the "links" object in the response body:

```json
{
    "data": [
        {
            "id": "57bc261af098ce980079873e",
            "_id": "57bc261af098ce980079873e",
            "email": "your@email.com",
            "name": "",
            "createdAt": "2021-03-24T09:19:25.000Z",
            "updatedAt": "2021-03-26T09:54:08.000Z",
            "role": "USER",
            "provider": "local",
            "extraUserData": { "apps": ["gfw"] }
        },
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...}
    ],
    "links": {
        "self": "http://api.resourcewatch.org/auth/user?strategy=cursor&page[before]=00ucw0wd1cUIGDMed5d6&page[size]=10",
        "first": "http://api.resourcewatch.org/auth/user?strategy=cursor&page[size]=10",
        "next": "http://api.resourcewatch.org/auth/user?strategy=cursor&page[after]=00ucw0wd1cUIGDMed5d6&page[size]=10"
    }
}
```

> Example request to the page after the cursor provided with "cursor" strategy:

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?strategy=cursor&page[after]=00ucw0wd1cUIGDMed5d6"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

Cursor-based pagination works by returning a slice of results, and a pointer to the end of the slice returned. On subsequent requests, you can then use the cursor to request the next slice of results after (or before) the cursor provided. Cursor-paginated methods accept limiting the amount of returned results through the `page[size]` query parameter - defaults to 10, with a maximum supported value of 200 -, and control of the slice returned through the `page[after]` and `page[before]` query parameters.

By default, if you don't pass a `page[after]` or `page[before]` parameter, you'll receive the first portion of results. Paginated responses include a top-level `links` object in the response body, that includes the link you should use to fetch the previous or next page of data.

If the slice of data you received is smaller than the `page[size]` provided (or 10, the default value), that indicates no further results.

**Please keep in mind that, until May 1st 2021, you need to provide `strategy=cursor` to use this pagination strategy.**

#### Pagination using offset strategy

> DEPRECATED: Example request to load page 2 using 25 results per page using the "offset" strategy:

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?strategy=offset&page[number]=2&page[size]=25"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

Until September 30th 2021, like with many other resources across the RW API, you can also paginate results with a strategy based on page number (`page[number]`)
and page size (`page[size]`).

You can read more about this pagination strategy in the [Pagination guidelines for the RW API](concepts.html#pagination). Please keep in mind that:

* from May 1st 2021 onwards, you need to provide `strategy=offset` to use this pagination strategy;
* **from September 30th 2021 onwards, this strategy is officially deprecated and will be removed.**

Also, due to the inner workings of the underlying system used by the RW API for user management, the higher the page number is, the longer the response will take to be returned. This is the principal reason we are deprecating this strategy, and a very valid reason why you should avoid using this strategy altogether.

#### Filters

> List users with the ADMIN role (and associated with the current user's app)

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?role=ADMIN"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> List users with the ADMIN role and associated with either `gfw` or `rw` apps

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?role=ADMIN&app=gfw,rw"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> Response:

```json
{
    "data": [
        {
            "id": "5d2fadb3adf1dc74d2ad05dfb",
            "_id": "5d2fadb3adf1dc74d2ad05dfb",
            "provider": "local",
            "email": "john.doe@vizzuality.com",
            "createdAt": "2019-10-31T13:00:58.191Z",
            "updatedAt": "2019-10-31T13:00:58.191Z",
            "role": "ADMIN",
            "extraUserData": {
                "apps": ["rw"]
            }
        },
        {...}
    ],
     "links": {
         "self": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10",
         "first": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10",
         "last": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10",
         "prev": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10",
         "next": "https://api.resourcewatch.org/auth/user?page[number]=1&page[size]=10"
     },
     "meta": {
         "total-pages": 1,
         "total-items": 3,
         "size": 10
     }
}
```

The users list provides a set of parameters that you can use to tailor your users listing. Please note that filtering users adheres to the conventions defined in the [Filter guidelines for the RW API](concepts.html#filtering), so we strongly recommend reading that section before proceeding. in addition to these conventions, you can use the following fields as filters supported by the users list endpoint:

Filter         | Description                                                                  | Type        | Expected values
-------------- | ---------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------
name           | Filter returned users by their name.                                         | String      | any valid text
email          | Filter returned users by their email address. Keep in mind that user accounts that rely on 3rd party authentication mechanisms may not have an email address. | String      | any valid text
provider       | Filter returned users by their provider.                                     | String      | `local`, `google`, `twitter`, `facebook` or `apple`
role           | Filter returned users by their role.                                         | String      | `USER`, `MANAGER` or `ADMIN`
app            | Filter returned users by their app. Multiple values can be passed, separated by commas, in which case any user associated with at least one of the applications will be returned. Pass `all` to show users for all apps. | String      | any valid text

### Get the current user

> Shows info for user currently logged in

```shell
curl -X GET "https://api.resourcewatch.org/auth/user/me"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> Response

```json
{
    "provider": "local",
    "role": "ADMIN",
    "_id": "5dbadb0adf24534d1ad05dfb",
    "id": "5dbadb0adf24534d1ad05dfb",
    "email": "test.user@example.com",
    "extraUserData": {
        "apps": [
            "rw",
            "gfw"
        ]
    },
    "createdAt": "2019-10-31T13:00:58.191Z",
    "updatedAt": "2019-10-31T13:00:58.191Z"
}
```

This endpoint allows you to get the details of the user account associated with the current token. It's available to all authenticated users.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You need to be logged in to use this endpoint.

### Get a user by id

> Shows info for user with the given id

```shell
curl -X GET "https://api.resourcewatch.org/auth/user/<user_id>"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> Response

```json
{
    "provider": "local",
    "role": "ADMIN",
    "_id": "5dbadb0adf24534d1ad05dfb",
    "id": "5dbadb0adf24534d1ad05dfb",
    "email": "test.user@example.com",
    "extraUserData": {
        "apps": [
            "rw",
            "gfw"
        ]
    },
    "createdAt": "2019-10-31T13:00:58.191Z",
    "updatedAt": "2019-10-31T13:00:58.191Z"
}
```

This endpoint allows you to get the details of the user account associated with the current token. It's available to users with role `ADMIN`.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You need to be logged in to use this endpoint.
403            | Not authorized. | You need to have the `ADMIN` role to use this endpoint.

### Update your user account details

> Updates current user details

```shell
curl -X PATCH "https://api.resourcewatch.org/auth/user/me"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
 '{
    "name":"new-name",
    "photo": "https://photo-url.com",
    "extraUserData" : {
        apps: ["rw", "gfw"]
    },
    "role": "MANAGER"
}'
```

> Response:

```json
{
    "data": {
        "id": "57bc2611f098ce9800798688",
        "_id": "57bc2611f098ce9800798688",
        "provider": "local",
        "email": "test@example.com",
        "name": "new-name",
        "photo": "https://photo-url.com",
        "createdAt": "2017-01-13T10:45:46.368Z",
        "updatedAt": "2017-01-13T10:45:46.368Z",
        "role": "MANAGER",
        "extraUserData": {
           "apps": ["rw", "gfw"]
        }
    }
}
```

This endpoints allows updating your user account details. It's available to any logged in user, allowing them to modify the following fields:

- `name`
- `photo`
- `extraUserData.apps` (only allowed for users with `ADMIN` role)
- `role` (only allowed for users with `ADMIN` role)

The response will contain the user details, reflecting the applied changes.

<aside class="notice">
Updating your account details may invalidate your token and cause your apps to stop working.
</aside>

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You need to be logged in to use this endpoint.

### Update another user's account details

> Updates details of user given its id

```shell
curl -X PATCH "https://api.resourcewatch.org/auth/user/57bc2611f098ce9800798688"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
 '{
    "name":"new-name",
    "photo": "https://photo-url.com",
    "extraUserData" : {
        apps: ["rw", "gfw"]
    },
    "role": "MANAGER"
}'
```
> Response:

```json
{
    "data": {
        "id": "57bc2611f098ce9800798688",
        "_id": "57bc2611f098ce9800798688",
        "provider": "local",
        "email": "test@example.com",
        "name": "new-name",
        "photo": "https://photo-url.com",
        "createdAt": "2017-01-13T10:45:46.368Z",
        "updatedAt": "2017-01-13T10:45:46.368Z",
        "role": "MANAGER",
        "extraUserData": {
           "apps": ["rw", "gfw"]
        }
    }
}
```

This endpoints allows updating the user account details of another user. It's available to users with the `ADMIN` role, allowing them to modify the following fields:

- `name`
- `photo`
- `extraUserData.apps`
- `role`

The response will contain the user details, reflecting the applied changes.

<aside class="notice">
Updating a user's account details may invalidate their token and cause their apps to stop working.
</aside>

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You need to be logged in to use this endpoint.
403            | Not authorized. | You need to have the `ADMIN` role to use this endpoint.

### Deleting a user

> Deletes a user by its id

```shell
curl -X DELETE "https://api.resourcewatch.org/auth/user/<user_id>"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>"
```

> Response

```json
{
    "data": {
        "id": "57bc2611f098ce9800798688",
        "_id": "57bc2611f098ce9800798688",
        "provider": "local",
        "email": "test@example.com",
        "name": "new-name",
        "photo": "https://photo-url.com",
        "createdAt": "2017-01-13T10:45:46.368Z",
        "updatedAt": "2017-01-13T10:45:46.368Z",
        "role": "MANAGER",
        "extraUserData": {
           "apps": ["rw", "gfw"]
        }
    }
}
```

This endpoints deletes the user account with the given id. It's available to users with the `ADMIN` role. The response will contain the details of the user account that was deleted.

<aside class="notice">
This action only deletes the user account. Any resources (datasets, subscriptions, etc) that may be associated with this given user account are not modified or deleted.
</aside>
