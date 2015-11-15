# React geo location component based on Google Maps

The component uses Google Maps API to fetch the locations. It uses [Awesomplete](http://leaverou.github.io/awesomplete/) as a hard dependency for the dropdown.

![react-place](http://work.krasimirtsonev.com/react-place/react-place.gif)

## Installation

```
npm install react-place
```

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Location from 'react-place';

var location;
var container = document.querySelector('...');

var onLocationSet = (data) => {
  // data.description
  // data.coords.lat
  // data.coords.lng
};

location = ReactDOM.render(
  <Location
    className='location'
    placeholder='Where are you?'
    country='US'
    noMatching='Sorry, I can not find {{value}}.'
    onLocationSet={ onLocationSet }
    />,
  container
);
```

If you need to update the country dynamically use the following API:

```js
location.updateCountry('FR');
```

## Testing

```
npm run test
```
