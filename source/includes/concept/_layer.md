## Layer

Apart from the possibility of fetching data from multiple data sources using a common interface, the RW API provides you with features to help you visualize such data. A **layer** is one of the resources that you can use to help you make custom visualizations for your data, and they play a very important role when visualizing datasets that contain geospatial data.

A layer is a visual specification of how the data of a dataset can be rendered and styled on a map. It stores data that will help your applications render dataset data as a map layer, using tools like [Leaflet](https://leafletjs.com/), [Mapbox](https://www.mapbox.com/) or [Layer Manager](https://github.com/Vizzuality/layer-manager). In this sense, it's important to emphasise that a layer object does not store the actual data to be represented - it instead stores the information that those rendering tools will use to render your data. Rephrasing it: the data should come from the dataset (through queries), while a layer provides the information about how that data is meant to be rendered by the corresponding rendering tool.

In the [layer endpoint documentation](#layer8), we'll go into more detail on how you can manage layers, as well as the existing limitations that you might run into when using layers. However, for now, there are 3 high-level ideas that you should keep in mind:

### The layer does not interact with dataset data

Layers store visual configurations needed for rendering styling a given dataset's data. However, they do not interact with the dataset data in any way. It is your responsibility, as a RW API user, to build the appropriate queries to retrieve the data that you want to display (read more about [datasets](#dataset) or [how you can query datasets to obtain their data](#query)). Remember, use layers as a complement of dataset queries, not a replacement.

### Most of layer fields are free-form

Many of the fields in the layer object are free-form, meaning the RW API does not apply any restriction to whatever is saved in those fields. This is great, because it allows for a very high level of flexibility for users, but has the downside of making it harder to document how to use layers. We tried our best to provide clear and consistent specifications for all the fields of a layer, but keep in mind that this high level of flexibility makes it harder to deliver a concrete description.

### Different applications and rendering tools use layers in different ways

At the moment, most applications using the layer endpoints have adapted layers to tailor fit their needs, taking advantage of the flexibility that free-form fields bring. This means that, when navigating through the catalog of available layers, you might run into very different ways of implementing and using layers. Once again, we will try our best to cover the different ways of using and managing layers, but keep in mind that there is currently no standard way of using layers.

As layers are typically managed within the realm of a RW API based application, they typically contain data that covers the needs of that application's specific rendering tool. This again means that you may find varying structure in the data contained in a layer.
