# Jiminy

> Example jiminy GET request providing the SQL as query param:

```shell
curl -X GET https://api.resourcewatch.org/v1/jiminy?sql=select <columns> from <dataset.slug or dataset.id> \
-H "Content-Type: application/json"
```

> Example jiminy POST request providing the SQL in the request body:

```shell
curl -X POST https://api.resourcewatch.org/v1/jiminy \
-H "Content-Type: application/json"  -d \
 '{
   "sql": "select <columns> from <dataset.slug or dataset.id>"
  }'
```

> Example with real data:

```shell
curl -X GET https://api.resourcewatch.org/v1/jiminy?sql=SELECT iso, name_0, name_1, type_1 FROM 098b33df-6871-4e53-a5ff-b56a7d989f9a limit 10 \
-H "Content-Type: application/json"
```

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

[Jiminy](https://github.com/vizzuality/jiminy) is a lightweight library that aims to infer which type of charts can be obtained from a the execution of a SQL query on a given dataset.

In order to retrieve this information, you must provide a valid SQL query with the name of the columns that you want to obtain the data. *It is mandatory to set a limit value to the SQL query provided. If you do not set it and the dataset contains a lot of data, jiminy will try to obtain all data at once, which can result on performance issues.*

To get the Jiminy information from a SQL query, you can perform the following request:

`/jiminy?sql=select <columns> from <dataset.slug or dataset.id> limit <number>`

The response body will contain a `data` index, which is an object. This object describes the type of charts that can be obtained from the query provided. The following fields are usually present in the `data` object

Field     | Type  | Description | Example
--------- | ----- | ----------- | ---------
data.general | Array | An array of distinct charts that can be used to represent the data of the query. | `["bar", "pie"]`
data.byColumns | Object | An object where the keys are the columns provided in the SQL query. For each the, its value is an array with the names of the charts that might be used to represent the data from the column in the key. | `{ "iso": ["bar", "pie"], "name_0": ["bar", "pie"] },`
data.byType | Object | An object where the keys are all the charts supported by Jiminy. The values will contain the column names of the query execution that might be used to display the chart type in the key. If the chart type was not included in the `data.general` field of the response body, its content will likely be empty. | `{ "bar": { "general": ["iso", "name_0", "name_1", "type_1"], "columns": { "iso": [], "name_0": [], "name_1": [], "type_1": [] } } }`

Calling this endpoint might sometimes result in an error being returned. The following table describes the possible errors that can occur when querying datasets:

Error code     | Error message  | Description
-------------- | -------------- | --------------
400            | SQL o FS required | The required `sql` field is missing either as query string parameter or in the request body.
500            | Internal server error | The error message might vary in this case.
