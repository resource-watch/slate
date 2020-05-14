## Query

In the previous section, we covered the concept of a RW API dataset which, in simple terms, is a way to tell the RW API that your data exists, and where. While cataloging datasets in a public repository is useful, making that data easily accessible is one of the main goals of the RW API. This is where **queries** come in.

In the context of the RW API, a dataset query is very similar an [SQL](https://en.wikipedia.org/wiki/SQL) query would be to a database - it's a specially crafted statement that allows you to express what data you want, from which dataset, and with which structure. The RW API will use that query to get you the data you need, in the format you asked for, so that it's easy to use in the context of your applications. While it doesn't comply (nor does it attempt to) with any of the formal [SQL](https://en.wikipedia.org/wiki/SQL) specifications, RW API queries use a SQL-like syntax that will be very familiar to anyone who has worked with a relational database in the past. If that's not your case, there are many tutorials out there that will help you learn the basics in no time. 

Using this common, SQL-based syntax, RW API queries allow you to query its datasets using a common API and syntax, no matter where the actual underlying data is hosted. Querying a carto dataset is the same as querying a JSON document or a BigQuery table. This is one of the main goals of the RW API, and one of most valuable features we offer you, the end user - using a single tool and language, you can quickly query data from a wide range of sources, on a broad set of topics.

In the [query endpoint documentation](#query9) below, we'll go into more detail on how you can submit your queries to the API, the specifics of more advanced operations and detailed limitations of querying the RW API but, for now, there are 3 high-level ideas that you should keep in mind:

### All queries should be `SELECT` queries

Querying in the RW API is meant to be used only to read data, not to manipulate it. If you have used SQL before, you know it can be used to modify data, but that's not the approach used in the RW API. If you'd like to modify the data of a dataset, you should use the [dataset update](#updating-a-dataset) endpoints instead.


### Not all SQL constructs are supported

If you've used SQL in the past, you know how powerful (and complex) it can be. Things like nested queries or joins can be hard to use and even more to maintain, even without the added complexity of an environment where multiple data providers coexist. That's why the RW API limits its support to basic SQL syntax, so we can focus on delivering a tool that's simple and easy to use for most users. The [supported SQL syntax reference](#supported-sql-syntax-reference) section below will go into more detail on what's supported and what's not, and will help you understand the specifics of what you can achieve with RW API queries.


### Some operation will depend on the provider of the dataset you're querying

Our goal is to provide a common querying interface across all datasets, independent of their provider. While we believe we've achieved it in most cases, RW API queries can only be as powerful as the underling provider (and their own APIs) allows them to be. There are cases in which a given SQL construct or function is supported for a given provider, but not for another. The [supported SQL syntax reference](#supported-sql-syntax-reference) below has more details on these limitations, per provider.  
