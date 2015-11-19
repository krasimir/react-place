import Location from '../src/Location.jsx';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import predictions from './fixtures/predictions.js';

var component;
var onLocationSet = sinon.stub();
var google = {
  createAutocompleteService: function () {
    return {
      getPlacePredictions: sinon.stub().callsArgWith(1, predictions())
    };
  },
  createGeocoder: function () {
    return {
      geocode: sinon.stub().callsArgWith(1, [
        {
          geometry: {
            location: {
              lat: () => 0,
              lng: () => 0
            }
          }
        }
      ], 'OK')
    };
  }
};

function simulateKeyboardEvent(el, keyCode, eventType = 'keyup') {
  var evt = document.createEvent('Events');
  var code = typeof keyCode === 'string' ? keyCode.charCodeAt(0) : keyCode;

  evt.initEvent(eventType, true, true);
  evt.keyCode = evt.which = code;
  el.dispatchEvent(evt);
};

function simulateEvent(el, eventName) {
  var evt = document.createEvent('Event');

  evt.initEvent(eventName, true, true);
  el.dispatchEvent(evt);
};

describe('Given an instance of the Component', function () {

  describe('when we render the component', function () {

    before(() => {
      component = TestUtils.renderIntoDocument(
        <Location
          google={ google }
          onLocationSet={ onLocationSet } />
      );
    });

    it('should have an input field', function () {
      var input = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');

      expect(input).to.have.length.above(0, 'Expected to have element with tag <input>');
    });

    describe('and when we type a city name and choose some of the suggestions', function () {
      this.timeout(5000);
      it('should call onLocationSet', function (done) {
        var input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

        input.value = 'New';
        simulateKeyboardEvent(input, 'n');
        setTimeout(function () {
          simulateKeyboardEvent(input, 40, 'keydown');
          simulateKeyboardEvent(input, 40, 'keydown');
          simulateKeyboardEvent(input, 13, 'keydown');
          simulateEvent(input, 'awesomplete-selectcomplete');
          setTimeout(function () {
            expect(onLocationSet).to.be.called;
            done();
          }, 10);
        }, 10);
      });
    });

  });
});
