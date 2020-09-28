## Geostore

Allowing users to interact with data in the context of geographic data structures, such as the boundaries of countries or the location of power plants, is an important goal of the Resource Watch API (RW API). For example a user maybe looking to answer questions like *"How much tree cover is there in my region?"* or *"How many power-plants are situated on the coast?"*.

Both these questions imply defining the (geographical) boundaries of the question. In the case of regions these are often expressed as bounding polygons, however as seen in the examples above, geographic structures may also represent lines (such as the coast-line) or point (locations of power-plants). All of which are efficiently represented using the [Vector data model](https://www.spatialpost.com/raster-vector-data-model/)  

**Geostore**, **Geostore micro-service**, and **geostore objects** are the RW APIs way to provide users the ability to add, use, and communicate their geographic vector-data structures.

A full discussion about the [ways of representing geographic vector-data](https://en.wikipedia.org/wiki/Comparison_of_GIS_vector_file_formats) is beyond the scope of this document, in short we have chosen to use [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) as it allows the storage of [simple geographical features](https://en.wikipedia.org/wiki/Simple_Features), and being an extension of [JSON](https://es.wikipedia.org/wiki/JSON) has concepts which are already familiar to many developers.

***Note the conventions of this documentation are that geostore objects are data structures, for example an object that describes the boundaries of Spain, Geostore represents the entity that stores geostore objects, for example a database, and Geostore micro-service refers to the REST API for interacting with the Geostore and its geostore objects.***

### geostore objects

A geostore object represents a geographic structure defined using [GeoJSON](#geojson-object) which has a [unique identifier]((#geostore-id-and-hash)). It may also contain summary information about the geometry (such as bounds, area or length), properties used for indexing, and metadata (such as the [provider](#provider-definition) of the data).

#### GeoJSON object

If you are not familiar with GeoJSON this [article](https://developer.here.com/blog/an-introduction-to-geojson) gives a quick overview, for the brave you can also check out the [specifications](https://geojson.org/). Being an Open Standard most [GIS](https://en.wikipedia.org/wiki/Geographic_information_system) support export of GeoJSON, for example [QGIS](https://en.wikipedia.org/wiki/QGIS). If you are creating your own GeoJSON objects the [JSON Schema docs describing the different GeoJSON object types](https://github.com/geojson/schema) can be useful.

Assuming you are now familiar with the basic structure of GeoJSON, next we will highlight some important considerations about how Geostore treats GeoJSON objects.

- Geojson objects are always stored and returned as a `FeatureCollection`; when creating a geostore using a `Feature` or `Geometry` it is always converted to a `FeatureCollection`.
- When creating a geostore from a `FeatureCollection` only the first `Feature` is stored, all other features are discarded with no warning.
- Geostore retains all `Feature` properties.
- All geometry types are accepted, except `GeometryCollection`.
- GeoJSON [only supports one geographic coordinate reference system [CRS]](https://tools.ietf.org/html/rfc7946#section-4), using the World Geodetic System 1984 (WGS 84) datum, with longitude and latitude units of decimal degrees. Other CRS are not supported. Geostore does not check for the validity of the coordinate CRS.
- During creation the GeoJSON geometry is checked for geometric validity and, if required, an attempt is made to repair the geometry (using [ST_MakeValid](https://postgis.net/docs/ST_MakeValid.html)).

### Geostore ID and hash

A unique identifier for the geoStore object in the form of a 128 bit [MD5 hash](https://en.wikipedia.org/wiki/MD5) generated from the GeoJSON object after being processed by Geostore with the considerations described above. This means that each identifier is a unique fingerprint of the GeoJSON string; adding an exact copy of your GeoJSON will generate the same hash, but if it is changed in *any way* it will have a different hash. Note that these changes maybe by adding properties or other fields, not only by changing the geometry.

[TODO: Describe behavior when adding exact same GeoJSON. Is the geostore overwritten, no action?]

### Bounding box

The bounding box represents the [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box) enclosing all of the geometries in the GeoJSON object. It is expressed as an array of the form min Longitude , min Latitude , max Longitude , max Latitude.

### Area

The area property contains the total surface area of all Polygon and MultiPolygon geometries in the GeoJSON object. Note if the Geometry is type `Point` or `LineString` a value of zero is given.

### Provider object

The optional provider object defines information used to fetch geographic structures from data APIs. At present the only provider definition supported by the Geostore micro-service is a [Carto](https://carto.com/) table, using `"type": "carto"`.

### Info object

The optional info object defines application specific properties, for example used for indexing or related to editing of the geostore object. These should not usually be set by the user.
