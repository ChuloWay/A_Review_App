

  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
      center: restaurant.geometry.coordinates, // starting position [lng, lat]
      zoom: 10 // starting zoom
  });


new mapboxgl.Marker()
  .setLngLat(restaurant.geometry.coordinates)
  .addTo(map)
