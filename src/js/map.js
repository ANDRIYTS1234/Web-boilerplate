import L from 'leaflet';

const TILES_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; OpenStreetMap contributors';

let map = null;
let marker = null;

const createMap = () => {
  map = L.map('info-map');
  L.tileLayer(TILES_URL, { attribution: ATTRIBUTION }).addTo(map);
  marker = L.circleMarker([0, 0], { radius: 8, color: '#f75c49' }).addTo(map);
};

export const hideMap = () => {
  document.getElementById('info-map').hidden = true;
};

export const toggleMap = (coordinates) => {
  const container = document.getElementById('info-map');
  container.hidden = !container.hidden;

  if (container.hidden || !coordinates) return;

  if (!map) {
    createMap();
  }

  const position = [Number(coordinates.latitude), Number(coordinates.longitude)];
  map.invalidateSize();
  map.setView(position, 4);
  marker.setLatLng(position);
};
