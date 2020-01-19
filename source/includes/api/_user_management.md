# User Management

The following endpoints expose the API's functionality regarding user management.
For more information or implementation details, see [the source code](https://github.com/control-tower/ct-oauth-plugin).


## A note on UI elements

Unlike the other parts of the API, this section covers endpoints that provide end-user interaction, rendering HTML pages or sending emails to reset passwords and such. Some elements of these interfaces can be configured to match specific projects identities (RW, GFW, etc). To specify which project your requests come from, you can add an optional `origin` query parameter to your requests, with the name of the application. If matching visual elements exist, they will be used in the resulting interfaces displayed to the user.


## Login (email + password)

Login endpoints support both HTML and JSON output formats, depending on the `Content-type` provided in the request. Keep in mind that HTML-based requests will result in redirects - for example, after successfully logging in, you will be taken to `/auth/success` - while JSON based requests will simply return the matching HTTP code - 200 in case of a successful login.

### GET `<BASE API URL>/auth/`

Convenience URL that redirects to `<BASE API URL>/auth/login`


### GET `<BASE API URL>/auth/login`

Basic API auth login page. Only supported for HTML requests.


### POST `<BASE API URL>/auth/login`
Endpoint for email + password based login.

For HTML requests, it will redirect to either `<BASE API URL>/auth/success` or `<BASE API URL>/auth/fail` depending on whether the login was successful or not. An optional `callbackUrl` query parameter can be provided, in which case the user will be redirected to that URL in case of login success.

For JSON requests, it will return 200 or 401 HTTP response code depending on whether the login was successful or not. In case of successful logins, the basic user details will be returned as a JSON object.

```bash
# Email + password based login - JSON format
curl -X POST http://api.resourcewatch.org/auth/login \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com",
    "password":"potato"
}'
```

```
// Response:
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

Account creation page, for accounts using email + password based login for HTML requests. Not supported on JSON requests.

```bash
curl -X GET http://api.resourcewatch.org/auth/sign-up
```


### Register a new user account

Account creation endpoint, for accounts using email + password based login for both HTML and JSON requests.

The combination of both `user email` and `provider` must be unique.

For HTML requests, it will display a message informing about any validation error, or informing the user in case of success.

For JSON requests, it will return 200 or 422 HTTP response code depending on whether the login was successful or not. In case of successful logins, the basic user details will be returned as a JSON object. In case of failure, an array of errors is returned.

In both types of requests, on success, an email will be sent to the user, with a link to confirm the account. The email will have the identity of the `origin` app provided on the request, with a system-wide fallback (GFW) being used in case none is provided.

While optional, it's highly recommended that you specify which apps the user will be granted access to, as most API operation validate the user's apps match datasets, widgets, etc.

> Account creation using email + password

```bash
curl -X POST http://api.resourcewatch.org/auth/sign-up \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com",
    "password":"potato",
    "repeatPassword":"potato",
    "apps": ["rw"]
}'
```


> Response

```
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

```bash
curl -X POST http://api.resourcewatch.org/auth/sign-up?origin=rw \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com",
    "password":"potato",
    "repeatPassword":"potato",
    "apps": ["rw"]
}'
```

#### Permissions

Based on roles, different types of users can create new users with different roles:

- ADMIN: Can create any type of user
- MANAGER: Can create a user of type `MANAGER` or `USER`.
- Public users: Can register themselves in the API, being assigned the `USER` role.


### Confirm user account

Endpoint used in the user validation email to confirm the address upon registration.

It accepts an optional `callbackUrl` query parameter with an URL to which the user will be redirect if the confirmation succeeds.

Should no `callbackUrl` be provided, the user is redirected to an URL based on the first application associated to their user account - see `ct-oauth-plugin` configuration for more info.

Should that application have no configured redirect URL, or the user have no configured app, they are redirect to a platform-wide default URL - see `ct-oauth-plugin` configuration for more info.

> JSON Request:

```bash
curl -X GET http://api.resourcewatch.org/auth/confirm/:token \
-H "Content-Type: application/json"
```

> JSON Response:

