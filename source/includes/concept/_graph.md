## Graph

As you have read in the [Dataset concept section](#dataset), one of the main goals of the RW API is to provide a common interface for interacting with data provided by a variety of services. However, given the number of datasets currently hosted in the RW API (2506 at the time of writing), it can be hard to find exactly what dataset you are looking for. It can even be overwhelming to navigate through the datasets list, due to the number of datasets available and the wide range of topics each dataset relates to.

The RW API provides you different ways to search for the information you are looking for: from [searching datasets](#search) by keyword and exploring [dataset metadata](#metadata12), to categorization through the use of [vocabulary and tags](#vocabulary-and-tags). However, none of these options is optimal when it comes to finding similar datasets, related to the ones you find relevant. This is where the Graph service comes to the rescue.

Before jumping to the details of the RW API Graph service, you should be familiar with what a graph is. There are many resources available online for this purpose (e.g. [the Wikipedia entry on graph](https://en.wikipedia.org/wiki/Graph_(abstract_data_type))), but the main concept you must keep in mind is that a graph is a data structure consisting of a set of nodes and a set of edges. A **node** represents an abstract entity, and an **edge** is a connection between two nodes, representative of a relationship between those two nodes. In the context of the RW API's Graph service, nodes represent **concepts** or **datasets**, and edges define relationships of different types between datasets and/or concepts. Relationships can be detailed and specific (for instance, you can use them to find datasets relevant to a given country or continent), but usually, they are more generic, establishing a connection between two datasets or a dataset and a concept.

Using the Graph service, you will be able to explore RW API's datasets from a concept perspective. You will be able to:

* find datasets related to broad concepts such as `solar_energy` or `water_stress`;
* find datasets related to specific properties of the dataset's data like `vector` or `raster`;
* find datasets related to a given dataset;
* infer concepts from a given list of concepts;

The RW API Graph service enables you to build powerful applications, where you can easily and more humanly navigate through your datasets. It gives you the possibility of focusing on topics and concepts each dataset is related to, building UIs geared towards navigation by similarity, as opposed to basic datasets list. A great example of the usage of the Graph service is [Resource Watch's Discover page](https://resourcewatch.org/data/explore).

Head to the [graph endpoint documentation](#graph17) for more details on how you can leverage concepts and relationships to enhance your datasets.