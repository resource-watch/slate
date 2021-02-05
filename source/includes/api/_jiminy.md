# Jiminy

> Example jiminy GET request providing the SQL as query param:

```shell
curl -X GET 'https://api.resourcewatch.org/v1/jiminy?sql=SELECT col_1, col_2 FROM <dataset.id> limit <number>' \
-H "Content-Type: application/json"
```

> Example jiminy POST request providing the SQL in the request body:

```shell
curl -X POST 'https://api.resourcewatch.org/v1/jiminy' \
-H "Content-Type: application/json" \
-d '{
   "sql": "SELECT col_1, col_2 FROM <dataset.id> limit <number>"
  }'
```

> Example with real data:

```shell
curl -X GET 'https://api.resourcewatch.org/v1/jiminy?sql=SELECT iso, name_0, name_1, type_1 FROM 098b33df-6871-4e53-a5ff-b56a7d989f9a limit 10' \
-H "Content-Type: application/json"
```

The `jiminy` endpoint of the RW API makes use of the [Jiminy](https://github.com/vizzuality/jiminy) library in order to infer which type of charts can be obtained from a the execution of a SQL query on a given dataset. For a better understanding of this endpoint, it is recommended to read beforehand on how to [query datasets](reference.html#querying-datasets).

To use this endpoint and infer the charts that you can build from a result set, you must provide a valid SQL query. This query should contain the name of the columns for which you want to infer the chart types - the usage of the wildcard selector (`SELECT *`) in the SQL query is not supported by this endpoint.

**Note: You must set a limit value to the SQL query provided. If you do not set it and the dataset contains a lot of data, this endpoint will try to obtain all data at once, which can result in performance issues.**

Likewise with `query` and `download` endpoints, you can either provide the SQL as query param in a GET request, or in the body of the request as a POST request - read more [here](reference.html#alternative-ways-for-querying-datasets). Using the GET request is the recommended approach, as it allows HTTP caching of your result - subsequent requests for the same `jiminy` endpoint call will see a great performance increase, even if they are made by a different application or client. Alternatively, you can also call the `jiminy` endpoint using a POST request. POST requests are not cached, so you will not benefit from these speed improvements. However, GET requests can sometimes hit URL length restrictions, should your SQL query string be too long. Using a POST request is the recommended solution for these cases.

## Jiminy response body

> Example of successful response:

```json
{
    "data": {
        "general": [
            "bar",
            "pie",
            "scatter"
        ],
        "byColumns": {
            "iso": [
                "bar",
                "pie"
            ],
            "name_0": [
                "bar",
                "pie"
            ],
            "name_1": [
                "bar",
                "pie"
            ],
            "type_1": [
                "bar",
                "pie"
            ]
        },
        "byType": {
            "bar": {
                "general": [
                    "iso",
                    "name_0",
                    "name_1",
                    "type_1"
                ],
                "columns": {
                    "iso": [],
                    "name_0": [],
                    "name_1": [],
                    "type_1": []
                }
            },
            "line": {
                "general": [],
                "columns": {
                    "iso": [],
                    "name_0": [],
                    "name_1": [],
                    "type_1": []
                }
            },
            "pie": {
                "general": [
                    "iso",
                    "name_0",
                    "name_1",
                    "type_1"
                ],
                "columns": {
                    "iso": [],
                    "name_0": [],
                    "name_1": [],
                    "type_1": []
                }
            },
            "scatter": {
                "general": [
                    "iso",
                    "name_0",
                    "name_1",
                    "type_1"
                ],
                "columns": {
                    "iso": [
                        "name_0",
                        "name_1",
                        "type_1"
                    ],
                    "name_0": [
                        "iso",
                        "name_1",
                        "type_1"
                    ],
                    "name_1": [
                        "iso",
                        "name_0",
                        "type_1"
                    ],
                    "type_1": [
                        "iso",
                        "name_0",
                        "name_1"
                    ]
                }
            },
            "1d_scatter": {
                "general": [],
                "columns": {
                    "iso": [],
                    "name_0": [],
                    "name_1": [],
                    "type_1": []
                }
            },
            "1d_tick": {
                "general": [],
                "columns": {
                    "iso": [],
                    "name_0": [],
                    "name_1": [],
                    "type_1": []
                }
            }
        }
    }
}
```

For a successful response, the response body is a JSON object containing a single index `data`, which describes the type of charts that can be obtained from the query provided. The following fields are usually present in the `data` object:

<!---
<span class="code-wrap">...</span> below forces the code the wrap. Without this, the table is horrendously wide.
See line 467 in screen.css.scss
-->

Field     | Type  | Description | Example
--------- | ----- | ----------- | ---------
data.general | Array | An array of distinct charts that can be used to represent the data of the query. | <span class="code-wrap">`["bar", "pie"]`</span>
data.byColumns | Object | An object where the keys are the columns provided in the SQL query. For each the, its value is an array with the names of the charts that might be used to represent the data from the column in the key. | <span class="code-wrap">`{ "iso": ["bar", "pie"], "name_0": ["bar", "pie"] },`</span>
data.byType | Object | An object where the keys are all the charts supported by Jiminy. The values will contain the column names of the query execution that might be used to display the chart type in the key. If the chart type was not included in the `data.general` field of the response body, its content will likely be empty. | <span class="code-wrap">`{ "bar": { "general": ["iso", "name_0", "name_1", "type_1"], "columns": { "iso": [], "name_0": [], "name_1": [], "type_1": [] } } }`</span>

## Jiminy execution errors

The `jiminy` endpoint might sometimes return an error response. The following table describes the possible errors that can occur when calling this endpoint:

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | SQL o FS required | The required `sql` field is missing either as query string parameter or in the request body.
500            | Internal server error | The error message might vary in this case.

## Jiminy endpoint parameters

The `jiminy` endpoint makes use of a single query parameter, which is required for a successful call of the endpoint:

Query parameter        | Description                                                                  | Type        | Required |
---------------------- | ---------------------------------------------------------------------------- | ----------- | -------- |
sql                    | The SQL query which will be the basis for inferring the chart types.         | String      | Yes      |
