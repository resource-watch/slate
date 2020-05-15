## Layer

Apart from the possibility of fetching data from multiple data sources using a common interface, the RW API provides you with features to help you visualize such data. A **layer** is one of the resources that you can use to help you make custom visualizations for your data, and they play a very important role when visualizing datasets that contain geospatial data.

Layers were born with the intent of being a visual specification of how the data of a dataset should be styled - the layer object contains the visual specification for the data of the dataset. This visual specification can be namespaced for each application consuming the layer, allowing different applications to consume the same dataset, but with a completely different style.

As it was said above, layers are especially important in the case of geospatial data. Maps are usually the best way of visualizing data that is geo-referenced, and it's in this case that layers become powerful. You can store in the layer object the configuration objects needed for styling layers across different visualization libraries: for instance, [Leaflet](https://leafletjs.com/), [Mapbox](https://www.mapbox.com/) or even use custom library to manage your layers, such as the [LayerManager](https://github.com/Vizzuality/layer-manager).

In the [layer endpoint documentation](#layer8), we'll go into more detail on how you can manage layers, as well as the existing limitations that you might run into when using layers. However, for now, there are 3 high-level ideas that you should keep in mind:

### The layer does not interact with dataset data

Layers store visual configurations needed for styling a given dataset's data. However, they do not interact with the dataset data in any way. It is your responsibility, as a RW API user, to build the appropriate queries to retrieve the data that you want to display (read more about [datasets](#dataset) or [how you can query datasets to obtain their data](#query)). Remember, use layers as a complement of dataset queries, not instead.

### Most of layer fields are free-form

Many of the fields in the layer object are free-form, meaning the RW API does not apply any restriction to whatever is saved in those fields. This is great, because it allows for a very high level of flexibility for users, but it is also not good, since it makes the job of documenting what you can do with layers much harder. We tried our best to provide consistent specifications for all the fields of a layer, but keep in mind that this high level of flexibility might sometimes make it harder for you to understand how you can properly use layers.

### Different applications use layers in different ways

At the moment, most applications using the layer endpoints have adapted layers to tailor fit their needs, taking advantage of the flexibility that free-form fields bring. This means that, when navigating through the catalog of available layers, you might run into very different ways of implementing and using layers. Once again, we will try our best to cover the different ways of using and managing layers, but keep in mind that there is currently no standard way of using layers.
