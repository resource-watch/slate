# Mapbox Webmap Quickstart

## Purpose
This is a quickstart tutorial for the API.
It is intended for web developers who are evaluating or using the API.
This tutorial does not provide best practices, but it does represent a quick demonstration that should be widely accessible.

Over the course of this tutorial you will develop a simple web application that is capable of:

- displaying raster tiles in a webmap run by [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/)
- defining spatial geometries such as a region of interest with the [Mapbox GL Draw Plugin](https://github.com/mapbox/mapbox-gl-draw).
- showing metadata about the raster dataset being displayed
- interacting with the HTTP-based API to retrieve this information using the `/dataset` endpoint.


## Pre-requirements
This tutorial requires a [Mapbox Access Token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) with a [token scope](https://docs.mapbox.com/accounts/overview/tokens/#scopes) of `styles:read`.
If you are WRI staff it may be possible to obtain a token by contacting Ethan Roday.
Commercial vendors and outside organizations may need to provide their own accounts.
Individuals should consider signing up for a Mapbox account and learning what options they have.


This tutorial will also require the following applications:

- a text editor suitable for writing HTML/JS/CSS
- a modern web browser with Javascript enabled and developer tools familiarity


## Software specification
The specification for the webapp is:

<div class="center-column"></div>
```
(A)  Display a large, interactive, Mapbox GL JS map

(B)  Display some metadata/description for some data next to the map

(C)  Show the raster tile layer for this data on the map

(D)  Enable a user to draw a polygon on the map

(E)  Utilize the RW API to obtain the information needed for (B), (C)
```

## Initial document structure
A basic "Hello World" HTML document for getting Mapbox GL JS online is given below.
This will ensure your Mapbox token is working and there is a basic foundation for the webpage.

Each section in this tutorial has a corresponding "finished" HTML document [available on GitHub](https://github.com/resource-watch/doc-api/tree/master/source/includes/tutorial/webdev_mapbox_quickstart/html_evolution), which may be helpful if errors are encountered along the way.



Copy this into a file called `index.html` inside a directory for this tutorial.
It will be assumed this file is called `index.html` throughout the tutorial, but there is no strict requirement for this.


<div class="center-column"></div>
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <title>WRI API Map</title>

  <!-- Mapbox GL JS includes -->
  <script src="https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.css" rel="stylesheet" />

  <!-- CSS embedded in head tag since this is a small app -->
  <style>
    /* basic reset of styling */
    body { margin: 0; padding: 0; }

    #metadata-container {
      overflow-y: auto;
    }

    /* Container holding the grid */
    #grid-top-level {
      display: grid;
      grid-template-columns: 45% 45%;  /* column widths */
      grid-auto-rows: minmax(400px, 750px);  /* row heights */
      justify-content: space-evenly;
    }

    #map-container {
      width: 100%;
    }
  </style>

</head>

<body>
  <h1>WRI-API and Mapbox GL JS Quickstart Tutorial</h1>

  <!-- Container holding the grid -->
  <div id="grid-top-level">

    <!-- Container (grid cell) for metadata panel -->
    <div id="metadata-container">
      <!-- Element actually holding the metadata text-->
      <pre id="metadata">
Hello (part of the) World
      </pre>
    </div>

    <!-- Container (grid cell) for interactive map -->
    <div id="map"></div>

  </div>

  <!-- JS embedded in body tag  -->
  <script>
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = 'YOUR KEY HERE -- PROBABLY STARTS WITH pk.****';


    // initiate a new map by passing an object describing a config
    // for more info see: https://docs.mapbox.com/mapbox-gl-js/api/map/
    var map = new mapboxgl.Map({
        // id of div that will hold map
        container: 'map',

        // one of the existing mapbox map styles
        style: 'mapbox://styles/mapbox/light-v10',

        // zoom in (greater = smaller area displayed)
        zoom: 4,

	      // longitude, latitude of the map center
        center: [20, 0]
    });

  </script>

