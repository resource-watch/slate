// tutorial-index.js
// 
// script for the 'hello world' step of the RW API tutorial
// Step (2) Tile Layer


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
    // get an identifier
    const slug = getLayerSlug(metadata);
    // get the tile layer URL from full API response data
    const tileLayerUrl = getTileLayerUrlForTreeCoverLoss(metadata);
    // add a layer to the map
    addTileLayerToMap(map, slug, tileLayerUrl);
});

