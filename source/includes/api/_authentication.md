# Authentication

The RW API uses JWT [(JSON Web Tokens)](https://tools.ietf.org/html/rfc7519) to identify and authenticate its users. This token must be provided inside an `Authorization` header, with the form `Bearer: <token>`.

However, in order to perform GET requests for content that is not private, there's no need for any sort of authentication or token.

## How to generate your private token

1. On the browser, visit the API's login page at [https://api.resourcewatch.org/auth/login](https://api.resourcewatch.org/auth/login).
2. Login using your account.
3. Once you are at `auth/success`, go to [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to generate a new token.

![Auth success](images/authentication/auth-success.png)

Once generated, a token is valid until any of the associated user information (name, email, or associated applications) changes. If your token becomes invalid, you will need to log in and go to [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to generate a new token.

## How to create a new user

To create a new user make a request like the one in the sidebar:

```shell
curl -X POST https://api.resourcewatch.org/auth/user \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "email":"<email>",
    "role":"<role>",
    "extraUserData": {
      "apps": [
        "<apps>"
      ]
    }
}'
```

There are three allowed roles: `USER`, `MANAGER` and `ADMIN`. The 'apps' field only permits applications that are powered by the API: `rw`, `gfw`, `prep`, etc.