```bash
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

```bash
curl -X GET http://api.resourcewatch.org/auth/confirm/:token?callbackUrl=http://your-app.com
```

## Password recovery

Password recovery endpoints support both HTML and JSON output formats, depending on the `Content-type` provided in the request.

### GET `<BASE API URL>/auth/reset-password`

Displays the password reset form page.


### POST `<BASE API URL>/auth/reset-password`

Endpoint where the password reset request is sent.

```bash
# Password reset
curl -X POST http://api.resourcewatch.org/auth/reset-password \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com"
}'
```

### GET `<BASE API URL>/auth/reset-password/:token`

Endpoint used to validate email address upon password reset request.


### POST `<BASE API URL>/auth/reset-password/:token`

Endpoint used to submit the new password.

For HTML requests, it will redirect the user to the configured redirect URL on success, or return to the "Reset your password" form on error.

For JSON requests, it will return the user object on success, or a JSON object containing details in case of error.

```bash
# New password submission
curl -X POST http://api.resourcewatch.org/auth/reset-password/<email token> \
-H "Content-Type: application/json"  -d \
 '{
    "password":"potato",
    "repeatPassword":"potato"
}'
```

## User details management

### Getting all users

Lists user accounts:

- Only users with role ADMIN have permissions to use this endpoint.
- Email+password based accounts that have not had their email address confirmed will not be listed by this endpoint.
- By default, only users belonging to the same apps as the requesting user will be shown. See [Filter by app](#filter-by-app) for more options.

```bash
# Lists all currently active users belonging to the same apps as the requester
curl -X GET http://api.resourcewatch.org/auth/user
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

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


#### Filter by name

```bash
curl -X GET http://api.resourcewatch.org/auth/user?name=John
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

#### Filter by email

```bash
curl -X GET http://api.resourcewatch.org/auth/user?email=my.address@email.com
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

#### Filter by provider

```bash
curl -X GET http://api.resourcewatch.org/auth/user?provider=facebook
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

#### Filter by role

```bash
curl -X GET http://api.resourcewatch.org/auth/user?role=ADMIN
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

#### Filter by app

By default, only users belonging to the same apps as the requesting user will be shown when listing users. You can change this behavior by explicitly identifying the apps you'd like to filter by, even if they are not in the list of apps the requesting user belongs to. You can pass multiple apps this way by separating them with commas.

```bash
# List users that belong to the gfw app
curl -X GET http://api.resourcewatch.org/auth/user?app=gfw
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \

# List users that belong to any app
curl -X GET http://api.resourcewatch.org/auth/user?app=all
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

Additionally, you can pass the special `all` value to this filter, to load users from all applications.

### Get a user by id

```bash
# shows info for user with the given id
curl -X GET http://api.resourcewatch.org/auth/user/<user_id>
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
```

### Update your user account details

- Updates current user details.
- Can be used by any user.
- Supported fields: `name` and `photo`. If the user has the `ADMIN` role, it additionally supports updating `extraUserData.apps` and `role`.
- Returns the new state of the updated user object.

```bash
# updates current user details
curl -X PATCH http://api.resourcewatch.org/auth/user/me
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

<aside class="notice">
Updating your account details may invalidate your token and cause your apps to stop working.
</aside>


### Update another user's account details

- Updates specified user details.
- Can only be used by admins.
- Supported fields: `name`, `photo`, `extraUserData.apps` and `role`
- Returns the new state of the updated user object.


```bash
# updates details of user given its id
curl -X PATCH http://api.resourcewatch.org/auth/user/57bc2611f098ce9800798688
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

<aside class="notice">
Updating a user's account details may invalidate their token and cause their apps to stop working.
</aside>

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

### Deleting a user

- Deletes the specified user account.
- Can only be used by admins.
- Returns the deleted user object.

<aside class="notice">
This action only deletes the user account. Any resources that may be associated with this given user account are not modified or deleted.
</aside>


```bash
# updates details of user given its id
curl -X DELETE http://api.resourcewatch.org/auth/user/<user_id>
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
 '{
    "name":"user name",
    "email":"user@email.com",
    "photo": "https://s3.amazonaws.com/wri-api-backups/resourcewatch/test/profiles/avatars/000/000/022/original/data?1544443314",
    ...
}'
```
