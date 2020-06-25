# User management

The following endpoints expose the RW API's functionality regarding user management. These endpoints will allow you to login, recover a forgotten password, create, edit or delete a user account. We've already covered the basics of getting a user account in the [authentication](#authentication) section, and here we'll dive deeper into all the functionality exposed by these endpoints.

These endpoints have a key difference from most of the endpoint covered so far. The great majority of the RW API endpoints are meant to be used by your applications, and as such produce JSON responses, which are easily interpreted by computers. However, some of the functionality we'll cover in this section is meant to be used only or also by humans, making JSON a less than ideal response format. 

Some (but not all) of the endpoints documented here will produce a response in either JSON or HTML format, depending on the value you provide on the `Content-type` HTTP request header. 
Use `Content-Type: application/json` if you are calling the endpoint from an application, and would like to get a JSON formatted response. 
If you are accessing these endpoints from a browser, it will typically generate a request with the `Content-Type: text/html` header, in which case the reply will be in HTML format.

Keep in mind that not all endpoints support both formats, and will output either HTML or JSON, no matter which `Content-Type` value you provide.

#### A note on UI elements

This section covers endpoints that generate human-facing elements, like login pages or reset passwords emails. Some elements of these interfaces can be configured to match specific projects identities (RW, GFW, etc). To specify which project your requests come from, you can add an optional `origin` query parameter to your requests, with the name of the application. If matching visual elements exist, they will be used in the resulting interfaces displayed to the user.


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

## Login (email + password)

Login endpoints support both HTML and JSON output formats, depending on the `Content-type` provided in the request. Keep in mind that HTML-based requests will result in redirects - for example, after successfully logging in, you will be taken to `/auth/success` - while JSON based requests will simply return the matching HTTP code - 200 in case of a successful login.

### GET `<BASE API URL>/auth/`

Convenience URL that redirects to `<BASE API URL>/auth/login`


### GET `<BASE API URL>/auth/login`

Basic API auth login page. Only supported for HTML requests.


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

For HTML requests, it will redirect to either `<BASE API URL>/auth/success` or `<BASE API URL>/auth/fail` depending on whether the login was successful or not. An optional `callbackUrl` query parameter can be provided, in which case the user will be redirected to that URL in case of login success.

For JSON requests, it will return 200 or 401 HTTP response code depending on whether the login was successful or not. In case of successful logins, the basic user details will be returned as a JSON object.


### GET `<BASE API URL>/auth/fail`
Displays login errors for HTML requests. Not supported on JSON requests.

### GET `<BASE API URL>/auth/check-logged`
Check login status

### GET `<BASE API URL>/auth/success`
Successful login page for HTML requests. Not supported on JSON requests.

### GET `<BASE API URL>/auth/logout`
Login invalidation endpoint

### GET `<BASE API URL>/auth/generate-token`
Generates a JWT token for the current user session.

## Login (3rd party oauth)

- GET '<BASE API URL>/auth/twitter' - Starts authentication using the configured Twitter settings
- GET '<BASE API URL>/auth/twitter/callback' - Callback used once Twitter auth is done
- GET '<BASE API URL>/auth/google' - Starts authentication using the configured Google settings
- GET '<BASE API URL>/auth/google/callback' - Callback used once Google auth is done
- GET '<BASE API URL>/auth/google/token' - Endpoint that expects the Google token used by the API to validate the user session.
- GET '<BASE API URL>/auth/facebook' - Starts authentication using the configured Google settings
- GET '<BASE API URL>/auth/facebook/callback' - Callback used once Facebook auth is done
- GET '<BASE API URL>/auth/facebook/token' - Endpoint that expects the Facebook token used by the API to validate the user session.



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

The combination of both `user email` and `provider` must be unique - a given email address may be associated with multiple, non-related user accounts by using different authentication providers (email+password, facebook, twitter, etc).

For HTML requests, it will display a message informing about any validation error, or informing the user in case of success.

For JSON requests, it will return 200 or 422 HTTP response code depending on whether the login was successful or not. In case of successful logins, the basic user details will be returned as a JSON object. In case of failure, an array of errors is returned.

In both types of requests, on success, an email will be sent to the user, with a link to confirm the account. The email will have the identity of the `origin` app provided on the request, with a system-wide fallback (GFW) being used in case none is provided.

While optional, it's highly recommended that you specify which apps the user will be granted access to, as most API operation validate the user's apps match datasets, widgets, etc.



#### Permissions

Based on roles, different types of users can create new users with different roles:

- ADMIN: Can create any type of user
- MANAGER: Can create a user of type `MANAGER` or `USER`.
- Public users: Can register themselves in the API, being assigned the `USER` role.


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

Password recovery endpoints support both HTML and JSON output formats, depending on the `Content-type` provided in the request.

### GET `<BASE API URL>/auth/reset-password`

Displays the password reset form page.


### POST `<BASE API URL>/auth/reset-password`

> Request a password reset

```shell
curl -X POST "https://api.resourcewatch.org/auth/reset-password" \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com"
}'
```

Endpoint where the password reset request is sent.

### GET `<BASE API URL>/auth/reset-password/:token`

Endpoint used to validate email address upon password reset request.


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

Endpoint used to submit the new password.

For HTML requests, it will redirect the user to the configured redirect URL on success, or return to the "Reset your password" form on error.

For JSON requests, it will return the user object on success, or a JSON object containing details in case of error.

## User details management

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
    "data": {
         "id": "5d2fadb3adf1dc74d2ad05dfb",
        "email": "john.doe@vizzuality.com",
        "createdAt": "2019-10-31T13:00:58.191Z",
        "updatedAt": "2019-10-31T13:00:58.191Z",
        "role": "USER",
        "extraUserData": {
            "apps": []
        }
    },
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

Lists user accounts:

- Only users with role ADMIN have permissions to use this endpoint.
- Email+password based accounts that have not had their email address confirmed will not be listed by this endpoint.
- By default, only users belonging to the same apps as the requesting user will be shown. See [Filter by app](#filter-by-app) for more options.


#### Filter by name

> Filter users by those whose name contains 'John'

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?name=John"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

You can filter by name by using the `name` query parameter and a regex value. 

If your search criteria includes characters that would need to be escaped in a regex context, you need to explicitly escape them when using this filter.

#### Filter by email

> Filter users by email address

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?email=my.address@email.com"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> Filter users by the "email+with+plus+sign@email.com" email address, that requires escaping

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?app=all&email=email%5C%2Bwith%5C%2Bplus%5C%2Bsign@email.com"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

You can filter by name by using the `email` query parameter and a regex value.

If your search criteria includes characters that would need to be escaped in a regex context, you need to explicitly escape them when using this filter.


#### Filter by provider

> List users whose account is associated with Facebook

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?provider=facebook"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

You can filter by name by using the `provider` query parameter and a regex value.

If your search criteria includes characters that would need to be escaped in a regex context, you need to explicitly escape them when using this filter.

#### Filter by role


> List users with the ADMIN role

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?role=ADMIN"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

You can filter by name by using the `role` query parameter and a regex value. 

If your search criteria includes characters that would need to be escaped in a regex context, you need to explicitly escape them when using this filter.

#### Filter by app

> List users that belong to the gfw app

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?app=gfw"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

> List users that belong to any app

```shell
curl -X GET "https://api.resourcewatch.org/auth/user?app=all"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

By default, only users belonging to the same apps as the requesting user will be shown when listing users. You can change this behavior by explicitly identifying the apps you'd like to filter by, even if they are not in the list of apps the requesting user belongs to. You can pass multiple apps this way by separating them with commas.

Additionally, you can pass the special `all` value to this filter, to load users from all applications.

### Get a user by id

> Shows info for user with the given id

```shell
curl -X GET "https://api.resourcewatch.org/auth/user/<user_id>"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

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
- Updates current user details.
- Can be used by any user.
- Supported fields: `name` and `photo`. If the user has the `ADMIN` role, it additionally supports updating `extraUserData.apps` and `role`.
- Returns the new state of the updated user object.


<aside class="notice">
Updating your account details may invalidate your token and cause your apps to stop working.
</aside>


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

- Updates specified user details.
- Can only be used by admins.
- Supported fields: `name`, `photo`, `extraUserData.apps` and `role`
- Returns the new state of the updated user object.

<aside class="notice">
Updating a user's account details may invalidate their token and cause their apps to stop working.
</aside>


### Deleting a user

> Deletes a user by its id

```shell
curl -X DELETE "https://api.resourcewatch.org/auth/user/<user_id>"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
 '{
    "name":"user name",
    "email":"user@email.com",
    "photo": "https://s3.amazonaws.com/wri-api-backups/resourcewatch/test/profiles/avatars/000/000/022/original/data?1544443314",
    ...
}'
```


- Deletes the specified user account.
- Can only be used by admins.
- Returns the deleted user object.

<aside class="notice">
This action only deletes the user account. Any resources that may be associated with this given user account are not modified or deleted.
</aside>
