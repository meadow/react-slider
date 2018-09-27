"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createReactClass = _interopRequireDefault(require("create-react-class"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function limitToBoundary(number, min, max) {
  if (number > max) {
    number = max;
  }

  if (number < min) {
    number = min;
  }

  return number;
}

function limitToStep(number, step) {
  return Math.round(number / step) * step;
}

var Slider = (0, _createReactClass.default)({
  displayName: "Slider",
  propTypes: {
    min: _propTypes.default.number,
    max: _propTypes.default.number,
    step: _propTypes.default.number,
    value: _propTypes.default.number,
    defaultValue: _propTypes.default.number,
    onChange: _propTypes.default.func,
    // eslint-disable-line
    className: _propTypes.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      className: null,
      defaultValue: null,
      min: 0,
      max: 100,
      step: null,
      value: null,
      onChange: null
    };
  },
  getInitialState: function getInitialState() {
    return {
      value: this.props.defaultValue
    };
  },
  triggerEvent: function triggerEvent(eventName, eventData) {
    var handler = this.props["on".concat(capitalize(eventName))];

    if (handler) {
      handler(eventData);
    }
  },
  calculatePositionAndSetValue: function calculatePositionAndSetValue(pageX) {
    var _this$props = this.props,
        max = _this$props.max,
        min = _this$props.min,
        step = _this$props.step,
        value = _this$props.value;
    var mousePosition = pageX - this.trackElement.getBoundingClientRect().left;
    var positionRatio = mousePosition / this.trackElement.offsetWidth;
    var offsetNewValue = (max - min) * positionRatio;

    if (step) {
      offsetNewValue = limitToStep(offsetNewValue, step);
    }

    var newValue = limitToBoundary(offsetNewValue + min, min, max);

    if (!value) {
      this.setState({
        value: newValue
      });
    }

    this.triggerEvent('change', newValue);
  },
  createTrackRef: function createTrackRef(trackElement) {
    this.trackElement = trackElement;
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
    var _this$props2 = this.props,
        max = _this$props2.max,
        min = _this$props2.min,
        step = _this$props2.step;
    var stepsJSX = [];

    if (step) {
      var numberOfSteps = Math.floor((max - min) / step);

      for (var i = 0; i <= numberOfSteps; i++) {
        var stepValueOffset = i * step;
        var stepPercent = stepValueOffset / (max - min) * 100;
        var sliderStyle = {
          left: "".concat(stepPercent, "%")
        };
        stepsJSX.push(_react.default.createElement("div", {
          className: "slider__step",
          style: sliderStyle,
          key: i
        }));
      }
    }

    return stepsJSX;
  },
  render: function render() {
    var _this$props3 = this.props,
        className = _this$props3.className,
        max = _this$props3.max,
        min = _this$props3.min;
    var active = this.state.active;
    var sliderClassName = (0, _classnames.default)(className, {
      slider: true,
      'slider--active': active
    });
    var value = this.props.value || this.state.value;
    var valuePercent = (value - min) / (max - min) * 100;
    var stepsJSX = this.renderSteps();
    var thumbStyle = {
      left: "".concat(valuePercent, "%")
    };
    return _react.default.createElement("div", {
      className: sliderClassName,
      onMouseDown: this.handleSliderMouseDown,
      onTouchStart: this.handleTouchStart
    }, _react.default.createElement("div", {
      className: "slider__track",
      ref: this.createTrackRef
    }, stepsJSX, _react.default.createElement("div", {
      className: "slider__thumb",
      style: thumbStyle
    })));
  }
});
var _default = Slider;
exports.default = _default;