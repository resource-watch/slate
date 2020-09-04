# Forms

This section details the endpoints provided by the GFW Forms API service.

## Requesting a webinar

> To create a new webinar request, you need to provide at least the following details:

```shell
curl -X POST "https://api.resourcewatch.org/v1/form/request-webinar" \
-H "Content-Type: application/json" \
-d  \
'{
    "name": "Example name",
    "email": "example@email.com",
    "description": "Example description"
}'
```

> Successful response: 204 No Content

In order to request a new webinar, you should make a POST request to the `form/request-webinar` endpoint, providing at least a `name` and an `email` in the request body. You can also optionally provide a `description`.

Webinar requests are pushed into a Google Spreadsheet (using the Google Sheets API). Staging webinar requests are located [here](https://docs.google.com/spreadsheets/d/1JsXX7aE_XlJm-WWhs6wM5IW0UfLi-K9OmOx0mkIb0uA/edit?usp=sharing), and production webinar requests are located [here](https://docs.google.com/spreadsheets/d/1zqiimFua1Lnm9KM4ki_njCaMuRhaPBif30zbvxIZWa4/edit?usp=sharing).

In case of success, this endpoint will return a response with status code `204 No Content`. If an error occurs, a response with status code `500 Internal Server Error` is returned.