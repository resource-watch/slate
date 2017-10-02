# Jiminy

[Jiminy](https://github.com/vizzuality/jiminy) is a lightweight library that powers this api endopoint whose aim is to infer which type of charts can be obtained from a dataset.

To get the jiminy information from a query, you can do the following request:

**`/jiminy?sql=select <columns> from <dataset.slug or dataset.id> limit <number>`**

In order to retrieve the mentioned information the name of the columns that you want to obtain the data from are required.

<aside class="notice">
Remember — It is mandatory to set a limit value. If you do not set it and the dataset contains a lot of data, jiminy will try to obtain all data at once! This can produce performance issues.
</aside>

> To obtain jiminy information, you have to do a GET with the following query params:

```shell
curl -X GET https://api.resourcewatch.org/v1/jiminy?sql=select <columns> from <dataset.slug or dataset.id> \
-H "Content-Type: application/json"
```

It is possible do a POST too:

```shell
curl -X POST https://api.resourcewatch.org/v1/jiminy \
-H "Content-Type: application/json"  -d \
 '{
   "sql": "select <columns> from <dataset.slug or dataset.id>"
  }'
```

> Real example

```shell
curl -X GET https://api.resourcewatch.org/v1/jiminy?sql=select satellite, confidence, track, acq_date from VIIRS-Active-Fire-Global-1490086842549 limit 1000 \
-H "Content-Type: application/json"
```

The response will be 200 if the query is correct:

```json

{
  "data": {
    "general": ["bar", "line", "pie", "scatter", "1d_scatter", "1d_tick"],
    "byColumns": {
      "satellite": ["bar", "pie"],
      "confidence": ["bar", "pie"],
      "track": ["1d_scatter", "1d_tick"],
      "acq_date": ["1d_scatter", "1d_tick"]
    },
    "byType": {
      "bar": {
        "general": ["satellite", "confidence", "track"],
        "columns": {
          "satellite": ["track"],
          "confidence": ["track"],
          "track": ["satellite", "confidence", "acq_date"],
          "acq_date": ["track"]
        }
      },
      "line": {
        "general": ["track"],
        "columns": {
          "satellite": [],
          "confidence": [],
          "track": ["acq_date"],
          "acq_date": ["track"]
        }
      },
      "pie": {
        "general": ["satellite", "confidence"],
        "columns": {
          "satellite": [],
          "confidence": [],
          "track": [],
          "acq_date": []
        }
      },
      "scatter": {
        "general": ["satellite", "confidence"],
        "columns": {
          "satellite": ["confidence"],
          "confidence": ["satellite"],
          "track": ["satellite", "confidence"],
          "acq_date": ["satellite", "confidence"]
        }
      },
      "1d_scatter": {
        "general": ["track", "acq_date"],
        "columns": {
          "satellite": [],
          "confidence": [],
          "track": [],
          "acq_date": []
        }
      },
      "1d_tick": {
        "general": ["track", "acq_date"],
        "columns": {
          "satellite": [],
          "confidence": [],
          "track": [],
          "acq_date": []
        }
      }
    }
  }
}
```
