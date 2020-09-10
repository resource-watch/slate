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


// declare a function that can get a simple identifier for a layer
// takes one parameter
//   (obj) the API response data from `callApiDatasetMetadata`
// returns a string
const getTreeCoverLossSlug = (obj) => {
    return obj['data']['attributes']['layer'][0]['attributes']['slug'];
}


// declare a function that can add a raster tile layer to a Mapbox map
// takes three parameters:
//   (mapVar) the Mapbox map object
//   (title) a string identifier for the source and layer
//   (url) the raster tile URL to add to the map
const addRasterTileLayerToMap = (mapVar, title, url) => {
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
	    'raster-opacity': 0.8,  // let mapbox baselayer peak through
            'raster-hue-rotate': 180
	}
    });
}


// declare a function that returns the Mapbox-ready vector tile URL template
// (example.com/{x}/{y}/{z}) from the response object returned by `callApiDatasetMetadata`
// takes one parameter
//   (obj) the API response data
// returns an object representing a vector source, ready to be used by map.addSource().
const getTileLayerSourceForWDPAGeometries = (obj) => {
    // drill down to get a useful object
    return obj['data']['attributes']['layer'][0]['attributes']['layerConfig']['source'];
}


// declare a function that can add a raster tile layer to a Mapbox map
// takes four parameters:
//   (mapVar) the Mapbox map object
//   (title) a string identifier for the source and layer
//   (source) the vector tile source to add to the map
//   (layer) layer name in the vector tile - any vector tile can hold many different layers
const addVectorTileLayerToMap = (mapVar, title, source, layer) => {
    // need to first add a source
    mapVar.addSource(title, source);
    // then add the layer, referencing the source
    mapVar.addLayer({
	'id': title,
	'type': 'fill',
	'source': title,
	'source-layer': layer,
        'paint': {
            'fill-opacity': 0.25,
            'fill-color': '#A6CEE3'
        }
    });
}


// declare a function that returns an HTML string to be displayed
// in the popup on a vector element.
// takes one parameter:
//   (f) an element of the vector tile
/*const popupContentForWDPA = (f) => {
    // WDPA identifier string
    const wdpaId = f.properties['wdpaid'];
    // start assembling the string of HTML that will be displayed
    // first make a hyperlink to a details page for this geometry (external site)
    let content = '<span>name: ' + 
                     '<a target="_blank" ' + 
                        'href="https://protectedplanet.net/' + wdpaId + '" >' + 
                           f.properties['name'] +
                  '</a></span>';
    // add the identifier, since that is being used it should also be displayed
    content += '<br><span>wdpaid: ' + wdpaId + '</span>';
    return content;
}*/


// declare an async function that calls an API endpoint for querying.
// this uses a pre-computed table that links WDPA identifiers to tree cover loss values.
// takes three parameters
//   (wdpaId) integer; the WDPA geometry ID, which uniquely identifies a protected area
//   (year) integer; the year of interest {2001 - 2019}
//   (threshold) integer; the tree cover loss threshold {10, 15, 20, 25, 30, 50, 75}
// returns an object interpreted from the JSON response
const callApiQueryWDPATreeCoverLoss = async (wdpaId, year, threshold) => {
    //construct the query
    const queryDatasetId = 'a4d92f66-83f4-40f9-9d70-17297ef90e63';
    const sqlQuery = 'https://api.resourcewatch.org/v1/query/' + 
		     '?sql=SELECT SUM(umd_tree_cover_loss__ha) AS tcl_ha ' +
	                  'FROM ' + queryDatasetId + 
		          ' WHERE wdpa_protected_area__id=' + wdpaId +
		          ' AND umd_tree_cover_loss__year=' + year + 
	                  ' AND umd_tree_cover_density__threshold=' + threshold;
    // fetch the API endpoint (GET request)
    const response = await fetch(sqlQuery)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // convert response to JS object
    return response.json();
}


