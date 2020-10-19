## Geostore

Allowing users to interact with data in the context of geographic data structures, such as the boundaries of countries or the location of power plants, is an important goal of the Resource Watch API (RW API). For example a user maybe looking to answer questions like *"How much tree cover is there in my region?"* or *"How many power-plants are situated on the coast?"*.

Both these questions imply defining the (geographical) boundaries of the question. In the case of regions these are often expressed as bounding polygons, however as seen in the examples above, geographic structures may also represent lines (such as the coast-line) or point (locations of power-plants). All of which are efficiently represented using the [Vector data model](https://www.spatialpost.com/raster-vector-data-model/).

**Geostore**, **Geostore API**, and **Geostore objects** are the RW APIs way to provide users the ability to add, use, and communicate their geographic vector-data structures. Using the Geostore API, you can define geographic spatial representations using [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON). It allows the storage of [simple geographical features](https://en.wikipedia.org/wiki/Simple_Features), and, being an extension of [JSON](https://es.wikipedia.org/wiki/JSON), its format is familiar to API users. A full discussion about the [ways of representing geographic vector-data](https://en.wikipedia.org/wiki/Comparison_of_GIS_vector_file_formats) is beyond the scope of this documentation.

***Note the conventions of this documentation are that Geostore objects are data structures, for example an object that describes the boundaries of Spain. Geostore represents the entity that stores Geostore objects, for example a database. Geostore API refers to the REST API for interacting with the Geostore and its Geostore objects.***

### Geostore objects

A Geostore object represents a geographic structure defined using [GeoJSON](#geojson-object) which has a [unique identifier](#geostore-id-and-hash). It may also contain summary information about the geometry (such as bounds, area or length), properties used for indexing, and metadata (such as the [provider](#provider-object) of the data).

### GeoJSON object

If you are not familiar with GeoJSON this [article](https://developer.here.com/blog/an-introduction-to-geojson) gives a quick overview, for the brave you can also check out the [specifications](https://geojson.org/). Being an Open Standard most [GIS](https://en.wikipedia.org/wiki/Geographic_information_system) support export of GeoJSON, for example [QGIS](https://en.wikipedia.org/wiki/QGIS). If you are creating your own GeoJSON objects the [JSON Schema docs describing the different GeoJSON object types](https://github.com/geojson/schema) can be useful.

Assuming you are now familiar with the basic structure of GeoJSON, next we will highlight some important considerations about how Geostore treats GeoJSON objects.

- GeoJSON objects are always stored and returned as a `FeatureCollection`; when creating a geostore using a `Feature` or `Geometry` it is always converted to a `FeatureCollection`.
- When creating a geostore from a `FeatureCollection` only the first `Feature` is stored, all other features are discarded with no warning.
- Geostore retains all `Feature` properties.
- All geometry types are accepted, except `GeometryCollection`.
- GeoJSON [only supports one geographic coordinate reference system [CRS]](https://tools.ietf.org/html/rfc7946#section-4), using the World Geodetic System 1984 (WGS 84) datum, with longitude and latitude units of decimal degrees. Other CRS are not supported. Geostore does not check for the validity of the coordinate CRS.
- During creation the GeoJSON geometry is checked for geometric validity and, if required, an attempt is made to repair the geometry (using [ST_MakeValid](https://postgis.net/docs/ST_MakeValid.html)).


### What are geostores used for?

Geostores are a core part of many of the analysis and data provided by the API, and the primary way for defining geographical boundaries in the RW API.

Using geostores, you can, for example, create areas of interest and get notified about deforestation and fire alerts in geographical areas of your interest. Using the [GFW website](https://www.globalforestwatch.org/), you can even draw a custom shape of your interest. This shape gets translated into a geostore, which you can then use to subscribe to deforestation and fire alerts.

Additionally, you can query certain RW API datasets providing an ID of a geostore as a query parameter. This will restrict the returned data to the points that fit inside the geostore with ID provided. So you can directly query data specific to a geographic boundary identified by the geostore provided.

The Geostore API also aims at providing a curated list of shapes for ISO country, GADM admin region, or protected areas from WDPA. These endpoints are used by other services in the API as the source of truth for geographic representations.
