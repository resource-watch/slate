# What is the Resource Watch API?

The RW API is a set of common back-end backend services used to power a number of geospatial data applications, including [Resource Watch](https://resourcewatch.org/), [Global Forest Watch](https://globalforestwatch.org/), and [Aqueduct](https://aqueduct.wri.org). Its capabilities include:

  - Organizing and managing datasets and their associated metadata
  - Configuring dataset visualizations
  - Querying and analyzing geospatial data
  - Managing user accounts and authentication

## Before you get started

The RW API is [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) and [JSON](https://en.wikipedia.org/wiki/JSON) based, and these docs assume you are familiar with both technologies. Besides endpoint descriptions, the documentation will include example code snippets that use [cURL](https://en.wikipedia.org/wiki/CURL) to illustrate how you would use each endpoint. Knowing the basics of cURL will help you better understand those examples. 

For readability, URLs and query parameters in this documentation may be displayed without escaping/encoding, but be sure to encode your URLs before issuing a request to the API, or it may produce undesired results. If you are using the RW API to build your own application, there's probably a library out there that does this for you automatically.

Throughout the docs, you'll find references to a `Authorization: Bearer <your-token>` HTTP header. You can find more details about tokens in the [authentication](reference.html#authentication) section, or by following the [quickstart guide](quickstart.html).

# How these docs are organized

The docs are organized into four sections, described below. You can always navigate between the sections using the links at the top of the left sidebar.

## Getting Started

The [quickstart guide](quickstart.html) will get you up and running with the RW API. In it, you will learn how to create an account, get your JSON Web Token for authentication, and make a test request.
  
If you're new to the API, this is the place to start!

## Concepts

[Concepts](concepts.html) discusses the key features of the RW API at a high level, providing motivation and background for individual features and how they work together. It also discusses common API-wide behaviors, such as caching, sorting, filtering, and pagination.

## Reference

[Reference](reference.html) provides detailed technical reference for each RW API endpoint, including the description of the endpoint's behavior, request and response schema, and error codes.

## Tutorials

[Tutorials](tutorials.html) are step-by-step guides to solving specific problems using the RW API. This is the newest section of the docs and is currently under development, so check back regularly for new tutorials!

# Get in touch!

The RW API and its docs are made by humans who will occasionally make mistakes. If you find something that you think is incorrect, could be improved, if you want to contribute yourself, or just want to say "thank you", you can reach us through [the RW API documentation Github project page](https://github.com/resource-watch/doc-api).