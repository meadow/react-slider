'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var capitalize = function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var limitToBoundary = function limitToBoundary(number, min, max) {
  if (number > max) {
    number = max;
  }
  if (number < min) {
    number = min;
  }
  return number;
};

var limitToStep = function limitToStep(number, step) {
  return Math.round(number / step) * step;
};

var Slider = _react2['default'].createClass({
  displayName: 'Slider',

  propTypes: {
    min: _react.PropTypes.number,
    max: _react.PropTypes.number,
    step: _react.PropTypes.number,
    value: _react.PropTypes.number,
    defaultValue: _react.PropTypes.number,
    onChange: _react.PropTypes.func,
    className: _react.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      min: 0,
      max: 100
    };
  },

  getInitialState: function getInitialState() {
    return {
      value: this.props.defaultValue
    };
  },

  triggerEvent: function triggerEvent(eventName, eventData) {
    var handler = this.props['on' + capitalize(eventName)];
    if (handler) {
      handler(eventData);
    }
  },

  calculatePositionAndSetValue: function calculatePositionAndSetValue(pageX) {
    var trackElement = this.refs.track.getDOMNode();
    var mousePosition = pageX - trackElement.getBoundingClientRect().left;
    var positionRatio = mousePosition / trackElement.offsetWidth;
    var offsetNewValue = (this.props.max - this.props.min) * positionRatio;
    if (this.props.step) {
      offsetNewValue = limitToStep(offsetNewValue, this.props.step);
    }
    var newValue = offsetNewValue + this.props.min;
    newValue = limitToBoundary(newValue, this.props.min, this.props.max);
    if (!this.props.value) {
      this.setState({
        value: newValue
      });
    }
    this.triggerEvent('change', newValue);
  },

  handleSliderMouseDown: function handleSliderMouseDown(event) {
    if (event.button === 0 && event.buttons !== 2) {
      event.preventDefault();
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
      this.calculatePositionAndSetValue(event.pageX);
      this.setState({
        active: true
      });
    }
  },

  handleMouseMove: function handleMouseMove(event) {
    event.preventDefault();
    this.calculatePositionAndSetValue(event.pageX);
  },

  handleMouseUp: function handleMouseUp(event) {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.calculatePositionAndSetValue(event.pageX);
    this.setState({
      active: false
    });
  },

  handleTouchStart: function handleTouchStart(event) {
    event.preventDefault();
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
    this.calculatePositionAndSetValue(event.touches[0].pageX);
    this.setState({
      active: true
    });
  },

  handleTouchMove: function handleTouchMove(event) {
    event.preventDefault();
    this.calculatePositionAndSetValue(event.touches[0].pageX);
  },

  handleTouchEnd: function handleTouchEnd() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    this.setState({
      active: false
    });
  },

  renderSteps: function renderSteps() {
    var stepsJSX = [];
    if (this.props.step) {
      var numberOfSteps = Math.floor((this.props.max - this.props.min) / this.props.step);
      for (var i = 0; i <= numberOfSteps; i++) {
        var stepValueOffset = i * this.props.step;
        var stepPercent = stepValueOffset / (this.props.max - this.props.min) * 100;
        var sliderStyle = {
          left: stepPercent + '%'
        };
        stepsJSX.push(_react2['default'].createElement('div', { className: 'slider__step', style: sliderStyle, key: i }));
      }
    }
    return stepsJSX;
  },

  render: function render() {
    var sliderClassName = (0, _classnames2['default'])({
      slider: true,
      'slider--active': this.state.active
    });
    if (this.props.className) {
      sliderClassName = sliderClassName + ' ' + this.props.className;
    }
    var value = this.props.value || this.state.value;
    var valuePercent = (value - this.props.min) / (this.props.max - this.props.min) * 100;
    var stepsJSX = this.renderSteps();
    var thumbStyle = {
      left: valuePercent + '%'
    };
    return _react2['default'].createElement(
      'div',
      {
        className: sliderClassName,
        onMouseDown: this.handleSliderMouseDown,
        onTouchStart: this.handleTouchStart },
      _react2['default'].createElement(
        'div',
        { className: 'slider__track', ref: 'track' },
        stepsJSX,
        _react2['default'].createElement('div', { className: 'slider__thumb', style: thumbStyle })
      )
    );
  }
});

exports['default'] = Slider;
module.exports = exports['default'];