# Authentication

Most RW API endpoints are public, but some actions require user authentication. Each endpoint's documentation will specify whether authentication is required and under whate conditions.

The RW API uses JSON Web Tokens to authenticate requests. Check out the [Quickstart Guide](quickstart.html) for instructions on how to create an account and generate a token.

Authentication is performed using bearer auth. For all authenticated requests, you must provide your JWT using the header `Authorization: Bearer <your token>`.

If you lose your JWT, or if it becomes invalidated (which happens whenever the name, email, or applications associated with your account changes), you can always [log in via the browser](https://api.resourcewatch.org/auth/login) and generate a new token at [https://api.resourcewatch.org/auth/generate-token](https://api.resourcewatch.org/auth/generate-token).
