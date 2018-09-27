import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function limitToBoundary (number, min, max) {
  if (number > max) {
    number = max;
  }
  if (number < min) {
    number = min;
  }
  return number;
}

function limitToStep (number, step) {
  return Math.round(number / step) * step;
}

const Slider = createReactClass({
  propTypes: {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func, // eslint-disable-line
    className: PropTypes.string
  },

  getDefaultProps () {
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

  getInitialState () {
    return {
      value: this.props.defaultValue
    };
  },

  triggerEvent (eventName, eventData) {
    const handler = this.props[`on${capitalize(eventName)}`];
    if (handler) {
      handler(eventData);
    }
  },

  calculatePositionAndSetValue (pageX) {
    const { max, min, step, value } = this.props;
    const mousePosition = pageX - this.trackElement.getBoundingClientRect().left;
    const positionRatio = mousePosition / this.trackElement.offsetWidth;
    let offsetNewValue = ((max - min) * positionRatio);
    if (step) {
      offsetNewValue = limitToStep(offsetNewValue, step);
    }
    const newValue = limitToBoundary((offsetNewValue + min), min, max);
    if (!value) {
      this.setState({
        value: newValue
      });
    }
    this.triggerEvent('change', newValue);
  },

  createTrackRef (trackElement) {
    this.trackElement = trackElement;
  },

  handleSliderMouseDown (event) {
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

  handleMouseMove (event) {
    event.preventDefault();
    this.calculatePositionAndSetValue(event.pageX);
  },

  handleMouseUp (event) {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.calculatePositionAndSetValue(event.pageX);
    this.setState({
      active: false
    });
  },

  handleTouchStart (event) {
    event.preventDefault();
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
    this.calculatePositionAndSetValue(event.touches[0].pageX);
    this.setState({
      active: true
    });
  },

  handleTouchMove (event) {
    event.preventDefault();
    this.calculatePositionAndSetValue(event.touches[0].pageX);
  },

  handleTouchEnd () {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    this.setState({
      active: false
    });
  },

  renderSteps () {
    const { max, min, step } = this.props;
    const stepsJSX = [];

    if (step) {
      const numberOfSteps = Math.floor((max - min) / step);
      for (let i = 0; i <= numberOfSteps; i++) {
        const stepValueOffset = i * step;
        const stepPercent = (stepValueOffset / (max - min)) * 100;
        const sliderStyle = {
          left: `${stepPercent}%`
        };
        stepsJSX.push(<div className="slider__step" style={sliderStyle} key={i} />);
      }
    }

    return stepsJSX;
  },

  render () {
    const { className, max, min } = this.props;
    const { active } = this.state;
    const sliderClassName = cx(className, {
      slider: true,
      'slider--active': active
    });
    const value = this.props.value || this.state.value;
    const valuePercent = ((value - min) / (max - min)) * 100;
    const stepsJSX = this.renderSteps();
    const thumbStyle = {
      left: `${valuePercent}%`
    };

    return (
      <div
        className={sliderClassName}
        onMouseDown={this.handleSliderMouseDown}
        onTouchStart={this.handleTouchStart}>

        <div className="slider__track" ref={this.createTrackRef}>
          {stepsJSX}
          <div className="slider__thumb" style={thumbStyle} />
        </div>
      </div>
    );
  }
});

export default Slider;
