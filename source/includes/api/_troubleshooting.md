# Troubleshooting

This section is meant to help you deal with common pitfalls of everyday usage of the API.

## Authentication and authorization 

### 401 Unauthorized

`401 Unauthorized` errors mean that the API did not receive the necessary data to identify who you are. You may not be logged in, there may be an issue with your usage of the user token, or the token you are using may be in the wrong header.

Start by following the steps [detailed here for obtaining your private token](#how-to-generate-your-private-token). At the end you should have your [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token), a large string of random-looking characters.

If you are sure you have an up-to-date token but are still experiencing `401 Unauthorized` errors, there may be an issue with the way the token is transmitted to the API. Be sure to use in `Authorization` header and `Bearer <your token goes here>` value.


### 403 Forbidden

A `403 Forbidden` error means that you are identified as a valid user, but you do not have the required permissions for the action you are trying to perform. Common scenarios where this happens are:
- You do not have the required user `ROLE` to carry out that operation.
- You may be trying to operate on a resource that belongs to a different `application` than the ones you are associated with. Read more about how the `application` field works [here](/index-rw.html#applications).
- Certain resources have a concept of `owner` with certain actions being exclusively available to that particular user.

Check the specific documentation for the endpoint you are trying to use for more details on its behavior. Conditions that trigger a `403 Forbidden` error will often vary beyond the ones listed above.
