# Authentication

The RW API uses JWT [(JSON Web Tokens)](https://tools.ietf.org/html/rfc7519) to identify and authenticate its users. This token must be provided inside an `Authorization` header, with the form `Bearer: <token>`.

However, in order to perform GET requests for content that is not private, there's no need for any sort of authentication or token.

## How to generate your private token

**Given that CT UI is no longer maintained, visit the next section to know how to get a token from the browser, without using CT UI**

<s>To generate your own token, perform the following steps:</s>

1. <s>Navigate to [here](http://ui.resourcewatch.org/). If you are not logged in yet, the application will redirect you to the login page. You will see the login page:</s>

![Control Tower login page](images/authentication/login.png)

<s>You can login with your WRI credentials (email and password) or with other auth providers (a Google, Facebook, or Twitter account). If you can't remember your password (don't worry! it happens to everyone!) you can reset your password clicking on 'Recover password'.</s>

2. <s>After logging in you will be redirected to the Control Tower application and you will see its front page:</s>
![Control Tower Dashboard](images/authentication/control-tower.png)

3. <s>To obtain your token, click in the Profile menu item and you will see the token:</s>
![Control Tower Profile](images/authentication/profile.png)

4. <s>Copy your token clicking the Copy button. Remember to add the header `Authorization: Bearer: <yourToken>` to any API call to authenticate yourself.</s>

## How to get a token from the browser (without using CT UI)

1. On the browser, go to [the API URL](https://staging-api.globalforestwatch.org/auth/login) (in this case, GFW staging API).
2. Login using your account.
3. Once you are at `auth/success`, go to [the `/auth/generate-token` endpoint](https://staging-api.globalforestwatch.org/auth/generate-token).

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
