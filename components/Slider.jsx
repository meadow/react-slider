'use strict';

var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');

var capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var limitToBoundary = function (number, min, max) {
  if (number > max) {
    number = max;
  }
  if (number < min) {
    number = min;
  }
  return number;
};

var limitToStep = function (number, step) {
  return Math.round(number / step) * step;
};

var Slider = React.createClass({
  propTypes: {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    className: PropTypes.string
  },

  getDefaultProps: function () {
    return {
      min: 0,
      max: 100
    };
  },

  getInitialState: function () {
    return {
      value: this.props.defaultValue
    };
  },

  triggerEvent: function (eventName, eventData) {
    var handler = this.props['on' + capitalize(eventName)];
    if (handler) {
      handler(eventData);
    }
  },

  calculatePositionAndSetValue: function (pageX) {
    var trackElement = this.refs.track.getDOMNode();
    var mousePosition = pageX - trackElement.getBoundingClientRect().left;
    var positionRatio = mousePosition / trackElement.offsetWidth;
    var offsetNewValue = ((this.props.max - this.props.min) * positionRatio);
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

  handleSliderMouseDown: function (event) {
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

  handleMouseMove: function (event) {
    event.preventDefault();
    this.calculatePositionAndSetValue(event.pageX);
  },

  handleMouseUp: function (event) {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.calculatePositionAndSetValue(event.pageX);
    this.setState({
      active: false
    });
  },

  renderSteps: function () {
    var stepsJSX = [];
    if (this.props.step) {
      var numberOfSteps = Math.floor((this.props.max - this.props.min) / this.props.step);
      for (var i = 0; i <= numberOfSteps; i++) {
        var stepValueOffset = i * this.props.step;
        var stepPercent = (stepValueOffset / (this.props.max - this.props.min)) * 100;
        var sliderStyle = {
            left: stepPercent + '%'
        };
        stepsJSX.push(<div className="slider__step" style={sliderStyle} />);
      }
    }
    return stepsJSX;
  },

  render: function () {
    var sliderClassName = cx({
      slider: true,
      'slider--active': this.state.active
    });
    if (this.props.className) {
      sliderClassName = sliderClassName + ' ' + this.props.className;
    }
    var value = this.props.value || this.state.value;
    var valuePercent = ((value - this.props.min) / (this.props.max - this.props.min)) * 100;
    var stepsJSX = this.renderSteps();
    var thumbStyle = {
      left: valuePercent + '%'
    };
    return (
      <div className={sliderClassName} onMouseDown={this.handleSliderMouseDown}>
        <div className="slider__track" ref="track">
          {stepsJSX}
          <div className="slider__thumb" style={thumbStyle}></div>
        </div>
      </div>
    );
  }
});

module.exports = Slider;