</body>
</html>
```


This file establishes the following properties to the document:

- in `<body>`, establish a top-level container, and two children containers `metadata-container` and `map`
- in `<head><style>`, set a [CSS grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) on the top-level container, making the children align to a grid that is two columns wide
- in `<head><style>`, establish grid row dimensions, including a minimum and maximum height, letting metadata content overflow via a vertical scroll bar
- in `<head>`, fetch the Mapbox JS and CSS assets
- in `<body><script>`, initialize a Mapbox map for one of the children in the grid

Upon replacing `mapboxgl.accessToken` with your access token, this file should be saved and opened in a web browser.


If you are not seeing a map check the web developer console.

With this structure in place:

- item `(A)` in the software specification is basically complete with a large map being displayed
- content for items `(B)` and `(C)` have somewhere to live once made available
- items `(D)` and `(E)` are not affected in any way


## Using the Draw plugin
This section will quickly introduce the [Mapbox GL Draw Plugin](https://github.com/mapbox/mapbox-gl-draw), which is a separate javascript library for enabling user-drawn geometries.
The draw plugin generally works with GeoJSON objects as the primary interoperability mechanism with other geospatial data sources or libraries.

Though requirement `(D)` listed above does not specify there is any analysis to be performed with the drawn polygons, there are many ways to import or export geometries and interface with such functionality when needed.
For the scope of this tutorial only the most basic drawing and visualization are going to be demonstrated.


To include this plugin, ensure your `<head>` element has all the folowing external assets declared:

<div class="center-column"></div>
```html
<head>
  <!-- ... other things ... -->

  <!-- Mapbox GL JS includes -->
  <script src="https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.css" rel="stylesheet" />

  <!-- Mapbox GL Draw plugin includes -->
  <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css" rel="stylesheet" />

  <!-- ... CSS declaration ... -->

</head>
```

To enable drawing on a map requires a small addition to `<body><script>`.
Update that javascript with the following:

<div class="center-column"></div>
```html
  <!-- JS embedded in body tag  -->
  <script>
    // ...
    // ... var map = new mapboxgl.Map({ ...
    //     ... center: [20, 0] });

    // initiate a new handler for drawing
    var draw = new MapboxDraw({

      // override the control buttons
      displayControlsDefault: false,
      controls: {
        polygon: true,  // no points or lines
        trash: true  // let the geometries be deleted
      }
    });
    // attach the handler to the map
    map.addControl(draw, 'top-left');

  </script>
```

The changes in this section did the following:

- in `<head>`, import the Mapbox Draw plugin JS and CSS documents
- in `<body><script>`, define how the drawing controls are configutred, then attach this config to the map object


Reload the page in the web browser and explore the map capabilities.
You should see two new buttons in the corner of the map which are the entry points to the drawing interactions.
When drawing a polygon, double click at the last node to finalize it.


At the end of this section the requirements are at the following state:

- item `(A)` in the software specification is basically complete with a large map being displayed.
- content for items `(B)` and `(C)` have somewhere to live once made available
- **item `(D)` is complete**
- item `(E)` remains untouched


## Getting dataset metadata
In this section the API will be used to obtain some structured information about a dataset.
This information will be displayed on the left side of the webpage in the metadata pane.

The remaining work in this tutorial will use the following Dataset ID, which describes a dataset of tree cover loss (TCL).

<div class="center-column"></div>
```javascript
datasetId = 'b584954c-0d8d-40c6-859c-f3fdf3c2c5df';
```

You can find more information about a Dataset in the [concepts documentation](/index-rw.html#concepts).


Modify `index.html` with the following javascript:

<div class="center-column"></div>
```html
  <!-- JS embedded in body tag  -->
  <script>
    // ... mapboxgl.accessToken = ''; ...

    // declare the Dataset ID
    const datasetId = 'b584954c-0d8d-40c6-859c-f3fdf3c2c5df';

    // declare an async function that calls an API endpoint for dataset metadata
    // the JSON response loaded into the metadata panel and stored globally as well
    // takes one parameter
    //   (0) the Dataset ID
    callApiDatasetMetadata = async function(uuid) {
      // fetch the API endpoint (GET request)
      return fetch('https://api.resourcewatch.org/v1/dataset/' + uuid + '?includes=layer,metadata')
        .then(function(response) {  // convert the JSON text into a JS object
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        }).then(function(j) { // set global variable, update HTML content
          console.log(j);
          // set a global variable to store this response object - self-rolled state management
          window.globalVarDatasetMetadataResponse = j;
          // update HTML content with dataset metadata
          document.getElementById('metadata').textContent = JSON.stringify(j, null, 2);
        })
    }

    // var map = new mapboxgl.Map({ ...
    // ... center: [20, 0] });

    // run the API call once the map is loaded (API call is asnyc)
    map.on('load', function () {
      // fetch remote dataset metadata and update HTML
      callApiDatasetMetadata(datasetId);
    });

    // ... var draw = new MapboxDraw({
    // ... map.addControl(draw, 'top-left');

  </script>
