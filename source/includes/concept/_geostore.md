## Geostore

Allowing users to interact with data in the context of geographic data stuctures, such as the boundaries of countries or the location of power plants, is an important goal of the Resource Watch API's (RW API). For example a user maybe looking to answer questions like *"How much tree cover is there in my region?"* or *"How many power-plants are situated on the coast?"*.

Both these questions imply defining the (geographical) boundaries of the question. In the case of regions these are often expressed as bounding polygons, however as seen in the examples above, geographic structures may also represent lines (such as the coast-line) or point (locations of power-plants). All of which are efficiently represented using the [Vector data model](https://www.spatialpost.com/raster-vector-data-model/)  

**Geostore**, **Geostore micro-service**, and **geostore objects** are the RW API's way to provide users the ability to add, use, and communicate their geographic vector-data structures.

A full discussion about the [ways of representing geographic vector-data](https://en.wikipedia.org/wiki/Comparison_of_GIS_vector_file_formats) is beyond the scope of this document, however we have choosen to use [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) as it allows the storage of [simple geographical features](https://en.wikipedia.org/wiki/Simple_Features), and being an extension of [JSON](https://es.wikipedia.org/wiki/JSON) has concepts which are already familar to many developers.

*Note the conventions of this documentation are that geostore objects are data structures, for example an object that describes the boundaries of Spain, Geostore represents the entity that stores geostore objects, for example a database, and Geostore micro-service refers to the REST API for interacting with the Geostore and its geostore objects.* 

### geostore objects

A geostore object represents a geographic structure defined using [GeoJSON](#geojson) which has a [unique identifier]((#geostore-id)). It may also contain summary information about the geometry (such as bounds, area or length), properties used for indexing, and metadata (such as the [provider](#provider-definition) of the data). 

*Note although including extensive Feature properties is allowed in GeoJSON, the design aim is to keep geostore objects as light-weight as possible, thus users should try to keep properties to a minimum.*

[TODO: How does Geostore deal with Feature properties?]

### Geostore ID and hash

A unique identifier for the geoStore object in the form of a 128 bit [MD5 hash](https://en.wikipedia.org/wiki/MD5) generated from the GeoJSON object.

### GeoJSON object

If you are not familiar with GeoJSON this [article](https://developer.here.com/blog/an-introduction-to-geojson) gives a quick overview, for the brave you can also check out the [specifications](https://geojson.org/). When creating objects to add to the Geostore the [JSON Schema docs describing the different GeoJSON object types](https://github.com/geojson/schema) are useful for validation of your data structures.

*Note GeoJSON allows you to store geographic vector-data stuctures in a range of [coordinate reference systems (CRS)](https://en.wikipedia.org/wiki/Spatial_reference_system). The default when reading GeoJSON is to assume data use the World Geodetic System datum (WSG84) and shperical coordinate system (Latitude and Longitude), also called CRS [EPSG:4326](https://spatialreference.org/ref/epsg/wgs-84/). If the data have a different CRS care should be taken to ensure this is included in the `crs` property of the GeoJSON. Geostore does not change (re-project) geometries!*

[TODO: Check how Geostore deals with different CRS!]

### Bounding box

The bounding box represents the [minumum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box) enclosing all of the geometries in the GeoJSON object. It is expressed as an array of the form min Longitude , min Latitude , max Longitude , max Latitude.

### Area

The optional area property contains the total surface area of all Polygon and MultiPolygon geometries in the GeoJSON object.

### Provider object

The optional provider object defines information used to fetch geographic structures from data APIs. At present the only provider definition supported by the Geostore micro-service is a [Carto](https://carto.com/) table, using `"type": "carto"`.

### Info object
The optional info object defines application specific properties, for example used for indexing or related to editting of the geostore object.
