import Model from './model';
import SliderError, { ErrorType } from './SliderError';

const model = new Model();

// helper for error checks
function sliderErrorCheck(
  key: string,
  value: number | string | boolean,
  type: ErrorType
) {
  const result = model.validate(key, value) as SliderError;
  expect(result).toBeInstanceOf(SliderError);
  expect(result.getType()).toBe(type);
}

describe('Model', () => {
  it('Sets custom settings on initialization', () => {
    const custom = new Model({ min: 50 });
    const { min } = custom.getState();
    expect(min).toBe(50);
  });

  it('Sets only the defined keys, otherwise returns an error', () => {
    sliderErrorCheck('does-not-exist', 20, ErrorType.CONF);
  });

  it('Returns custom error for invalid argument type', () => {
    const isNumber = [
      'value',
      'firstValue',
      'secondValue',
      'min',
      'max',
      'step'
    ];
    const isBool = ['interval', 'showBubble', 'showSteps', 'horizontal'];

    isNumber.forEach(el => sliderErrorCheck(el, 'NaN', ErrorType.NUM));
    isBool.forEach(el => sliderErrorCheck(el, 42, ErrorType.BOOL));
  });

  it('Returns state object copy on "getState" method call', () => {
    const state = model.getState();
    expect(state.max).toBe(100);
    state.max = 0;
    expect(model.getState().max).toBe(100);
  });

  it('Sets model property only if the new value passed the validation', () => {
    const smodel = new Model({ value: 0 });

    expect(smodel.validate('value', 'string')).toBeInstanceOf(SliderError);
    smodel.setState({ value: 'string' });
    expect(smodel.getState().value).toBe(0);

    expect(smodel.validate('value', 5)).toBe(5);
    smodel.setState({ value: 5 });
    expect(smodel.getState().value).toBe(5);
  });

  it('When setting the value, returns a number, parses and rounds it if necessary', () => {
    expect(model.validate('value', 5)).toBe(5);
    expect(model.validate('value', 5.4)).toBe(5);
    expect(model.validate('value', 5.6)).toBe(6);
    expect(model.validate('value', '5')).toBe(5);
  });

  it("If value is too big or too small, sets it to the model's max or min", () => {
    const { max, min } = model.getState();
    const negative = new Model({ min: -50, max: 50 });

    expect(model.validate('value', -10)).toBe(min);
    expect(model.validate('value', 200)).toBe(max - min);
    expect(negative.validate('value', -30)).toBe(-30);
  });

  it('Check that min value is less than max and vice versa', () => {
    sliderErrorCheck('min', 120, ErrorType.MIN);
    sliderErrorCheck('max', -20, ErrorType.MAX);
  });

  it(`Checks that step is more than zero, less than max/min difference 
  and max/min difference is divisable by it`, () => {
    sliderErrorCheck('step', -4, ErrorType.STEP);
    sliderErrorCheck('step', 13, ErrorType.STEP);
    sliderErrorCheck('step', 200, ErrorType.STEP);
  });
});
