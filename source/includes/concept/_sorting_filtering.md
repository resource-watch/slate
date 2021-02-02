## Sorting and Filtering

### Sorting

> Example request sorting by a single condition:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=name
```

> Example request sorting by multiple conditions:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=name,description
```

> Example request sorting by multiple conditions, descending and ascending:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?sort=-name,+description
```

As a rule of thumb, you can sort RW API resources using the `sort` query parameter. Usually, sorting can be performed using any field from the resource schema, so be sure to check each resource's model reference to find which fields can be used for sorting. Sorting by nested model fields is not generally supported, but may be implemented for particular resources. In some exceptional cases, you also have the possibility of sorting by fields that are not present in the resource model (e.g., when fetching datasets, you can sort by `user.name` and `user.role` to sort datasets by the name or role of the owner of the dataset) - be sure to check each resource's documentation to find out which additional sorting criteria you have available.

Multiple sorting criteria can be used, separating them by commas. You can also specify the sorting order by prepending the criteria with either `-` for descending order or `+` for ascending order. By default, ascending order is assumed.

Keep in mind that it’s up to each individual RW API service (dataset, widget, layer, etc) to define and implement the sorting mechanisms. Because of this, the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on sorting.

#### Which services comply with these guidelines

The following endpoints adhere to the Sorting conventions defined above:

* [Get v2 areas endpoint](/index-rw.html#getting-all-user-areas)
* [Get areas endpoint](/index-rw.html#get-user-areas)
* [Get collections endpoint](/index-rw.html#getting-collections-for-the-request-user)
* [Get dashboards endpoint](/index-rw.html#getting-all-dashboards)
* [Get datasets endpoint](/index-rw.html#getting-all-datasets)
* [Get layers endpoint](/index-rw.html#getting-all-layers)
* [Get metadata endpoint](/index-rw.html#getting-all-metadata)
* [Get widgets endpoint](/index-rw.html#getting-all-widgets)

### Filtering

> Example request filtering using a single condition:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?name=viirs
```

> Example request filtering using multiple conditions:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?name=birds&provider=cartodb
```

> Example request filtering by an array field using the `,` OR multi-value separator:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?application=rw,gfw
```

> Example request filtering by an array field using the `@` AND multi-value separator:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset?application=rw@gfw
```

Like in the case of sorting, most RW API resources allow filtering the returned results of list endpoints using query parameters. As a rule of thumb, you can use the API resource's fields as query parameter filters, as shown in the examples on the side. You can also combine different query parameters into a complex `and` logic filter. Note that you can achieve a logical `or` by passing a regular expression with two disjoint options, like this: `?name=<substr_a>|<substr_b>`.

For string type fields, the filter you pass will be interpreted as a regular expression, _not_ as a simple substring filter. This gives you greater flexibility in your search capabilities. However, it means that, if you intend to search by substring, you must escape any regex special characters in the string.

Array fields (like the `application` field present in some of the API resources - read more about the [application field](/index-rw.html#applications)) support more complex types of filtering. In such cases, you can use `,` as an `or` multi-value separator, or `@` as a multi-value, exact match separator.

Object fields expect a boolean value when filtering, where `true` matches a non-empty object and `false` matches an empty object. Support for filtering by nested object fields varies for different API resource, so be sure to check the documentation of the API endpoint for more detailed information.

Again, as in the case of sorting, keep in mind that it’s up to each individual RW API service (dataset, widget, layer, etc) to define and implement the filtering mechanisms. Because of this, the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on filtering and the available fields to use as query parameter filters.

#### Which services comply with these guidelines

The following endpoints adhere to the Filtering conventions defined above:

* [Get all datasets endpoint](/index-rw.html#getting-all-datasets)
* [Get all layers endpoint](/index-rw.html#getting-all-layers)
* [Get all widgets endpoint](/index-rw.html#getting-all-widgets)
* [Get all users endpoint](/index-rw.html#getting-all-users)