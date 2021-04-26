


  mapboxgl.accessToken =mapToken;//defined at top of show ejs file as script
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: result.geometry.coordinates, // starting position [lng, lat]
  zoom: 8 // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl());
  
new mapboxgl.Marker({ color: 'black', rotation: 45 })
.setLngLat(result.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({pffset:25})
    .setHTML(
        `<h3>${result.title}</h3> <p>${result.location}</p>`
    )
)
.addTo(map);
