## Metadata

Understanding the context of data, empowering users to find and make informed decisions about its suitability is another important goal of the Resource Watch API (RW API). For example, a user may be looking to answer questions like, *"Does this dataset provide information about tree cover in my region?"*, *"What are the physical units?"*, *"How was this measured?"*, and *"How should I provide proper attribution to the data provider?"*.

Answers to these questions can be stored in a resource's [metadata](https://guides.ucf.edu/metadata/intrometadata). By definition, metadata is always associated with another entity. In the context of the RW API, a metadata object will always contain information about either a [dataset](https://resource-watch.github.io/doc-api/index-rw.html#dataset), a [layer](https://resource-watch.github.io/doc-api/index-rw.html#layer) or a [widget](https://resource-watch.github.io/doc-api/index-rw.html#widget).

Content-wise, the RW API aims to provide a good balance between structure and flexibility with its metadata service, providing a group of common fields you'll find on all metadata elements, as well as giving API users the tools to create metadata that meets the individual needs of their applications. Through a mix of both types of fields, these are some of the recommended information you should aim to provide when specifying the metadata for one of your resources:

- **Title/Name** – Name given to the resource.
- **Description** – A description of the resource.
- **Author** – The entities or persons produced the data.
- **Source** – Where the original data was sourced from, and how to access said source.
- **Contact information** – A way to contact the author.
- **Schema** – Description of the data structure, like column names, types, descriptions, etc.
- **License** – Information about the rights held in and over the resource.

As we'll see in further details when covering the metadata endpoints, a RW API metadata object has a few structured but optional fields to capture some of the general details described above, while also allowing you to specify your own custom fields for ease of extension and flexibility, should you want to provide additional levels of detail about your resources. It will also give you the tools to only specify a subset of the suggested elements above, should you decide to use that approach.

Besides being associated with a single RW API resource (dataset, widget, or layer), a metadata element and must also identify the language in which it's written, as well as the [application](https://resource-watch.github.io/doc-api/index-rw.html#applications) it's associated with. This allows a single resource, say a dataset, to have its metadata translated into different languages, and be adjusted to meet the needs of different applications. We'll go into further details on these when we cover the metadata endpoints in their dedicated section.
