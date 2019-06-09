import Model from './model';
import SliderError from './SliderError';

// sample model, default values(don't set anything in this model, create one if the need arises)
const model = new Model();

test('Check custom settings', () => {
  const custom = new Model('selector', { min: 50 });
  const { min } = custom.getState();
  expect(min).toBe(50);
});

// helper for error checks
function sliderErrorCheck(key, val, type) {
  const res = model.validate(key, val);
  expect(res).toBeInstanceOf(SliderError);
  expect(res.type).toBe(type);
}

// model.validate
// Returns custom error with 'type' property

test('Only defined keys', () => {
  sliderErrorCheck('doesntExist', 20, 'notConf');
});

test('Only configurable keys', () => {
  // underlying model object has 'selector' property, but it can't be changed
  sliderErrorCheck('selector', 20, 'notConf');
});

test('Return custom error for invalid argument type', () => {
  const isNumber = ['value', 'min', 'max', 'step'];
  const isBool = ['showBubble', 'showSteps', 'horizontal'];

  isNumber.forEach(el => sliderErrorCheck(el, 'NaN', 'notNum'));
  isBool.forEach(el => sliderErrorCheck(el, 42, 'notBool'));
});

test('Get model property by key, if property is defined', () => {
  expect(model.getState().max).toBe(100);
});

test('Set model property only if the new value passed the validation', () => {
  const smodel = new Model('test', { value: 0 });

  expect(smodel.validate('value', 'string')).toBeInstanceOf(SliderError);
  smodel.setState({ value: 'string' });
  expect(smodel.getState().value).toBe(0);

  expect(smodel.validate('value', 5)).toBe(5);
  smodel.setState({ value: 5 });
  expect(smodel.getState().value).toBe(5);
});

// value validation
test('When setting the value, return a number, parse and round it if necessary', () => {
  expect(model.validate('value', 5)).toBe(5);
  expect(model.validate('value', 5.4)).toBe(5);
  expect(model.validate('value', 5.6)).toBe(6);
  expect(model.validate('value', '5')).toBe(5);
});

test("If value is too big or too small, set it to the model's max or min", () => {
  const { max, min } = model.getState();
  expect(model.validate('value', -10)).toBe(min);
  expect(model.validate('value', 200)).toBe(max - min);
});

test('Check negative value setting', () => {
  const negative = new Model('none', { min: -50, max: 50 });

  expect(negative.validate('value', -30)).toBe(-30);
});

// min/max validation
test('Min value should be less than max and vice versa', () => {
  sliderErrorCheck('min', 120, 'notMin');
  sliderErrorCheck('max', -20, 'notMax');
});

// step validation
test(`Step should be more than zero, less than max/min difference 
and max/min difference should be divisable by it`, () => {
  sliderErrorCheck('step', -4, 'notStep');
  sliderErrorCheck('step', 13, 'notStep');
  sliderErrorCheck('step', 200, 'notStep');
});
