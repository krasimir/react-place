function createAutocompleteService() {
  return new global.google.maps.places.AutocompleteService();
};

function createGeocoder() {
  return new global.google.maps.Geocoder();
};

export default {
  createAutocompleteService,
  createGeocoder
};