// declare a function that returns a string to be displayed
// in the popup on a vector element.
// takes one parameter:
//   (e) an element of the vector tile
const popupContentForWDPA = async (f) => {
    // subtract marine area from total area and convert from square km to hectare
    let landAreaHectare = (f.properties['rep_area'] - f.properties['rep_m_area']) * 100;
    // WDPA identifier will be used to query the TCL data table
    let wdpaId = f.properties['wdpaid'];
    // get the Tree Cover Loss area, which is returned in units of hectare
    let tclResponse = await callApiQueryWDPATreeCoverLoss(wdpaId, 2019, 30);

    // start assembling the string of HTML that will be displayed
    // first make a hyperlink to a details page for this geometry (external site)
    let content = '<span>name: ' + 
                     '<a target="_blank" ' + 
                        'href="https://protectedplanet.net/' + wdpaId + '" >' + 
                           f.properties['name'] +
                  '</a></span>';
    // add the identifier, since that is being used it should also be displayed
    content += '<br><span>wdpaid: ' + wdpaId + '</span>';
    // add the land area, truncating to two digits past the decimal
    content += '<br><span>land area (ha): ' + landAreaHectare.toFixed(2) + '</span>';
    // add the TCL area, truncating to two digits past the decimal
    content += '<br><span>2019 TCL area (ha): ' + tclResponse['data'][0]['tcl_ha'].toFixed(2) + '</span>';
    return content;
}

// vvvvv MAIN SCRIPT ACTIVITY BELOW vvvvvv

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


// add the data layers once the map is loaded (API calls are asnyc)
map.on('load', async () => {

    // LOAD TREE COVER LOSS RASTER TILES
    // declare the Dataset ID for Tree Cover Loss
    const datasetIdForTCL = 'b584954c-0d8d-40c6-859c-f3fdf3c2c5df';
    // fetch remote dataset metadata
    const metadataForTCL = await callApiDatasetMetadata(datasetIdForTCL);
    // get an identifier for the Tree Cover Loss raster tiles
    const slugForTCL = getTreeCoverLossSlug(metadataForTCL);
    // get the raster tile layer URL from full API response data
    const tileLayerUrlForTCL = getTileLayerUrlForTreeCoverLoss(metadataForTCL);
    // add the Tree Cover Loss raster layer to the map
    addRasterTileLayerToMap(map, slugForTCL, tileLayerUrlForTCL);

    // LOAD WDPA GEOMETRIES VECTOR TILES
    // declare the Dataset ID for WDPA Geometries
    const datasetIdForWDPAGeometries = 'a8360d91-06af-4f2d-bd61-4e50c8687ad8';
    // fetch remote dataset metadata
    const metadataForWDPAGeometries = await callApiDatasetMetadata(datasetIdForWDPAGeometries);
    // get the source information, including the vector tile URL, for WDPA Geometries
    const sourceForWDPAGeometries = getTileLayerSourceForWDPAGeometries(metadataForWDPAGeometries);
    // add the WDPA vector tile layer to the map
    addVectorTileLayerToMap(map, 'wdpa-tile-cache', sourceForWDPAGeometries, 'wdpa_protected_areas_201909');

});


// When a click event occurs on a feature in the WDPA vector layer,
// open a popup at the location of the click.
map.on('click', 'wdpa-tile-cache', async (e) => {
    const features = map.queryRenderedFeatures(e.point, {layers: ['wdpa-tile-cache']});
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(await popupContentForWDPA(features[0]))
    .addTo(map);
});


// Change the cursor to a pointer when the mouse is over the WDPA layer.
map.on('mouseenter', 'wdpa-tile-cache', function() {
    map.getCanvas().style.cursor = 'pointer';
});


// Change it back to a pointer when it leaves.
map.on('mouseleave', 'wdpa-tile-cache', function() {
    map.getCanvas().style.cursor = '';
});

