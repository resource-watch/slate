# Authentication

The RW API uses JWT [(JSON Web Tokens)](https://tools.ietf.org/html/rfc7519) to identify and authenticate its users.

## How to generate your own token

To generate your own token, follow the next steps:

1. Navigate to [http://ui.resourcewatch.org/](http://ui.resourcewatch.org/)
If you aren't logged in yet, the application will redirect you to the login page.
You will see:
![Control Tower login page](images/authentication/login.png)

You can login with your WRI credentials (email and password) or with other auth providers (a Google, Facebook, or Twitter account). If you don't remember your password (don't worry! it happens to everyone!) you can reset your password clicking on 'Recover password'.

2. After logging in you will be redirected to the Control Tower application and you will see:
![Control Tower Dashboard](images/authentication/control-tower.png)

3. To obtain your token, click in the Profile menu item and you will see:
![Control Tower Profile](images/authentication/profile.png)

4. Copy your token clicking the Copy button. Remember to add the header `Authorization: Bearer: <yourToken>` to any API call to authenticate yourself.

## How to create a new user

To create a new user make the request on the right:

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

There are three allowed roles: USER, MANAGER and ADMIN. The 'apps' field only permits applications that are powered by the API: 'rw', 'gfw', 'prep', etc.
