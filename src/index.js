import React from 'react';
import ReactDOM from 'react-dom';
import Location from './Location';

window.onload = () => {
  var country = document.querySelector('#country-dropdown');
  var container = document.querySelector('#container');
  var location;

  location = ReactDOM.render(
    <Location
      className='location'
      placeholder='Where are you?'
      country={ country.value }
      noMatching='Sorry, I can not find {{value}}.'
      />,
    container
  );

  country.addEventListener('change', () => {
    location.updateCountry(country.value);
  });
};
