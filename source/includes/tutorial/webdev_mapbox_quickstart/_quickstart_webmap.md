# Mapbox Webmap Quickstart

## Purpose
This is a quickstart tutorial for the API.
It is intended for web developers who are evaluating or using the API.
This tutorial does not provide best practices in respect to web development, but it does represent a quick demonstration that should be widely accessible.


One goal of this tutorial is to introduce some key concepts regarding how information is structured in API responses.
While information in the API responses may be useful on its own, a key benefit is how well it integrates with other technologies including visualization libraries such as [Vega](http://vega.github.io/) and webmaps like [Leaflet](https://leafletjs.com/) or those from [Mapbox](https://docs.mapbox.com/help/how-mapbox-works/web-apps/).

**Mapbox GL JS is being used in this tutorial as the visualization outlet for the information returned by the API.**


Over the course of this tutorial you will develop a simple web application that is capable of:

- interacting with the HTTP-based API to retrieve this information using the [`/dataset` endpoint](https://resource-watch.github.io/doc-api/index-rw.html#what-is-a-dataset).
- displaying raster tiles in a webmap run by [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/)
- showing metadata about the raster dataset being displayed


## Pre-requirements
This tutorial will interact with the RW-API, but will not require any authentication since the interactions will be read-only from publicly visible datasets.
You should be informed about the Resource Watch [Terms of Service](https://resourcewatch.org/terms-of-service) and [API Attribution Requirements](https://resourcewatch.org/api-attribution-requirements) before using the API.

This tutorial requires a [Mapbox Access Token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) with a [token scope](https://docs.mapbox.com/accounts/overview/tokens/#scopes) of `styles:read` to render the basemap.
If you are WRI staff it may be possible to obtain a token by contacting Ethan Roday.
Commercial vendors and outside organizations may need to provide their own accounts.
Individuals should consider signing up for a Mapbox account and learning what options they have.


This tutorial will also require the following applications:

- a text editor suitable for writing HTML/JS/CSS
- a modern web browser with Javascript enabled and developer tools familiarity


### Background on Datasets, Queries, Layers
There are a variety of types of data that are integrated into the RW API, covering many topics, domains, and containing all the peculiar characteristics and conventions of the communities that produced these digital artifacts.
The API is also fairly flexible towards accommodating the different needs between _small data_ that may be the result of a limited case study and the _big data_ of spatiotemporal data cubes or the unbounded potential of external API providers.


Let's quickly review some of the concepts used in the API before jumping into the tutorial.
You can find deeper and more tailored information in the [concepts documentation](https://resource-watch.github.io/doc-api/index-rw.html#concepts).

A **Dataset** essentially describes where information is being held.
Datasets are exposed through the `/dataset/<id>` endpoint as a JSON response.
This JSON has a flexible schema which can be inferred based on two required properties:

- the first, `connectorType`, which describes the access pattern to the information
    - `connectorType: document` if taking from the "internal" database of uploaded files
    - `connectorType: rest` if performing external API calls to HTTP endpoints
    - `connectorType: wms` if performing external Web Mapping Service calls
- the second, `provider`, for which there are constrained possibilities based on the `connectorType`
    - e.g. `csv`, `json` are uploaded `document`s in the "internal" database
    - e.g. `cartodb` and `gee` are external `rest`ful APIs

The full table mapping `provider`s to `connectorType`s is located in the [main API documentation](https://resource-watch.github.io/doc-api/index-rw.html#dataset-connector-type).

Based on these two properties, the Dataset JSON object will contain many other top-level properties that collectively provide all that is needed to declare where the _real data_ is being held and how to access it.

The `/query` API endpoint utilizes all this information about the Dataset behind the scenes to expose the _real data_ without the developer needing to perform the speciality interfacing with all the providers that might be supplying data for a particular project or webpage.
Queries are supportive of some analytical functionality including filtering and aggregating.
Thoughtfully-prepared datasets, carefully crafted queries, and the routing of logic through the API can get you quite far towards capable applications.

Somewhat orthogonal to the concepts of Datasets and Queries is the concept of a Layer.
A **Layer** is specialized information about how a Dataset/Query can be represented for a particular application, notably how it can be visualized and represented geospatially.
Layer information is highly free-form and purpose-defined for a specific application or integration.

As a very concrete example, consider:

-  There is a Dataset describing the latitude, longitude, depth, and magnitude of earthquakes events globally over the past month.
- A particular query is performed and filters the earthquake events to only those occurring within some distance of South America in the past week.
    - This query is still returning information in the same structural form as the original global & monthly scope - let's say a table of comma-delimited text.
- A Layer may be created that:
    - references how to perform the query above (full URL of query call)
    - has a title called "Weekly View of South American Earthquakes"
    - includes a configuration description for how a webmap could:
        - visualize the earthquake events as circles located at the _latitude_ and _longitude_ fields
        - scale the circles in size based on their _magnitude_ field
        - tint the circles in color from dark-blue to light-blue based on the _depth_ field
- To display this webmap, a webpage needs to:
    - call the `/layer` endpoint
    - call the referenced `/query` endpoint to get the data
    - pass the query response data and the webmap configuration from the Layer into the webmap library

With the flexible Layer definitions, all configuration can be saved server-side, so the front-end work only requires linking the API responses to the technologies that implement the complex features.

The scope of the current tutorial will not cover the `/query` endpoint, but such content will be made available in the future.


## Software specification
The specification for the webapp is:

<div class="center-column"></div>
```
(A)  Display a large, interactive, Mapbox GL JS map

(B)  Display some metadata/description for some data next to the map

(C)  Show the raster tile layer for this data on the map

(D)  Utilize the RW API to obtain the information needed for (B), (C)
```

## Initial document structure
A basic "Hello World" setup for getting Mapbox GL JS online is given below.
This will ensure your Mapbox token is working and there is a basic foundation for the webpage.

Each section in this tutorial has a corresponding "finished" version [available on GitHub](https://github.com/resource-watch/doc-api/tree/master/extra/tutorial_content/webdev_mapbox_quickstart), which may be helpful if errors are encountered along the way.
This tutorial will have a single HTML file across all steps, but the associated javascript file (`tutorial-index.js`) will be changing at each step.


Copy the below text into a file called `index.html` inside a directory for this tutorial.
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
    body {
      margin: 0;
      padding: 0;
    }

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

  <script src="tutorial-index.js"></script>
</body>
</html>
```


This file establishes the following properties to the document:

- in `<body>`, establish a top-level container, and two children containers `metadata-container` and `map`
- in `<head><style>`, set a [CSS grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) on the top-level container, making the children align to a grid that is two columns wide
- in `<head><style>`, establish grid row dimensions, including a minimum and maximum height, letting metadata content overflow via a vertical scroll bar
- in `<head>`, fetch the Mapbox JS and CSS assets


You should also see that a local script is imported in `<body>`.
Copy the following into a file called `tutorial-index.js` next to the HTML file you established above.

<div class="center-column"></div>
```javascript
// TO MAKE THE MAP APPEAR YOU MUST ADD YOUR ACCESS TOKEN FROM
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

```

This script initializes an interactive web map on the `<div id="map">` element.

Upon replacing `mapboxgl.accessToken` with your access token, this file should be saved and the HTML opened in a web browser.

You should see a webpage that looks something like this:

![Image of basic webpage, with a title, some text on the left, and a large map zoomed to central Africa on the right](tutorials/webdev_mapbox_quickstart/webmap-hello-world.png)

If you are not seeing a map check the web developer console.


## Getting dataset metadata
In this section the API will be used to obtain some structured information about a dataset.
In the immediate, this information will be displayed on the left side of the webpage in the metadata pane.
Later some of the information will be extracted and used in combination with the webmap.


The remaining work in this tutorial will use the following Dataset ID, which describes a dataset of tree cover loss (TCL).

<div class="center-column"></div>
```javascript
datasetId = 'b584954c-0d8d-40c6-859c-f3fdf3c2c5df';
```

Datasets are accessed through the `/dataset/<id>` endpoint.
As described earlier in the [background information](#background-on-datasets-queries-layers) a Dataset holds information about where "real data" is being held.
To obtain how to _style_ the information and put it on a webmap requires accessing a Layer.
Here we will be taking advantage of the ability to expand the API response by using the `?includes=` URL parameter, which will simultaneously return associatiated Layers, Metadata, or Widgets as specified.
In this web application we are making a call to the following URL:

<div class="center-column"></div>
```
https://api.resourcewatch.org/v1/dataset/b584954c-0d8d-40c6-859c-f3fdf3c2c5df/?includes=layer,metadata
```

You may want to copy that URL into your own browser window or use curl, wget, or similar to evaluate the response before proceeding to implementing this for the webpage.

The response looks something like this:

<div class="center-column"></div>
```
{
  "data": {
    "id": "b584954c-0d8d-40c6-859c-f3fdf3c2c5df",
    "type": "dataset",
    "attributes": {
      "name": "Tree cover loss 2019 (LM v3)",
      // ...
      "connectorType": "rest",
      "provider": "gee",
      // ...
      "layer": [
        {
          "id": "49a80e70-ec52-4ef8-bcc6-fb2771d95b2c",
          "type": "layer",
          "attributes": {
            "name": "Tree cover loss - 2001-2019",
            "slug": "Tree-cover-loss-2001-2019",
            "dataset": "b584954c-0d8d-40c6-859c-f3fdf3c2c5df",
            "description": "Tree Cover Loss",
            // ...
            "provider": "tilelayer",
            // ...

```

There is much to investigate in this response, but you can see that there is both Dataset- and Layer-relevant content.
Not appending the `?includes=layer,metadata` parameter will result in a comparatively smaller response, take a look!


Now let's implement this for the webpage and get the response on screen.
In a real development scenario smaller pieces of the response would probably be extracted and rendered into individual HTML elements.
For now we are going to just dump the response into a `<pre>` element to view it all.


Modify `tutorial-index.js` to the following complete script:

<div class="center-column"></div>
```javascript
// TO MAKE THE MAP APPEAR YOU MUST ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'YOUR KEY HERE -- PROBABLY STARTS WITH pk.****';

// declare an async function that calls an API endpoint for dataset metadata
// takes one parameter
//   (uuid) the Dataset ID
// returns an object interpreted from the JSON response
const callApiDatasetMetadata = async (uuid) => {
    // fetch the API endpoint (GET request)
    const response = await fetch('https://api.resourcewatch.org/v1/dataset/' + uuid + '?includes=layer,metadata')
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}


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


// run the API call once the map is loaded (API call is asnyc)
map.on('load', async () => {
    // declare the Dataset ID
    const datasetId = 'b584954c-0d8d-40c6-859c-f3fdf3c2c5df';
    // fetch remote dataset metadata
    const metadata = await callApiDatasetMetadata(datasetId);
    // display the response metadata
    document.getElementById('metadata').textContent = JSON.stringify(metadata, null, 2);
});
```

The changes above did the following:

- register a callback function that will be executed once the map is intially loaded
- supply a hard-coded `datasetId`, a string reference to a known Dataset, in this callback
- declare `callApiDatasetMetadata(datasetId)` as a function to get an API response
- call `callApiDatasetMetadata` on map load, and set the metadata panel content based on this response

Reload in the browser to see the updated metadata panel, which should look like:

![Image of the webpage, with the same large map on the right, but now with the left panel full of text.](images/tutorials/webdev_mapbox_quickstart/webmap-api-response.png)


For the next step, some of the dataset information will be extracted and utilized.
You already know the part of the response with the Layer content describes how this data can be used or rendered by applications.
See if you can gain any intuition into what type of information is held in the Layer specifications for this particular Dataset.



## Adding raster tiles to the map
In this section raster tiles will be added to the map.
The API response that was previously retrieved will serve as the source of the tile layer URL.

Mapbox expects a raster tile layer to be supplied as a URL in the form `https://example.com/path/to/pngdir/{x}/{y}/{z}`.
The URL representation describes a set of square images located at cartesian positions (`x`, `y`) on a grid determined by a set of zoom levels (`z`).
This URL is expressed with templating semantics which are fairly ubiquitous across web map and tile-serving applications, but Mapbox specifically requires the TileJSON specification when working with [tile sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/).

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

Update the javascript file with the following three functions and a new version of the `map.on('load')` callback.
A description is located after this code block.

<div class="center-column"></div>
```javascript
// ...
// const callApiDatasetMetadata = async (uuid) => {
// ...


// declare a function that returns the Mapbox-ready raster tile URL template
// (example.com/{x}/{y}/{z}) from the response object returned by `callApiDatasetMetadata`
// takes one parameter
//   (obj) the API response data
// returns a string representing a templated URL, ready to be used by webmaps
const getTileLayerUrlForTreeCoverLoss = (obj) => {
    // drill down to get a useful object
    const layerConfig = obj['data']['attributes']['layer'][0]['attributes']['layerConfig'];
    // get the URL template parameters
    const defaultParams = layerConfig['params_config'];

    // get the full templated URL
    let url = layerConfig['source']['tiles'][0];
    // substitute default parameters iteratively
    for (const param of defaultParams) {
        url = url.replace('{' + param['key'] + '}', param['default'].toString());
    }
    return url;
}


// declare a funciton that can get a simple identifier for a layer
// takes one parameter
//   (obj) the API response data from `callApiDatasetMetadata`
// returns a string
const getLayerSlug = (obj) => {
    return obj['data']['attributes']['layer'][0]['attributes']['slug'];
}

// declare a function that can add a raster tile layer to a Mapbox map
// takes three parameters:
//   (mapVar) the Mapbox map object
//   (title) a string identifier for the source and layer
//   (url) the raster tile URL to add to the map
const addTileLayerToMap = (mapVar, title, url) => {
    // need to first add a source
    mapVar.addSource(title, {
        'type': 'raster',
        'tiles': [
            url
        ],
        'tilesize': 256
    });
    // then add the layer, referencing the source
    mapVar.addLayer({
        'id': title,
        'type': 'raster',
        'source': title,
        'paint': {
            'raster-opacity': 1  // let mapbox baselayer peak through
        }
    });
}


// ...
// var map = new mapboxgl.Map({
// ...


// run the API call once the map is loaded (API call is asnyc)
map.on('load', async () => {
    // declare the Dataset ID
    const datasetId = 'b584954c-0d8d-40c6-859c-f3fdf3c2c5df';
    // fetch remote dataset metadata
    const metadata = await callApiDatasetMetadata(datasetId);
    // display the response metadata
    document.getElementById('metadata').textContent = JSON.stringify(metadata, null, 2);
    // get an identifier
    const slug = getLayerSlug(metadata);
    // get the tile layer URL from full API response data
    const tileLayerUrl = getTileLayerUrlForTreeCoverLoss(metadata);
    // add a layer to the map
    addTileLayerToMap(map, slug, tileLayerUrl);
});

```

The changes above did the following:

- add a function `getTileLayerUrlForTreeCoverLoss` to obtain a well-formed tile URL
- add a function `getLayerSlug` to obtain a short identifier the tile layer of interest
- add a function `addTileLayerToMap` to handle the two-part source and layer definition process
- update the `map.on('load')` callback with more steps executed after the initial API call


Once again reload the browser and see the tile layer now on the map.

![Image of the webpage, with the same left panel full of text, but now with a new layer on the map - the tree cover loss dataset.](images/tutorials/webdev_mapbox_quickstart/webmap-raster-tile-layer.png)

## Next Steps
At this point the tutorial can be considered complete - the software specification is being met and hopefully enough of the concepts have been introduced to develop a general image of integrating API-retrieved information into a simple webapp.

While this tutorial utilized hand-written HTML, JS, CSS, transforming the logic into other frameworks such as React should be relatively simple if there is already familiarity in that space.
Some wrappers and React components for working with Mapbox GL JS already exist, including [react-map-gl](https://github.com/visgl/react-map-gl) and [Vizzuality/layer-manager](https://github.com/Vizzuality/layer-manager).

