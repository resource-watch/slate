# Query transformations

**While the WRI API aims to make the query interface as broad and transparent as possible, some of the querying options described below will not be available for specific dataset providers, depending on this API's implementation or limitations on the actual data provider's side.**

Additionally to provider-specific limitations, every SQL query is transformed by [the `sql2json` microservice](https://github.com/resource-watch/sql2json), also maintained as [NPM package](https://www.npmjs.com/package/sql2json). There is a first conversion from SQL to JSON, and then from JSON to a SQL syntax that is compatible with [the Elasticsearch SQL plugin](https://github.com/NLPchina/elasticsearch-sql).

You can read more about the limitations of using SQL with Elasticsearch [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-limitations.html).
