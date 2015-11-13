import React from 'react';
import ReactDOM from 'react-dom';
import Location from './Location';

window.onload = () => {
  var country = document.querySelector('#country-dropdown');
  var location;

  location = ReactDOM.render(
    <Location
      className='location'
      placeholder='Where are you?'
      country={ country.value }
      />,
    document.querySelector('#container')
  );

  country.addEventListener('change', () => {
    location.updateCountry(country.value);
  });
};
