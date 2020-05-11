# Concepts

## Dataset

One of the Resource Watch API's (RW API) goals is to provide a common interface for interacting with data hosted in different sources and formats. A **Dataset** is the Resource Watch's API way of providing users with access to data, while trying to, as much as possible, abstract and standardise operations that would otherwise fall on the user's hands to figure out. It's one of the cornerstones that many other API features build upon - and those features can help you get even more out of your data!

**Example**: *A Resource Watch API dataset can represent data in a JSON file, hosted on [Carto](https://carto.com/) or [Google Earth Engine](https://earthengine.google.com/), to name a few. However, when accessing that data, you don't have to learn 3 different technologies - the Resource Watch API gives you a single, unified query interface.*


On top of **datasets**, the RW API offers multiple resources that allow you to access data in multiple formats. These will be covered later in full detail, but as an example, here are some ways in which you can access and use datasets:

* the RW API allows you to create **Widgets**, graphic representations of data, which can be made interactive to meet your custom needs;
* if your data is georeferenced, you can use the **Layers** service to display data on informative maps;
* you can create **Subscriptions** associated with datasets, and be notified via email of significant updates;
* you can build your own **Queries** using a SQL-like syntax, and use the data to build your own custom visualizations.
* the **Metadata** service offers you a way to provide additional details about your data, like multi-language descriptions that will allow you to reach a broader audience
* the **Geostore** service allows you to access or save geometries, offering lots of useful tools when handling georeferenced datasets.


### Dataset providers

Each dataset has a **provider** (json/carto/GEE/...) that must specified on creation - it's this value that tells the RW API how to handle different data providers and formats, so you don't have to. Below you'll find a list of the different providers supported:


#### Carto

[Carto](https://carto.com/) is an open, powerful, and intuitive map platform for discovering and predicting key insights underlying the location data in our world.

#### ArcGIS Feature Service

[ArcGIS](https://www.arcgis.com/index.html) server is a complete, cloud-based mapping platform. You can learn more about ArcGIS [here](https://www.arcgis.com/index.html).

#### Google Earth Engine

[Google Earth Engine](https://earthengine.google.com/) combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth’s surface.

#### Web Map Services

[WMS](https://docs.geoserver.org/stable/en/user/services/wms/index.html) connector provides access to data served through OGC WMS protocol standard.

#### Rasdaman (Raster Data Manager)

[Rasdaman](https://www.rasdaman.com/) is a database with capabilities for storage, manipulation and retrieval of multidimensional arrays.

#### NEX-GDDP

The [NASA Earth Exchange Global Daily Downscaled Projections (NEX-GDDP)](https://www.nasa.gov/nex) dataset is comprised of downscaled climate scenarios for the globe that are derived from the General Circulation Model (GCM) runs conducted under the Coupled Model Intercomparison Project Phase 5 (CMIP5) and across two of the four greenhouse gas emissions scenarios known as Representative Concentration Pathways (RCPs).

*Note: While you may find and use existing dataset of this type, creation of new NEX-GDDP based datasets is restricted to specific users.*


#### BigQuery

[BigQuery](https://cloud.google.com/bigquery) is a serverless, highly scalable, and cost-effective cloud data warehouse designed to help you make informed decisions quickly, so you can transform your business with ease.

*Note: While you may find and use existing dataset of this type, creation of new BigQuery based datasets is restricted to specific users.*


#### Loca

[LOCA](http://loca.ucsd.edu/), which stands for Localized Constructed Analogs, is a technique for downscaling climate model projections of the future climate.

*Note: While you may find and use existing dataset of this type, creation of new LOCA based datasets is restricted to specific users.*


#### Comma-Separated Values (CSV)

Data provided in the form of a Comma-Separated Values (CSV) document.

#### Tab-Separated Values (TSV)

Data provided in the form of a Tab-Separated Values (TSV) document.

#### JavaScript Object Notation (JSON)

Data provided in the form of a JSON document.

#### Extensible (X) Markup Language (XML)

Data provided in the form of a XML document.
