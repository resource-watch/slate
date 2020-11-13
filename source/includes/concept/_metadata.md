## Metadata

Understanding the context of data, empowering users to find and make informed decisions about its suitability is another important goal of the Resource Watch API (RW API). For example, a user may be looking to answer questions like, *"Does this dataset provide information about tree cover in my region?"*, *"What are the physical units?"*, *"How was this measured?"*, and *"How should I provide proper attribution to the data provider?"*.

Answers to these questions can be stored in a resource's [metadata](https://guides.ucf.edu/metadata/intrometadata). By definition, metadata is always associated with another entity, such as a [dataset](https://resource-watch.github.io/doc-api/index-rw.html#dataset), [layer](https://resource-watch.github.io/doc-api/index-rw.html#layer) or [widget](https://resource-watch.github.io/doc-api/index-rw.html#widget), and may be further classified into different types, such as descriptive, structural, and/or administrative. Many different general and discipline-specific metadata standards and schemas are [available](http://rd-alliance.github.io/metadata-directory/standards/), each with their pros and cons. However, most types of metadata capture the following core information:

- **Title/Name** – Name given to the resource.
- **Description** – A description of the resource, its spatial, temporal or subject coverage, and its methodology and lineage.
- **Format** – File format, physical medium, dimensions of the resource, or hardware and software needed to access the data.
- **Metadata schema** – Description of the metadata to be provided along with the generated data and a discussion of the metadata standards used, including the version of the schema and where the schema can be found.
- **Rights Holder** – The entities or persons who hold the rights to the data.
- **Rights** – Information about the rights held in and over the resource.
- **Contact information** – Identity of, and means to communicate with, persons or entities associated with the data.

### Metadata in the context of the RW API

The approach adopted by the RW API is to try to follow the main guidelines about metadata standards, whilst offering maximum flexibility by only requiring a limited number of core fields, and allowing the inclusion of unlimited, optional application-specific fields.

As we'll see in further details when covering the metadata endpoints, a RW API metadata object has a few structured but optional fields to capture some of the general details described above, while also allowing you to specify your own custom fields for ease of extension and flexibility.

Each metadata object must also be associated with a dataset, widget, or layer, and must also identify the language in which it's written, as well as the [application](https://resource-watch.github.io/doc-api/index-rw.html#applications) it's associated with. This allows a single resource, say a dataset, to have its metadata translated into different languages, and be adjusted to meet the needs of different applications. We'll go into further details on these when we cover the metadata endpoints in their dedicated section.
