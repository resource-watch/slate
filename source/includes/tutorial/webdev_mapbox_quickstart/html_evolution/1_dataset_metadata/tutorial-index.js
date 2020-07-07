// tutorial-index.js
// 
// script for the 'hello world' step of the RW API tutorial
// Step (1) Dataset Metadata


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

