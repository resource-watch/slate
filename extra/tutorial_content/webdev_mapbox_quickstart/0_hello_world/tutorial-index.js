// tutorial-index.js
// 
// script for the 'hello world' step of the RW API tutorial
// Step (0) Hello World


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

