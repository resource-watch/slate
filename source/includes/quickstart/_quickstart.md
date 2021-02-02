# Resource Watch API Quickstart

This quickstart guide will get you up and running with the Resource Watch API. In it, you will:

1. Make a sample request to a public, non-authenticated endpoint

2. Create an account with the RW API

3. Obtain your JSON Web Token for authentication

4. Make a sample request to an authenticated endpoint

After that, you'll be ready to go!

## 1. Make a sample request to a public, non-authenticated endpoint

> Request the list of datasets that belong to the Resource Watch application

```shell
curl -X GET "https://api.resourcewatch.org/v1/dataset?env=production&application=rw"
-H "Content-Type: application/json"
```

> Sample response (truncated)

```json
{
  "data": [
    {
      "id": "20aead6e-fef9-41c7-92c8-ea00edcae077",
      "type": "dataset",
      "attributes": {
        "name": "bio.030 Tiger Conservation Landscapes",
        "slug": "Tiger-Conservation-Landscapes-1490086842553",
        "type": "tabular",
        "subtitle": null,
        "application": [
          "rw"
        ],
        "dataPath": null,
        "attributesPath": null,
        "connectorType": "rest",
        "provider": "featureservice",
        "userId": "58333dcfd9f39b189ca44c75",
        "connectorUrl": "http://gis-gfw.wri.org/arcgis/rest/services/conservation/MapServer/3?f=pjson",
        "sources": [],
        "tableName": "conservationMapServer3",
        "status": "saved",
        "published": false,
        "overwrite": false,
        "subscribable": {},
        "mainDateField": null,
        "env": "production",
        "geoInfo": true,
        "protected": false,
        "legend": { ... },
        "clonedHost": {},
        "errorMessage": null,
        "taskId": null,
        "createdAt": "2017-02-15T12:20:35.446Z",
        "updatedAt": "2018-08-09T16:41:50.251Z",
        "dataLastUpdated": null,
        "widgetRelevantProps": [
          "tcl_name",
          "tcl_id",
          "area_ha",
          "tx2_tcl",
          "shape_Area"
        ],
        "layerRelevantProps": [
          "area_ha",
          "shape",
          "shape_Length",
          "shape_Area",
          "tcl_name",
          "tcl_id",
          "globalid",
          "tx2_tcl",
          "gfwid",
          "objectid"
        ]
      }
    },
    ...
  ],
  "links": {
    "self": "http://api.resourcewatch.org/v1/dataset?env=production&application=rw&page[number]=1&page[size]=10",
    "first": "http://api.resourcewatch.org/v1/dataset?env=production&application=rw&page[number]=1&page[size]=10",
    "last": "http://api.resourcewatch.org/v1/dataset?env=production&application=rw&page[number]=75&page[size]=10",
    "prev": "http://api.resourcewatch.org/v1/dataset?env=production&application=rw&page[number]=1&page[size]=10",
    "next": "http://api.resourcewatch.org/v1/dataset?env=production&application=rw&page[number]=2&page[size]=10"
  },
  "meta": {
    "total-pages": 75,
    "total-items": 743,
    "size": 10
  }
}
```

Most of the resources on the RW API are publicly available, and do not require any authentication. For example, to the right is a simple call to the `/dataset` endpoint, and it  returns the list of all of the datasets that are registered with the API as part of the Resource Watch application. In fact, if you go to the [Resource Watch Explore page](https://resourcewatch.org/data/explore) and open the developer console, you will find this is very similar to the call that the Resource Watch application makes to populate the left sidebar with datasets.

Note: When you make a request to a public endpoint, you _may_ pass your JWT in the `Authorization` header, but it will not affect the response.

## 2. Create an account with the RW API

In order to make authenticated requests, you first need to create an account with the RW API. To do so, go to the [login page](https://api.resourcewatch.org/auth/login) and register. You can log in using an existing Facebook, Google, or Apple account, or you can register with an email and password.

If you create a new user account using an email and password, a confirmation link will be sent to the email address you provided. You must click this confirmation link in order to activate your account.

After you login, you should see the following message in your browser:

![Auth success](images/authentication/auth-success.png)

## 3. Obtain your JWT for authentication

> Sample response from `https://api.resourcewatch.org/auth/generate-token`

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5c..."
}
```

The RW API uses [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWTs) for authentication. Once you've created an account and logged in, go to [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to get your token.

**Warning**: Treat this token like a password. Don't share it with anyone and store it in a safe place (like a password manager). If someone else gains access to your token, they'll be able to do anything that you would be able to do on the RW API, even without access to your Facebook/Google/Apple login or your email and password.

Once generated, your token is valid until any of the user information (name, email, or associated [applications](/concepts.html#applications)) associated with your account changes. If your token becomes invalid, you can just log in via the browser and go to [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to generate a new token.

## 4. Make a sample request to an authenticated endpoint

> Request your own user information

```shell
curl -X GET "https://api.resourcewatch.org/auth/user/me"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>"
```

Now you're ready to make your first request!

Try making the request you see on the right. Don't forget to replace `your token` with the JWT you generated in the previous step.

In this example, you are requesting your own user information using the `/auth/user/me` endpoint of the API.

> Sample user information response

```json
{
    "provider": "local",
    "role": "USER",
    "_id": "5dbadb0adf24534d1ad05dfb",
    "id": "5dbadb0adf24534d1ad05dfb",
    "email": "test.user@example.com",
    "extraUserData": {
        "apps": [
            "rw"
        ]
    },
    "createdAt": "2019-10-31T13:00:58.191Z",
    "updatedAt": "2019-10-31T13:00:58.191Z"
}
```

Congratulations! You're ready to start using the RW API. To get more familiar with key concepts and features, move on the [concept docs](/concepts.html).