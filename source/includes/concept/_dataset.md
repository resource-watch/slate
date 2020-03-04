# Concepts

## Dataset

Resource Watch API's goal is to provide a common interface for interacting with different data sources. A **Dataset** is a resource that represents how to access these data sources. It is the cornerstone onto which all other API resources build upon.

To create a **Dataset**, amongst other fields, you need to provide a connector type (e.g. 'rest') and a provider (e.g. 'cartodb'). Together, these two fields will configure how to fetch the data for a dataset. This flexibility allows combining data from different providers such as CartoDb, Google Earth Engine, NEX-GDDP (and even using simple CSV/JSON files).

A dataset by itself does not access the data source - in order to do so, you should use other API resources. Here are some examples of ways of using datasets:

* you can create **Layers** that can be used to display dataset's geographical information on maps;
* you can create **Widgets** that are graphic representations of dataset's data, which you can use, for instance, to build charts;
* you can create **Subscriptions** associated with datasets and be notified via email of significant updates;
* or you can perform your own **Queries** using a SQL-like syntax, and use the dataset data to build your own custom visualizations.

### Supported dataset providers

#### Carto

Carto is an open, powerful, and intuitive map platform for discovering and predicting the key insights underlying the location data in our world. In order to create a dataset based on CartoDB data, you should create a dataset providing:

`{ "connectorType": "rest", "provider": "cartodb" }`

#### ArcGIS Feature Service

ArcGIS for server is a complete, cloud-based mapping platform. In order to create a dataset based on ArcGIS Feature Service data, you should create a dataset providing:

`{ "connectorType": "rest", "provider": "featureservice" }`

#### Google Earth Engine

Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth’s surface. In order to create a dataset based on Google Earth Engine data, you should create a dataset providing:

`{ "connectorType": "rest", "provider": "gee" }`

#### Web Map Services

WMS connector provides access to data served through OGC WMS protocol standard. In order to create a dataset based on WMS data, you should create a dataset providing:

`{ "connectorType": "wms", "provider": "wms" }`

#### Rasdaman (Raster Data Manager)

Rasdaman is a database with capabilities for storage, manipulation and retrieval of multidimensional arrays. In order to create a dataset based on Rasdaman data, you should create a dataset providing:

`{ "connectorType": "rest", "provider": "rasdaman" }`

#### NEX-GDDP

The NASA Earth Exchange Global Daily Downscaled Projections (NEX-GDDP) dataset is comprised of downscaled climate scenarios for the globe that are derived from the General Circulation Model (GCM) runs conducted under the Coupled Model Intercomparison Project Phase 5 (CMIP5) and across two of the four greenhouse gas emissions scenarios known as Representative Concentration Pathways (RCPs). In order to create a dataset based on Rasdaman data, you should create a dataset providing:

`{ "connectorType": "rest", "provider": "nexgddp" }`

#### Comma-Separated Values (CSV)

Arbitrary Comma-Separated Values data. In order to create a dataset based on CSV data, you should create a dataset providing:

`{ "connectorType": "document", "provider": "csv" }`

#### Tab-Separated Values (TSV)

Arbitrary Tab-Separated Values data. In order to create a dataset based on TSV data, you should create a dataset providing:

`{ "connectorType": "document", "provider": "tsv" }`

#### JavaScript Object Notation (JSON)

Arbitrary JSON data. In order to create a dataset based on JSON data, you should create a dataset providing:

`{ "connectorType": "document", "provider": "json" }`

#### XML

Arbitrary XML data. In order to create a dataset based on XML data, you should create a dataset providing:

`{ "connectorType": "document", "provider": "xml" }`
