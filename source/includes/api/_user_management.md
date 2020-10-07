# User management

The following endpoints expose the RW API's functionality regarding user management. These endpoints will allow you to login, recover a forgotten password, create, edit or delete a user account. We've already covered the basics of getting a user account in the [authentication](#authentication) section, and here we'll dive deeper into all the functionality exposed by these endpoints.

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

`role` can be one of 3 values: `USER`, `MANAGER` and `ADMIN`. While not required nor enforced, typically they are used hierarchically in that order, from least to most permissive. A common pattern you'll find on some services is: `USER` accounts can only create new resources, `MANAGER` accounts can create new resources, and edit or delete resources created by them, while `ADMIN` accounts can do all of the above even for resources created by other users.

`application` is a list of keys meant to identify the different client applications that are built using the RW API. It's present not only on user accounts, but also on many of the resources found on the RW API, either as a single value or as a list of values. Typically, in order to manipulate a given resource, that resource and the user account must have at least one overlapping `application` value.

Keep in mind that it's up to each individual RW API service (dataset, widget, layer, etc) to define how they restrict or allow actions based on these or other factors, so the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on restrictions they may have regarding user accounts and their properties.

You can find out more about how the `application` field works [here](/index-rw.html#applications).

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
    "email": "your-email@provider.com",
    "createdAt": "2018-11-15T04:46:35.313Z",
    "role": "USER",
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
    "email": "your-email@provider.com",
    "createdAt": "2018-11-27T10:59:03.531Z",
    "role": "USER",
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

Login invalidation endpoint. Only invalidates the session cookie set on login. If using JWT token based authentication, this endpoint will NOT invalidate the token.

### GET `<BASE API URL>/auth/generate-token`

> Generate the user's JWT token

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

Generates a JWT token for the current user session. This is useful when using the HTML UI through a browser, where a session is established using a cookie returned on login. This cookie authenticates the user, and allows retrieving the token.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You are not logged in.

## Login (3rd party oauth)

Besides its own email + password login mechanism, that you can interact with and build your own UI on top of, the RW API also provides authentication using 3rd party accounts, like Facebook, Twitter, Apple or Google. These 4 authentication mechanisms use [OAuth](https://en.wikipedia.org/wiki/OAuth) access delegation, meaning users can use their accounts on these platforms to access the RW API. For each mechanism, users will be informed, when logging in, which data the RW API requires to provide this access.

For each provider, there's a corresponding endpoint that starts the authentication flow. These endpoints simply redirect the user to the respective provider page, along with some data that allows the provider to contact the RW API when the login process is finished. You can forward users to these endpoints if, for example, you want to have your own login links on your UI.

Keep in mind that, depending on the `origin` application you specify, different Twitter, Facebook or Google applications will be used. Also, not all `origin` applications support all 3 providers.

### 3rd party authentication using Twitter

- GET `<BASE API URL>/auth/twitter` - Starts authentication using the configured Twitter settings
- GET `<BASE API URL>/auth/twitter/callback` - Callback used once Twitter auth is done

### 3rd party authentication using Google

- GET `<BASE API URL>/auth/google` - Starts authentication using the configured Google settings
- GET `<BASE API URL>/auth/google/callback` - Callback used once Google auth is done
- GET `<BASE API URL>/auth/google/token?access_token=<Google token>` - Endpoint that expects the Google token used by the API to validate the user session. It

### 3rd party authentication using Facebook

- GET `<BASE API URL>/auth/facebook` - Starts authentication using the configured Facebook settings
- GET `<BASE API URL>/auth/facebook/callback` - Callback used once Facebook auth is done
- GET `<BASE API URL>/auth/facebook/token?access_token=<Facebook token>` - Endpoint that expects the Facebook token used by the API to validate the user session.

### 3rd party authentication using Apple

- GET `<BASE API URL>/auth/apple` - Starts authentication using the configured Apple settings
- POST `<BASE API URL>/auth/apple/callback` - Callback used once Apple auth is done
- GET `<BASE API URL>/auth/apple/token?access_token=<Apple JWT token>` - Endpoint that expects the Apple JWT token obtained by the user while authenticating using another application. It validates that token using Apple's services, and if valid, creates/updates the user's RW API account. It returns a RW API JWT token.

## Registration

Registration endpoints support both HTML and JSON output formats, depending on the `Content-type` provided in the request.

### View the registration page

```shell
curl -X GET "https://api.resourcewatch.org/auth/sign-up"
```

Account creation page, for accounts using email + password based login for HTML requests. Not supported on JSON requests.


### Register a new user account

> Account creation using email + password

```shell
curl -X POST "https://api.resourcewatch.org/auth/sign-up" \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com",
    "password":"potato",
    "repeatPassword":"potato",
    "apps": ["rw"]
}'
```

> Response

```json
{
  "data": {
    "id": "5bfd237767b3176dd63f2eb7",
    "email": "your-email@provider.com",
    "createdAt": "2018-11-27T10:59:03.531Z",
    "role": "USER",
    "extraUserData": {
      "apps": ["rw"]
    }
  }
}
```

> Account creation using email + password with a user defined origin app

```shell
curl -X POST "https://api.resourcewatch.org/auth/sign-up?origin=rw" \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com",
    "password":"potato",
    "repeatPassword":"potato",
    "apps": ["rw"]
}'
```

Account creation endpoint, for accounts using email + password based login for both HTML and JSON requests.

The combination of both `user email` and `provider` must be unique - a given email address may be associated with multiple, non-related user accounts by using different authentication providers (email+password, facebook, twitter, apple, etc).

For HTML requests, it will display a message informing about any validation error, or informing the user in case of success.

For JSON requests, successful logins will return a JSON object containing the details of the user.

Keep in mind that this endpoint creates a **deactivated** user account. A successful call to this endpoint send an email to the user, with a link that the user must click in order to confirm their account. Once confirmed using this process, the user account becomes activated and fully functional, and the user will be able to log in.

The email sent to the user will have the identity of the `origin` app provided on the request, with a system-wide fallback (GFW) being used in case none is provided.

While optional, it's highly recommended that you specify which apps the user will be granted access to, as most API operation validate the user's apps match datasets, widgets, etc. All accounts created this way will have the `USER` role.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
422            | Email exists.  | An account already exists for the provided email address.
422            | Email, Password and Repeat password are required.  | You are missing one of the required fields.


### Confirm user account

> JSON Request:

```shell
curl -X GET "https://api.resourcewatch.org/auth/confirm/:token" \
-H "Content-Type: application/json"
```

> JSON Response:

```json
{
    "data": {
        "id": "5dbadc495eae7358322dd64b",
        "email": "info@vizzuality.com",
        "createdAt": "2019-10-31T13:06:17.676Z",
        "updatedAt": "2019-10-31T13:06:17.676Z",
        "role": "USER",
        "extraUserData": {
            "apps": []
        }
    }
}
```

> Request with callback:

```shell
curl -X GET "https://api.resourcewatch.org/auth/confirm/:token?callbackUrl=https://your-app.com"
```

Endpoint used in the user validation email to confirm the address upon registration.

It accepts an optional `callbackUrl` query parameter with an URL to which the user will be redirect if the confirmation succeeds.

Should no `callbackUrl` be provided, the user is redirected to an URL based on the first application associated to their user account - see `ct-oauth-plugin` configuration for more info.

Should that application have no configured redirect URL, or the user have no configured app, they are redirect to a platform-wide default URL - see `ct-oauth-plugin` configuration for more info.

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

### GET `<BASE API URL>/auth/reset-password/:token`

Endpoint used when the user clicks the link sent in the reset password email. This endpoint is meant to be used only by the end user.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
422            | Token expired. | The reset password link is more than 24 hours old and is no longer valid.


### POST `<BASE API URL>/auth/reset-password/:token`

> New password submission

```shell
curl -X POST "https://api.resourcewatch.org/auth/reset-password/<email token>" \
-H "Content-Type: application/json"  -d \
 '{
    "password":"potato",
    "repeatPassword":"potato"
}'
```

> Response

```json
{
    "provider": "local",
    "role": "ADMIN",
    "_id": "5dbadb0adf24534d1ad05dfb",
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

Endpoint used to submit the new password.

For HTML requests, it will redirect the user to the configured redirect URL on success, or return to the "Reset your password" form on error.

For JSON requests, it will return the user object on success, or a JSON object containing details in case of error.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
422            | Token expired. | The reset password link is more than 24 hours old and is no longer valid.
422            | Password and Repeat password are required. | You need to specify both the `password` and the `repeatPassword` values.
422            | Password and Repeat password not equal. | You need to specify equal `password` and `repeatPassword` values.
                                                           

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
            "email": "john.doe@vizzuality.com",
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

This endpoint allows users with `ADMIN` role to list and filter existing user accounts. Through this endpoint, only 3rd party-based and confirmed email-based user accounts are listed - user accounts that have not been confirmed will not be listed. It's also important to keep in mind that, by default, only users belonging to the same apps as the requesting user will be shown - you can use [filters](#filters337) to modify this behavior.

**Errors**

Error code     | Error message  | Description
-------------- | -------------- | --------------
401            | Not authenticated. | You need to be logged in to use this endpoint.

#### Pagination

> Custom pagination: load page 2 using 25 results per page

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?page[number]=2&page[size]=25"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

By default, users are listed in pages of 10 results each, and the first page is loaded. However, you can customize this behavior using the following query parameters:  

Field        |         Description          |   Type |   Default
------------ | :--------------------------: | -----: | ----------:
page[size]   | The number elements per page. Values above 100 are not officially supported. | Number | 10
page[number] |       The page number        | Number | 1


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

The users list provides a set of parameters that you can use to tailor your users listing. These parameters can be combined into a complex `and` logic query.

Here's the comprehensive list of filters supported by the users list endpoint:
 

Filter         | Description                                                                  | Type        | Expected values
-------------- | ---------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------
name           | Filter returned users by their name.                                         | String      | any valid text
email          | Filter returned users by their email address. Keep in mind that user accounts that rely on 3rd party authentication mechanisms may not have an email address. | String      | any valid text
provider       | Filter returned users by their provider.                                     | String      | `local`, `google`, `twitter`, `facebook` or `apple`
role           | Filter returned users by their role.                                         | String      | `USER`, `MANAGER` or `ADMIN`
app            | Filter returned users by their app. Multiple values can be passed, separated by commas, in which case any user associated with at least one of the applications will be returned. Pass `all` to show users for all apps. | String      | any valid text


Please keep in mind that all filter values except `app` support and expect a regex value. Although typically they will match exact strings, you may have to escape certain characters (PCRE v8.42 spec).

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
