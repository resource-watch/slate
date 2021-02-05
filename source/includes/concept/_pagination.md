## Pagination

> Example request where default pagination is applied, returning one page of 10 elements (1st - 10th elements):

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset
```

> Example request fetching the 3rd page of 10 elements (21st - 30th elements):

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?page[number]=3
```

> Example request fetching the 5th page of 20 elements (81st - 100th elements):

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?page[number]=5&page[size]=20
```

Many times, when you're calling RW API's list endpoints, there will be a lot of results to return. Without pagination, a simple search could return hundreds or even thousands of elements, causing extraneous network traffic. For that reason, many services list their resources as pages, to make sure that not only responses are easier to handle, but also that services are scalable. Most paginated results have a built-in default limit of 10 elements, but we recommend you always explicitly set the limit parameter to ensure you know how many results per page you'll get. 

The pagination strategy used across the RW API relies on two query parameters:

Field          | Description                                                                      | Type   | Default
-------------- | -------------------------------------------------------------------------------- | -----: | --------:
`page[size]`   | The number elements per page. **Values above 100 are not officially supported.** | Number | 10
`page[number]` | The page number.                                                                 | Number | 1

Keep in mind that, to work predictably, **you must always specify sorting criteria when fetching paginated results**. If sorting criteria is not provided, the overall order of the elements might change between requests. Pagination will still work, but the actual content of the pages might show missing and/or duplicate elements. Refer to the [general sorting guidelines](concepts.html#sorting) and the sorting section for the RW API resource you're loading for details on sorting options available for that resource type.

Once again, keep in mind that it’s up to each individual RW API service (dataset, widget, layer, etc) to define and implement the pagination strategy. Because of this, the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on how to correctly paginate your list requests.

### Structure of a paginated response

> Example request where default pagination is applied:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset
```

> Example paginated response:

```json
{
    "data": [
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...}
    ],
    "links": {
        "self": "http://api.resourcewatch.org/v1/dataset?page[number]=1&page[size]=10",
        "first": "http://api.resourcewatch.org/v1/dataset?page[number]=1&page[size]=10",
        "last": "http://api.resourcewatch.org/v1/dataset?page[number]=99&page[size]=10",
        "prev": "http://api.resourcewatch.org/v1/dataset?page[number]=1&page[size]=10",
        "next": "http://api.resourcewatch.org/v1/dataset?page[number]=2&page[size]=10"
    },
    "meta": {
        "size": 10,
        "total-pages": 99,
        "total-items": 990
    }
}
```

Paginated responses return a JSON object containing 3 data structures:

* `data` is an array containing the actual list of elements which results from applying the pagination criteria specified in the `page[number]` and `page[size]` query parameters;
* `links` is a helper object that provides shortcut URLs for commonly used pages, using the same criteria applied in the initial request:
    * `self` contains the URL for the current page;
    * `first` contains the URL for the first page;
    * `last` contains the URL for the last page;
    * `prev` contains the URL for the previous page;
    * `next` contains the URL for the next page;
* `meta` is an object containing information about the total amount of elements in the resource you are listing:
    * `size` reflects the value used in the `page[size]` query parameter (or the default size of 10 if not provided);
    * `total-pages` contains the total number of pages, assuming the page size specified in the `page[size]` query parameter;
    * `total-items` contains the total number of items;

### Which services comply with these guidelines

The following endpoints adhere to the pagination conventions defined above:

* [Areas service](reference.html#areas)
* [Areas v2 service](reference.html#areas-v2)
* [Collections service](reference.html#collections)
* [Dashboards service](reference.html#dashboard)
* [Datasets service](reference.html#dataset)
* [Layers service](reference.html#layer)
* [Tasks service](reference.html#tasks)
* [Users service](reference.html#user-management)
* [Widgets service](reference.html#widget)
