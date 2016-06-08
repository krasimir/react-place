'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _awesomplete = require('awesomplete');

var _awesomplete2 = _interopRequireDefault(_awesomplete);

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

var _google = require('./vendor/google');

var _google2 = _interopRequireDefault(_google);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NO_MATCHING = 'Unrecognised {{value}}, please check and re-enter.';
var DEFAULT_COUNTRY = 'US';

var compose = function compose() {
  var fns = arguments;

  return function (result) {
    for (var i = fns.length - 1; i >= 0; i--) {
      result = fns[i].call(this, result);
    }
    return result;
  };
};

var Location = function (_React$Component) {
  _inherits(Location, _React$Component);

  function Location() {
    _classCallCheck(this, Location);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Location).apply(this, arguments));
  }

  _createClass(Location, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('input', {
        type: 'text',
        className: this.props.className,
        style: this.props.style || '',
        placeholder: this.props.placeholder || 'Type your location here.'
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._googlePredictions = [];
      this._country = this.props.country || DEFAULT_COUNTRY;
      this._noMatching = this.props.noMatching || NO_MATCHING;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var input;
      var config = {
        minChars: 1,
        keepListItems: false,
        sort: function sort() {
          return 0;
        },
        item: function item(text, input) {
          return _awesomplete2.default.$.create('li', {
            innerHTML: text.replace(RegExp(_awesomplete2.default.$.regExpEscape(input.trim()), 'gi'), '<mark>$&</mark>'),
            'aria-selected': 'false'
          });
        }
      };

      input = _reactDom2.default.findDOMNode(this);
      this._autocomplete = new _awesomplete2.default(input, config);

      input.addEventListener('awesomplete-selectcomplete', this._handleAutocompleteSelect.bind(this));
      input.addEventListener('keyup', this._handleInputChange.bind(this));
    }
  }, {
    key: 'updateCountry',
    value: function updateCountry(country) {
      this._country = country;
    }
  }, {
    key: '_handleInputChange',
    value: function _handleInputChange(event) {
      var _this2 = this;

      var value = this._getInputValue();
      var updateAutocomplete = compose(this._autocomplete.evaluate.bind(this._autocomplete), function (list) {
        return _this2._autocomplete.list = list;
      }, function (list) {
        return list.map(function (item) {
          return item.description;
        });
      }, function (results) {
        return _this2._googlePredictions = results;
      });
      var fail = compose(updateAutocomplete, function (text) {
        return [{ description: text }];
      }, function (text) {
        return _this2._noMatching.replace('{{value}}', text);
      });
      var navKeys = [38, 40, 13, 27];
      var isItNavKey = navKeys.indexOf(event.keyCode) >= 0;

      if (!isItNavKey) {
        this._getPredictions(value).then(updateAutocomplete, fail);
      }
    }
  }, {
    key: '_handleAutocompleteSelect',
    value: function _handleAutocompleteSelect() {
      var _this3 = this;

      var value = this._getInputValue();
      var find = function find(list) {
        var l = list.filter(function (item) {
          return item.description === value;
        });

        return l.length > 0 ? l[0] : false;
      };
      var validate = function validate(item) {
        return item && item.place_id ? item.place_id : false;
      };
      var getPlaceId = compose(validate, find);
      var success = function success(location) {
        _this3.props.onLocationSet && _this3.props.onLocationSet({
          description: value,
          coords: {
            lat: location.lat(),
            lng: location.lng()
          }
        });
      };

      this._getCoordinates(getPlaceId(this._googlePredictions)).then(success);
    }
  }, {
    key: '_getInputValue',
    value: function _getInputValue() {
      return _reactDom2.default.findDOMNode(this).value;
    }
  }, {
    key: '_getPredictions',
    value: function _getPredictions(text) {
      var _this4 = this;

      var service = (this.props.google || _google2.default).createAutocompleteService();
      var isThereAnyText = !!text;

      if (isThereAnyText) {
        return new _promisePolyfill2.default(function (resolve, reject) {
          service.getPlacePredictions({
            input: text,
            componentRestrictions: { country: _this4._country },
            types: ['(regions)']
          }, function (result) {
            if (result !== null) {
              resolve(result);
            } else {
              reject(text);
            }
          });
        });
      }
      return new _promisePolyfill2.default(function (resolve, reject) {});
    }
  }, {
    key: '_getCoordinates',
    value: function _getCoordinates(placeId) {
      var geocoder = (this.props.google || _google2.default).createGeocoder();

      return new _promisePolyfill2.default(function (resolve, reject) {
        geocoder.geocode({ placeId: placeId }, function (results, status) {
          if (status === 'OK' && results && results.length > 0) {
            resolve(results[0].geometry.location);
          } else {
            reject(false);
          }
        });
      });
    }
  }]);

  return Location;
}(_react2.default.Component);

exports.default = Location;
;

Location.defaultProps = {
  className: '',
  style: {}
};

Location.propTypes = {
  onLocationSet: _react2.default.PropTypes.func,
  className: _react2.default.PropTypes.string,
  placeholder: _react2.default.PropTypes.string,
  country: _react2.default.PropTypes.string,
  noMatching: _react2.default.PropTypes.string,
  google: _react2.default.PropTypes.object,
  style: _react2.default.PropTypes.object
};
module.exports = exports['default'];
//# sourceMappingURL=Location.js.map