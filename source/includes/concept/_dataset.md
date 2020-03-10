# Concepts

## Dataset

One of the Resource Watch API's (RW API) goals is to provide a common interface for interacting with data hosted in different sources and formats. A **Dataset** is the Resource Watch's API way of providing users with access to data, while trying to, as much as possible, abstract and standardise operations that would otherwise fall on the user's hands to figure out. It's one of the cornerstone onto which many other API resources build upon.

**Example**: *A Resource Watch API dataset can represent data in a JSON file, hosted on [Carto](https://carto.com/) or [Google Earth Engine](https://earthengine.google.com/), to name a few. However, when accessing that data, you don't have to learn 3 different technologies - the Resource Watch API gives you a single, unified query interface.*


On top of **datasets**, the RW API offers multiple resources that allow you to access data in multiple formats. These will be covered later in full detail, but as an example, here are some ways in which you can access and use datasets:

* you can create **Layers** to display dataset's geographical information on maps;
* you can create **Widgets**, graphic representations of dataset's data, which you can use, for instance, to build charts;
* you can create **Subscriptions** associated with datasets and be notified via email of significant updates;
* or you can perform your own **Queries** using a SQL-like syntax, and use the dataset data to build your own custom visualizations.


### Dataset providers

Each dataset has a **provider** (json/carto/GEE/...) that must specified on creation - it's this value that tells the RW API how to handle different data providers and formats, so you don't have to. Below you'll find a list of the different providers supported:


#### Carto

Carto is an open, powerful, and intuitive map platform for discovering and predicting key insights underlying the location data in our world.

#### ArcGIS Feature Service

ArcGIS for server is a complete, cloud-based mapping platform.

#### Google Earth Engine

Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth’s surface.

#### Web Map Services

WMS connector provides access to data served through OGC WMS protocol standard.

#### Rasdaman (Raster Data Manager)

Rasdaman is a database with capabilities for storage, manipulation and retrieval of multidimensional arrays.

#### NEX-GDDP

The NASA Earth Exchange Global Daily Downscaled Projections (NEX-GDDP) dataset is comprised of downscaled climate scenarios for the globe that are derived from the General Circulation Model (GCM) runs conducted under the Coupled Model Intercomparison Project Phase 5 (CMIP5) and across two of the four greenhouse gas emissions scenarios known as Representative Concentration Pathways (RCPs).

#### Comma-Separated Values (CSV)

Data provided in the form of a Comma-Separated Values (CSV) document.

#### Tab-Separated Values (TSV)

Data provided in the form of a Tab-Separated Values (TSV) document.

#### JavaScript Object Notation (JSON)

Data provided in the form of a JSON document.

#### Extensible (X) Markup Language (XML)

Data provided in the form of a XML document.
