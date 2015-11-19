# React geo location component based on Google Maps

The component uses Google Maps API to fetch the locations. It uses [Awesomplete](http://leaverou.github.io/awesomplete/) as a hard dependency for the dropdown.

Check out the demo [here](http://krasimir.github.io/react-place).

![react-place](http://work.krasimirtsonev.com/react-place/react-place.gif)

## Installation

```
npm install react-place
```

## Dependencies

* Of course [react](https://www.npmjs.com/package/react) and [react-dom](https://www.npmjs.com/package/react-dom). You need to have these modules installed.
* [Awesomplete](http://leaverou.github.io/awesomplete/) - installed automatically while running `npm install react-place`. It comes with the component so you don't need to have it loaded on the page.
* Google Maps API - you have to add `<script src="//maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places"></script>` on the page to have the component working.

## Usage (ES6)

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

## Usage ES5

```js
var React = require('react');
var ReactDOM = require('react-dom');
var Location = require('react-place');
var createLocation = React.createFactory(Location);

function onLocationSet (data) {
  // data.description
  // data.coords.lat
  // data.coords.lng
}

var container = document.querySelector('#container');
var LocationComp = createLocation({
  className: 'location',
  placeholder: 'Where are you?',
  country: country.value,
  noMatching: 'Sorry, I can not find {{value}}.',
  onLocationSet: onLocationSet
});

var location = ReactDOM.render(LocationComp, container);
```

If you need to update the country dynamically use the following API:

```js
location.updateCountry('FR');
```

## Testing

```
npm run test
```