```

The changes above did the following:

- supply a hard-coded `datasetId`, a string reference to a known Dataset
- add `callApiDatasetMetadata` function to fetch a dataset and update the metadata panel
- declare `callApiDatasetMetadata(datasetId)` as a callback to be executed when after the map loads

Reload in the browser to see the updated metadata panel.

At this point in the tutorial, progress on the requirements is as follows:

- item `(A)` in the software specification is basically complete with a large map being displayed.
- **content for item `(B)` is being fetched and displayed on screen**
- content for `(C)` has a places to live, but is not yet added
- item `(D)` is complete
- **item `(E)` is in progress, with the API being used to acquire the dataset information for item `(B)`**

For the next step, some of the dataset information will be extracted and utilized.
Before proceeding to the next step it will be valuable to look over the metadata pane and investigate the structure of the API response.


## Adding raster tiles to the map
In this section raster tiles will be added to the map.
The API response that was previously retrieved will serve as the source of the tile layer URL.

Mapbox expects a raster tile layer to be supplied as a URL in the form `https://example.com/path/to/pngdir/{x}/{y}/{z}`.
This URL is expressed with templating semantics which are fairly ubiquitous across web map and tile-serving applications.
The URL representation describes a set of square images located at cartesian positions (`x`, `y`) on a grid determined by a set of zoom levels (`z`).

The API response obtained earlier contains a reference to a tile layer and a URL, which for your own benefit should be found within the metadata by skimming the contents.
If you are unable to find it, look within the following hierarchy address:

<div class="center-column"></div>
```
.data.attributes.layer[0].attributes.layerConfig.source.tiles[0]
```

Datasets and Layers accessed through the API are not guaranteed to have the same structuring of their `layerConfig` object, which means there may be a need to investigate each dataset in a more comprehensive way than is being demonstrated here.
Since this is a tutorial, some of this logic is going to be hardcoded for now.

For the given dataset, you will see a tile layer URL that looks like:

<div class="center-column"></div>
```
https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.7/tcd_{thresh}/{z}/{x}/{y}.png
```

This URL is close to what is needed by Mapbox, but there is a templated component `{thresh}` which will not be suitable for Mapbox to consume.
In this case, URL is templated beyond what is expected by the application and may be troublesome.
By browsing the `layer` object in the API response it is possible to find some additional attributes for how the layer parameters are configured.
For this specific case, there is a parameterization array at the address

<div class="center-column"></div>
```
.data.attributes.layer[0].attributes.layerConfig.params_config
```

That parameterization array looks like:

<div class="center-column"></div>
```
...
"params_config": [
  {
    "default": 30,
    "key": "thresh",
    "required": true
  }
],
...
```

By using this parameterization data, the URL can be transformed into compliance with Mapbox GL.

Update `index.html` with the following javascript, a description is located after this code block.

