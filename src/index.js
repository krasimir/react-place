import React from 'react';
import ReactDOM from 'react-dom';
import Location from './Location';

window.onload = () => {
  ReactDOM.render(
    <Location />,
    document.querySelector('#container')
  );
};
