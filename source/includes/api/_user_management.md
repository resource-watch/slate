# User Management

The following endpoints expose the API's functionality regarding user management.
For more information or implementation details, see [the source code](https://github.com/control-tower/ct-oauth-plugin).

## Login (email + password)

- GET '<BASE API URL>/auth/' - Basic API auth login page
- GET '<BASE API URL>/auth/login' - Basic API auth login page
- POST '<BASE API URL>/auth/login' - Endpoint for email + password based login

```bash
# Email + password based login
curl -X POST http://localhost:9000/auth/login \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com",
    "password":"potato"
}'
```


- GET '<BASE API URL>/auth/fail' - Displays login errors
- GET '<BASE API URL>/auth/check-logged' - Check login status
- GET '<BASE API URL>/auth/success' - Successful login page
- GET '<BASE API URL>/auth/logout' - Login invalidation endpoint
- GET '<BASE API URL>/auth/generate-token' - Generates a JWT token for the current user session.

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

- GET '<BASE API URL>/auth/sign-up' - Account creation page, for accounts using email + password based login
- POST '<BASE API URL>/auth/sign-up' - Account creation endpoint, for accounts using email + password based login

```bash
# Account creation using email + password
curl -X POST http://localhost:9000/auth/sign-up \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com",
    "password":"potato",
    "repeatPassword":"potato"
}'
```

- GET '<BASE API URL>/auth/confirm/:token' - Endpoint used in the user validation email to confirm the address upon registration

## Password recovery

- GET '<BASE API URL>/auth/reset-password' - Displays the password reset form page.
- POST '<BASE API URL>/auth/reset-password' - Endpoint where the password reset request is sent.

```bash
# Password reset
curl -X POST http://localhost:9000/auth/reset-password \
-H "Content-Type: application/json"  -d \
 '{
    "email":"your-email@provider.com"
}'
```
- GET '<BASE API URL>/auth/reset-password/:token' - Endpoint used to validate email address upon password reset request.
- POST '<BASE API URL>/auth/reset-password/:token' - Endpoint used to submit the new password.

```bash
# New password submission
curl -X POST http://localhost:9000/auth/reset-password/<email token> \
-H "Content-Type: application/json"  -d \
 '{
    "password":"potato",
    "repeatPassword":"potato"
}'
```

## User management

- GET '<BASE API URL>/auth/user' - Lists currently active users
- GET '<BASE API URL>/auth/user/:id' - Shows info for user with the given id
- POST '<BASE API URL>/auth/user' - Creates a new user
- PATCH '<BASE API URL>/auth/user/me' - Updates current user details
- PATCH '<BASE API URL>/auth/user/:id' - Updates specified user details
