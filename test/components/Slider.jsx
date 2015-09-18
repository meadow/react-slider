var test = require('tape');
var React = require('react/addons');
var { TestUtils } = React.addons;
var classes = require('dom-classes');

var Slider = require('../../components/Slider.jsx');

var TestApp = React.createClass({
  getInitialState: () => new Object(),
  render: function () {
    return <Slider {...this.state} />;
  }
});
// TestUtils.renderIntoDocument won't work because some tests depend on DOM dimensions
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
var testApp = React.render(<TestApp />, iframe.contentDocument.body);
var slider = TestUtils.findRenderedComponentWithType(testApp, Slider);
var sliderElement = React.findDOMNode(slider);
var track = TestUtils.findRenderedDOMComponentWithClass(testApp, 'slider__track');
var trackElement = React.findDOMNode(track);
var thumb = TestUtils.findRenderedDOMComponentWithClass(testApp, 'slider__thumb');
var thumbElement = React.findDOMNode(thumb);
// Set slider dimensions for tests that depend on DOM dimensions
var trackLeft = trackElement.getBoundingClientRect().left;
var sliderWidth = 100;
sliderElement.style.height = '12px';
sliderElement.style.width = sliderWidth + 'px';

var reset = function () {
  testApp.replaceState({});
  slider.replaceState({});
  window.removeEventListener('mousemove', slider.handleMouseMove);
  window.removeEventListener('mouseup', slider.handleMouseUp);
};

test('Merges classes from props with default classes', function (t) {
  t.plan(4);
  t.equal(classes(sliderElement).length, 1, 'has one class when `className` is empty');
  t.ok(classes.has(sliderElement, 'slider'), 'has class `slider` when `className` is empty');
  testApp.setState({
    className: 'test'
  });
  t.ok(classes.has(sliderElement, 'slider'), 'has class `slider`');
  t.ok(classes.has(sliderElement, 'test'), 'has class `test`');
  reset();
});

test('Slider thumb moves to location corresponding to slider value', function (t) {
  t.plan(2);
  slider.setState({
    value: 50
  });
  t.equal(thumbElement.style.left, '50%', 'sets `slider__thumb` left to "50%"');
  slider.setState({
    value: 25
  });
  t.equal(thumbElement.style.left, '25%', 'sets `slider__thumb` left to "25%"');
  reset();
});

test('Slider value set according to mousedown location', function (t) {
  t.plan(2);
  TestUtils.Simulate.mouseDown(sliderElement, {
    pageX: trackLeft + (sliderWidth / 2),
    button: 0
  });
  t.equal(slider.state.value, 50, 'sets slider value to 50 when mousedown is in middle of slider element');
  reset();
  TestUtils.Simulate.mouseDown(sliderElement, {
    pageX: trackLeft + (sliderWidth / 2),
    button: 2
  });
  t.equal(typeof slider.state.value, 'undefined', 'does nothing on mousedown if not left click');
  reset();
});

test('Slider value set according to mousemove location', function (t) {
  t.plan(3);
  TestUtils.Simulate.mouseDown(sliderElement, {
    pageX: trackLeft,
    button: 0
  });
  slider.handleMouseMove({
    pageX: trackLeft + (sliderWidth / 2),
    preventDefault: () => {}
  });
  t.equal(slider.state.value, 50, 'sets slider value to 50 when mousemove is in middle of slider element');
  slider.handleMouseMove({
    pageX: trackLeft + (sliderWidth * 2),
    preventDefault: () => {}
  });
  t.equal(slider.state.value, slider.props.max, 'sets slider value to max when mousemove is outside right bound of slider element');
  slider.handleMouseMove({
    pageX: trackLeft - sliderWidth,
    preventDefault: () => {}
  });
  t.equal(slider.state.value, slider.props.min, 'sets slider value to min when mousemove is outside left bound of slider element');
  reset();
});

test('Slider value set according to mouseup location', function (t) {
  t.plan(3);
  TestUtils.Simulate.mouseDown(sliderElement, {
    pageX: trackLeft,
    button: 0
  });
  slider.handleMouseUp({
    pageX: trackLeft + (sliderWidth / 2)
  });
  t.equal(slider.state.value, 50, 'sets slider value to 50 when mouseup is in middle of slider element');
  slider.handleMouseUp({
    pageX: trackLeft + (sliderWidth * 2)
  });
  t.equal(slider.state.value, slider.props.max, 'sets slider value to max when mouseup is outside right bound of slider element');
  slider.handleMouseUp({
    pageX: trackLeft - sliderWidth
  });
  t.equal(slider.state.value, slider.props.min, 'sets slider value to min when mouseup is outside left bound of slider element');
  reset();
});

test('Slider value can be locked to steps', function (t) {
  t.plan(2);
  testApp.setState({
    step: 25
  });
  slider.calculatePositionAndSetValue(trackLeft + (sliderWidth * 0.45));
  t.equal(slider.state.value, 50, 'sets slider value to 50 when step is 25 and mouse event is at 45% of slider\'s width');
  slider.calculatePositionAndSetValue(trackLeft + (sliderWidth * 0.1));
  t.equal(slider.state.value, 0, 'sets slider value to 0 when step is 25 and mouse event is at 10% of slider\'s width');
  reset();
});

test('Slider can operate as an uncontrolled component', function (t) {
  t.plan(2);
  var value = 50;
  var onChange = function (newValue) {
    value = newValue
  };
  var controlledSlider = React.render(<Slider defaultValue={value} onChange={onChange} />, iframe.contentDocument.body);
  var controlledSliderElement = React.findDOMNode(controlledSlider);
  var controlledThumb = TestUtils.findRenderedDOMComponentWithClass(controlledSlider, 'slider__thumb');
  var controlledThumbElement = React.findDOMNode(controlledThumb);
  var controlledTrack = TestUtils.findRenderedDOMComponentWithClass(controlledSlider, 'slider__track');
  var controlledTrackElement = React.findDOMNode(controlledTrack);
  // Set slider dimensions for tests that depend on DOM dimensions
  var controlledTrackLeft = controlledTrackElement.getBoundingClientRect().left;
  var controlledSliderWidth = 100;
  controlledSliderElement.style.height = '12px';
  controlledSliderElement.style.width = controlledSliderWidth + 'px';
  t.equal(controlledThumbElement.style.left, '50%', 'sets `slider__thumb` left to "50%"');
  controlledSlider.calculatePositionAndSetValue(controlledTrackLeft + (controlledSliderWidth * 0.25));
  t.equal(value, 25, 'emits proper value to onChange callback');
});

test('// Remove rendering iframe', function (t) {
  document.body.removeChild(iframe);
  t.pass('// iframe removed');
});