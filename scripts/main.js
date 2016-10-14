L.Icon.Default.imagePath = 'images/';

/* Crear mapa de Leaflet */
var map = L.map('map', {
  center: [23.1341, -82.3617],
  zoom: 14
});

/* Agregar capa base de stamen */
new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
  minZoom: 0,
  maxZoom: 18,
  attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
}).addTo(map);

/* Agregar capa con datos de GeoJSON */
L.geoJson(atm, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 10,
      color: '#FFF',
      weight: 3,
      opacity: 0.5,
      fillOpacity: 0.9,
      fillColor: getRandomColor()
    });
  },
  onEachFeature: function(feature, layer) {
    var text = feature.properties.name ? feature.properties.name : 'Cajero sin nombre';
    layer.bindPopup(text);
  }
}).addTo(map);

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
