mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/dark-v10', // style URL
zoom: 10, // starting zoom
center: [-77.432, 25.0306] // starting position
});
 
map.on('load', () => {
// Load an image from an external URL.
map.loadImage(
'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
(error, image) => {
if (error) throw error;
 
// Add the image to the map style.
map.addImage('cat', image);
 
// Add a data source containing one point feature.
map.addSource('point', {
'type': 'geojson',
'data': {
'type': 'FeatureCollection',
'features': [
{
'type': 'Feature',
'geometry': {
'type': 'Point',
'coordinates': [-77.4144, 25.0759]
}
}
]
}
});
 
// Add a layer to use the image to represent the data.
map.addLayer({
'id': 'points',
'type': 'symbol',
'source': 'point', // reference the data source
'layout': {
'icon-image': 'cat', // reference the image
'icon-size': 0.25
}
});
}
);
});