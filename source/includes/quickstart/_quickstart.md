# Resource Watch API Quickstart

This quickstart guide will get you up and running with the Resource Watch API. In it, you will:

1. Create an account with the RW API
2. Obtain your JSON Web Token for authentication
3. Make a test request to confirm you're ready to go!

## 1. Create an account with the RW API

To create an account with the RW API, go to the [login](https://api.resourcewatch.org/auth/login) page and register. You can log in using an existing Facebook, Google, or Apple account, or you can register with an email and password.

If you create a new user account using an email and password, a confirmation link will be sent to the email address you provided. You must click this confirmation link in order to activate your account.

After you login, you should see the following message in your browser:

![Auth success](images/authentication/auth-success.png)

## 2. Obtain your JWT for authentication

The RW API uses [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWTs) for authentication. Once you've created an account and logged in, go to [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to get your token.

> Sample response from `/auth/generate-token`

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5c..."
}
```

**Warning**: Treat this token like a password. Don't share it with anyone and store it in a safe place (like a password manager). If someone else gains access to your token, they'll be able to do anything that you would be able to do on the RW API, even without access to your Facebook/Google/Apple login or your email and password.

Once generated, your token is valid until any of the user information (name, email, or associated [applications](/concepts.html#applications)) associated with your account changes. If your token becomes invalid, you can just log in via the browser and go to [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token) to generate a new token.

## 3. Make a test request

> Request your own user information

```shell
curl -X GET "https://api.resourcewatch.org/auth/user/me"
-H "Content-Type: application/json"  -d \
-H "Authorization: Bearer <your-token>" \
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