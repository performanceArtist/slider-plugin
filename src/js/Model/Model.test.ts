import Model from './Model';
import View from '../Views/Main';
import Controller from '../Controller/Controller';
import SliderError, { ErrorType } from './ConfigError';

document.body.innerHTML = '<div id="test"></div>';

const root = document.querySelector('#test');
const model = new Model();
const view = new View(model, root);
const controller = new Controller(model, view);

function configErrorCheck(
  key: string,
  value: number | string | boolean,
  type: ErrorType,
) {
  const result = model.validate(key, value) as SliderError;
  expect(result).toBeInstanceOf(SliderError);
  expect(result.getType()).toBe(type);
}

describe('Model', () => {
  describe('constructor', () => {
    it('Sets custom settings on initialization', () => {
      const custom = new Model({ min: 50 });
      const { min } = custom.getState();
      expect(min).toBe(50);
    });
  });

  describe('getState', () => {
    it('Returns state object copy on "getState" method call', () => {
      const state = model.getState();
      expect(state.max).toBe(100);
      state.max = 0;
      expect(model.getState().max).toBe(100);
    });
  });

  describe('setState', () => {
    it('Sets model property only if the new value passed the validation', () => {
      expect(model.validate('value', 'string')).toBeInstanceOf(SliderError);
      model.setState({ value: 'string' });
      expect(model.getState().value).toBe(0);

      expect(model.validate('value', 5)).toBe(5);
      model.setState({ value: 5 });
      expect(model.getState().value).toBe(5);
    });
  });

  describe('validate', () => {
    it('Sets only the defined keys, otherwise returns an error', () => {
      configErrorCheck('does-not-exist', 20, ErrorType.CONF);
    });

    it('Returns custom error for invalid argument type', () => {
      const isNumber = [
        'value',
        'firstValue',
        'secondValue',
        'min',
        'max',
        'step',
      ];
      const isBool = ['hasInterval', 'showBubble', 'showSteps', 'isHorizontal'];

      isNumber.forEach(el => configErrorCheck(el, 'NaN', ErrorType.NUM));
      isBool.forEach(el => configErrorCheck(el, 42, ErrorType.BOOL));
    });

    it('Checks that min value is less than max and vice versa', () => {
      configErrorCheck('min', 120, ErrorType.MIN);
      configErrorCheck('max', -20, ErrorType.MAX);
    });

    it(`Checks that step is more than zero, less than max/min difference `, () => {
      configErrorCheck('step', -4, ErrorType.STEP);
      configErrorCheck('step', 200, ErrorType.STEP);
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

    const hasIntervalModel = new Model({
      hasInterval: true,
      firstValue: 10,
      secondValue: 20,
    });

    it('Makes sure that the first value in hasInterval is less than the second', () => {
      expect(hasIntervalModel.validate('firstValue', 30)).toBe(10);
      expect(hasIntervalModel.validate('secondValue', 0)).toBe(20);
    });
  });
});
