# Authentication

The RW API uses JWT [(JSON Web Tokens)](https://tools.ietf.org/html/rfc7519) to identify and authenticate its users. This token must be provided inside an `Authorization` header, with the form `Bearer: <token>`.

However, in order to perform GET requests for content that is not private, there's no need for any sort of authentication or token.

## How to generate your private token

1. On the browser, visit the API's login page at [https://api.resourcewatch.org/auth/login](https://api.resourcewatch.org/auth/login).
2. Login using your account.
3. Once you are at `auth/success`, go to [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to generate a new token.

![Auth success](images/authentication/auth-success.png)

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

## Troubleshooting auth problems

If you are having trouble with authentication, please make sure that you have followed the steps [detailed here for obtaining your private token](#how-to-generate-your-private-token). If you are still having trouble, here's some advice on some of the problems you might find:

* If you receive a response code **401 Unauthorized**, this might mean that you are not providing your token correctly. Double check [here](#authentication) and make sure that you are sending the token in the *Authorization* header and correctly formatted.

* A **403 Forbidden** generically means that you are identified as a valid user, but you do not have the required permissions for the action you are trying to perform. This might mean (*not exclusively*) that you don't have the required apps associated to your user profile to access the application you are trying to access. Check the project where you want to perform requests (for instance, the Resource Watch API uses the `rw` application slug) and check if your user has the correct app. If you need to edit the apps of your user profile, check out the [PATCH auth/me](#update-your-user-account-details) endpoint. If you still were not able to find the problem, confirm the documentation of each endpoint for any endpoint-specific rules that you might be missing.
