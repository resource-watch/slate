# Authentication

The RW API provides most of its data through endpoints that are available to all users, without requiring any form of registration. However, some actions, like uploading data or flagging a resource as a favourite, require having a user account and using an access token when issuing requests to the API.

In this section you will learn the very basics of how you can quickly create a user account and use your token to authenticate requests. For more in-depth details on authentication, token and user management, refer to the [User Management](#user-management) section of the documentation.

## Logging in or registering a new user account

The easiest way to access your account is through the [login page](https://api.resourcewatch.org/auth/sign-up) of the RW API. Here you can authenticate using your existing Facebook, Google, Twitter or Apple account, or you can register or login using your email address and password. 

*Note: if you create a new user account using email and password, a confirmation link will be sent to the email address you provided. Your account will only be active once you've clicked the link in that email, so ensure that you use a valid email address. If you don't receive this email message within a few minutes, check your spam.*

Once you've successfully logged in using your browser, you'll see a "Welcome to the RW API message" on your browser. You can now generate user tokens.

![Auth success](images/authentication/auth-success.png)

## How to generate your private token

The RW API uses JWT [(JSON Web Tokens)](https://tools.ietf.org/html/rfc7519) tokens to identify and authenticate its users. If your are not familiar with the details of JWT, just think of them as a very long strings of characters that you need to attach to your requests to the RW API, to prove that you are you.

To get you token, you first need to login using your browser and the steps above. No matter which login strategy you prefer, once you've logged in, you can visit [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to get your token.

**Warning**: treat a token in the same way you would treat a password - don't share it and always store it in a safe place (like a password manager, for example). A token is sufficient to authenticate you on the RW API, meaning that, if someone else gains access to your token, they'll be able to do anything that you would be able to do on the RW API, even without access to your Facebook/Google/Twitter/Apple login or your email and password.

## How to use your private token to authenticate a request

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
