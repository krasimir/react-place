"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function createAutocompleteService() {
  return new global.google.maps.places.AutocompleteService();
};

function createGeocoder() {
  return new global.google.maps.Geocoder();
};

exports.default = {
  createAutocompleteService: createAutocompleteService,
  createGeocoder: createGeocoder
};
module.exports = exports['default'];
//# sourceMappingURL=google.js.map