<div class="center-column"></div>
```html
  <!-- JS embedded in body tag  -->
  <script>
    // ...
    // callApiDatasetMetadata = async function ....
    // ...

    // get the Mapbox-ready raster tile URL template (example.com/{x}/{y}/{z})
    // takes as a single parameter the API response data
    getTileLayerUrlForTreeCoverLoss = function(obj) {
      // drill down to get a useful object
      var layerConfig = obj['data']['attributes']['layer'][0]['attributes']['layerConfig'];
      // get the full templated URL
      var urlTemplate = layerConfig['source']['tiles'][0];
      // get the URL template parameters
      var defaultParams = layerConfig['params_config'];

      // define reducing function that iteratively substitutes parameters
      // takes as two parameters:
      //   (0) the accumulated string of the URL with template components substituted
      //   (1) the current object in the parameters array
      urlTemplateReducer = function(accumulated, value) {
        // String.replace('{param}', defaultValue)
        return accumulated.replace('{' + value['key'] + '}', value['default'].toString());
      }
      // do the reducing, which iteratively replaces all configured parameters
      return defaultParams.reduce(urlTemplateReducer, urlTemplate);
    }

    // get a simple identifier
    // takes as one parameter the API response data
    getLayerSlug = function(obj) {
      return obj['data']['attributes']['layer'][0]['attributes']['slug'];
    }

    // add a raster tile layer to a Mapbox map
    // takes as three parameters:
    //   (0) the Mapbox map object
    //   (1) an identifier
    //   (2) the raster tile URL
    addTileLayerToMap = function(mapVar, title, url) {
      // need to first add a source
      mapVar.addSource( title, {
        type: 'raster',
        tiles: [
          url
        ],
        tilesize: 256
      });
      // then add the layer, referencing the source
      mapVar.addLayer({
          'id': title,
          'type': 'raster',
          'source': title,
          'paint': {
            'raster-opacity': 0.8  // let mapbox baselayer peak through
          }
      });
    }

    // ...
    // var map = new mapboxgl.Map({ ...
    //     ... center: [20, 0] });

    map.on('load', function() {
        // fetch remote dataset metadata and update HTML
        callApiDatasetMetadata(datasetId)
          // add a callback function to the original async API call
          .then(function() { // update the map once the API call finishes
            // get an identifier
            var slug = getLayerSlug(window.globalVarDatasetMetadataResponse);
            // get the tile layer URL from full API response data
            var tileLayerUrl = getTileLayerUrlForTreeCoverLoss(window.globalVarDatasetMetadataResponse);
            // add a layer to the map
            addTileLayerToMap(map, slug, tileLayerUrl);
        });
      });

    // ...
    // var draw = new MapboxDraw({ ...
    // ... 

  </script>
```

The changes above did the following:

- add a function `getTileLayerUrlForTreeCoverLoss` to obtain a well-formed tile URL
- add a function `getLayerSlug` to obtain a short identifier the tile layer of interest
- add a function `addTileLayerToMap` to handle the two-part source and layer definition process
- update the `map.on('load')` callback with more steps executed after the initial API call; load the raster tile layer to the map


Once again reload the browser and see the tile layer now on the map.

At this point in the tutorial, progress on the requirements is remarkably complete:

- item `(A)` is met with a large interactive map
- metadata content for item `(B)` is being fetched and displayed on screen
- raster tiles for `(C)` are being "extracted" from the metadata and displayed on the map
- the drawing for item `(D)` is enabled and functioning
- **almost all dynamic information in the webapp is declared in cooperation with the API in support of item `(E)`**

## Next Steps
At this point the tutorial can be considered complete - the software specification is being met and hopefully the enough concepts have been introduced to develop a general image of integrating API-retrieved information into a simple webapp.

While this tutorial utilized hand-written HTML, JS, CSS in a single file, transforming the logic into other frameworks such as React should be relatively simple if there is already familiarity in that space.
Some wrappers and React components for working with Mapbox GL JS already exist, including [react-map-gl](https://github.com/visgl/react-map-gl) and [Vizzuality/layer-manager](https://github.com/Vizzuality/layer-manager).

