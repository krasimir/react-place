var React = require('react');
var ReactDOM = require('react-dom');
var Location = require('../../lib/Location');
var createLocation = React.createFactory(Location);

function onLocationSet(value) {
  var pre = document.querySelector('pre');

  pre.innerHTML = JSON.stringify(value, null, 2);
}

window.onload = function () {
  var country = document.querySelector('#country-dropdown');
  var container = document.querySelector('#container');
  var LocationComp = createLocation({
    className: 'location',
    placeholder: 'Where are you?',
    country: country.value,
    noMatching: 'Sorry, I can not find {{value}}.',
    onLocationSet: onLocationSet
  });
  var location = ReactDOM.render(LocationComp, container);

  country.addEventListener('change', function () {
    location.updateCountry(country.value);
  });

};

