# About these docs

This documentation page aims to cover the Resource Watch API functionality and details. In it, you'll find a top-level description of the services it provides, as well as a breakdown of the different endpoints, their functionality, parameters and output. The goal is to give you the tools to create powerful applications and data products.

The RW API is [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) and [JSON](https://en.wikipedia.org/wiki/JSON) based, and these docs assume you are familiar with both technologies. Besides endpoint descriptions, the documentation will include example code snippets that use [cURL](https://en.wikipedia.org/wiki/CURL) to illustrate how you would use each endpoint. Knowing the basics of cURL will help you better understand those examples. 

For readability, URLs and query parameters may be displayed without escaping/encoding, but be sure to encode your URLs before issuing a request to the API, or it may produce undesired results. If you are using the RW API to build your own application, there's probably a library out there that does this for you automatically.

In these examples, you'll also find references to a `Authorization: Bearer <your-token>` HTTP header. You can find more details about tokens in the [authentication](#authentication) section, which you should read before you get started.   

Last but not least, the RW API and its docs are made by humans, who will occasionally make mistakes. If you find something that you think is incorrect, could be improved, if you want to contribute yourself, or just want to say "thank you", you can reach us through [the RW API documentation Github project page](https://github.com/resource-watch/doc-api).
