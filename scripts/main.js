L.Icon.Default.imagePath = 'images/';

// Crea mapa de Leaflet
var map = L.map('map', {
  center: [23.1341, -82.3617],
  zoom: 15
});

// Agrega capa base de Stamen
// new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
// minZoom: 0,
// maxZoom: 19,
// attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
// }).addTo(map);

// Agrega capa base de Stamen via MapProxy
var baseLayer = new L.tileLayer('http://localhost:8080/tiles/1.0.0/stamen.watercolor/WGS84/{z}/{x}/{y}.png', {
  minZoom: 0,
  maxZoom: 17,
  attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
}).addTo(map);

// Agrega capa con datos de GeoJSON
var schoolsLayer = L.geoJson(schools, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 10,
      color: '#000',
      weight: 3,
      opacity: 0.5,
      fillOpacity: 0.9,
      fillColor: getRandomColor()
    });
  },
  onEachFeature: function(feature, layer) {
    var text = feature.properties.name ? feature.properties.name : 'Escuela sin nombre';
    layer.bindPopup(text);
  }
}).addTo(map);

// Initializa buscador
var fuse = new Fuse(schools.features, {
  keys: ['properties.name']
});

// Agrega caja de búsqueda
var searchControl = new L.Control.Search({
  layer: schoolsLayer,
  propertyName: 'name',
  circleLocation: false,
  moveToLocation: function(latlng, title, map) {
    var zoom = map.getBoundsZoom(latlng.layer.getBounds());
    map.setView(latlng, zoom);
  },
  textPlaceholder: 'Buscar...',
  textErr: 'No hay resultados.',
  textCancel: 'Cancelar',
  filterData: function(text, records) {
    var filter = {};
    fuse.search(text).forEach(function(result) {
      filter[result.properties.name] = records[result.properties.name];
    });
    return filter;
  }
});

searchControl.on('search:locationfound', function(e) {
  e.layer.setStyle({radius: 20});
  e.layer.openPopup();
}).on('search:collapsed', function(e) {
  schoolsLayer.eachLayer(function(layer) {  //restore feature color
    layer.setStyle({radius: 10});
  });
});

searchControl.addTo(map);

// Genera colores aleatorios
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
