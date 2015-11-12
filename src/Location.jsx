'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import Awesomplete from 'awesomplete';
import R from 'ramda';
import Promise from 'promise-polyfill';

const NO_MATCHING = 'Unrecognised {{value}}, please check and re-enter.';

export default class Location extends React.Component {

  render() {
    return (
      <input
        type='text'
        className=''
        placeholder='Where are you?'
      />
    );
  }

  componentWillMount() {
    this._googlePredictions = [];
  }

  componentDidMount() {
    var input;
    var config = {
      minChars: 1,
      keepListItems: false,
      sort: function () { return 0; },
      item: function (text, input) {
        return Awesomplete.$.create('li', {
          innerHTML: text.replace(
            RegExp(Awesomplete.$.regExpEscape(input.trim()), 'gi'),
            '<mark class="needsclick">$&</mark>'
          ),
          'aria-selected': 'false',
          'class': 'needsclick' // Disable fastclick for suggestions
        });
      }
    };

    input = ReactDom.findDOMNode(this);
    input.addEventListener(
      'awesomplete-selectcomplete',
      this._handleAutocompleteSelect.bind(this)
    );
    this._autocomplete = new Awesomplete(input, config);

    input.addEventListener('keyup', this._handleInputChange.bind(this));
  }

  _handleInputChange() {
    var value = this._getInputValue();
    var updateAutocomplete = R.compose(
      this._autocomplete.evaluate.bind(this._autocomplete),
      (list) => this._autocomplete.list = list,
      R.map(R.prop('description')),
      (results) => this._googlePredictions = results
    );
    var fail = R.compose(
      updateAutocomplete,
      (text) => [{ description: text }],
      (text) => NO_MATCHING.replace('{{value}}', text),
      value
    );

    this._getPredictions(value).then(updateAutocomplete).catch(fail);
  }

  _handleAutocompleteSelect() {
    var value = this._getInputValue();
    var validate = (item) => item && item.place_id ? item.place_id : false;
    var getPlaceId = R.compose(validate, R.find(R.propEq('description', value)));
    var success = (location) => {
      this.props.onLocationSet && this.props.onLocationSet({
        description: value,
        coords: {
          lat: location.lat(),
          lng: location.lng()
        }
      });
    };

    this._getCoordinates(getPlaceId(this._googlePredictions)).then(success);
  }

  _getInputValue() {
    return ReactDom.findDOMNode(this).value;
  }

  _getPredictions(text) {
    var AutocompleteService = global.google.maps.places.AutocompleteService;
    var service = new AutocompleteService();

    return new Promise((resolve, reject) => {
      service.getPlacePredictions({
        input: text,
        componentRestrictions: { country: 'us' },
        types: ['(regions)']
      }, (result) => {
        if (result !== null) {
          resolve(result);
        } else {
          reject([]);
        }
      });
    });

  }

  _getCoordinates(placeId) {
    var Geocoder = global.google.maps.Geocoder;
    var geocoder = new Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ placeId: placeId }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          resolve(results[0].geometry.location);
        } else {
          reject(false);
        }
      });
    });
  }

};

Location.propTypes = {
  onLocationSet: React.PropTypes.func
};
