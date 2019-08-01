import { debounce } from './utils';
import SliderError, { ErrorType } from './SliderError';
import Observable from '../Observable/Observable';
import { Options, ModelType } from '../types';

const getInitialState = (function memoizeDefaults() {
  const defaults = {
    value: 0,
    firstValue: 0,
    secondValue: 100,
    min: 0,
    max: 100,
    step: 1,
    interval: false,
    showBubble: true,
    showSteps: false,
    horizontal: true,
  };

  return (): ModelType => ({
    state: { ...defaults },
    meta: { errors: [] },
  });
})();

class Model extends Observable {
  private _model: ModelType;

  constructor(options: Options | null = null) {
    super();

    this._model = getInitialState();
    if (options) this.setState(options);

    this.validate = this.validate.bind(this);
    this._validateValue = this._validateValue.bind(this);
    this._setValue = this._setValue.bind(this);
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.takeMeta = this.takeMeta.bind(this);
  }

  static checkType(key: string, value: any) {
    switch (key) {
      case 'value':
      case 'firstValue':
      case 'secondValue':
      case 'max':
      case 'min':
      case 'step':
        return Number.isNaN(parseFloat(value))
          ? new SliderError(ErrorType.NUM, key)
          : parseFloat(value);
      case 'interval':
      case 'showBubble':
      case 'showSteps':
      case 'horizontal':
        return typeof value !== 'boolean'
          ? new SliderError(ErrorType.BOOL, key)
          : value;
      default:
        return new SliderError(ErrorType.CONF, key);
    }
  }

  private _validateValue(
    key: 'value' | 'firstValue' | 'secondValue',
    value: number,
  ) {
    const state = this.getState();

    const firstAtMax =
      key === 'firstValue' && value >= state.secondValue - state.step;
    if (firstAtMax) return state.firstValue;

    const noInterval = key === 'firstValue' && value > state.max;
    if (noInterval) return state.min;

    const secondAtMin =
      key === 'secondValue' && value <= state.firstValue + state.step;
    if (secondAtMin) return state.secondValue;

    const rawValue = value - state.min;
    const length = state.max - state.min;

    if (length % state.step !== 0) {
      const tail = Math.floor(length / state.step) * state.step;
      const valueRemainder = rawValue - tail;
      const stepRemainder = length - tail;
      if (valueRemainder > stepRemainder / 2) return state.max;
    }

    const result = state.min + state.step * Math.round(rawValue / state.step);

    if (result < state.min) return state.min;
    if (result > state.max) return state.max;
    return result;
  }

  validate(key: string, value: number | string | boolean) {
    const newValue = Model.checkType(key, value);
    const state = this.getState();

    if (newValue instanceof SliderError) {
      return newValue;
    }

    switch (key) {
      case 'value':
      case 'firstValue':
      case 'secondValue':
        return this._validateValue(key, value as number);
      case 'min':
        return newValue >= state.max
          ? new SliderError(ErrorType.MIN, key)
          : newValue;
      case 'max':
        return newValue <= state.min
          ? new SliderError(ErrorType.MAX, key)
          : newValue;
      case 'step':
        const invalidStep = newValue <= 0 || newValue > state.max - state.min;
        return invalidStep ? new SliderError(ErrorType.STEP, key) : newValue;
      default:
        return newValue;
    }
  }

  private _setValue(key: string, newValue: number | string | boolean) {
    const { state, meta } = this._model;
    const result = this.validate(key, newValue);

    if (result instanceof SliderError) {
      meta.errors.push(result.getMessage());
      result.show();
    } else {
      state[key] = result;
    }
  }

  setState(options: Options = {}) {
    if (!(options instanceof Object)) {
      console.log('Invalid object');
      return;
    }

    const isValue = (key: string) =>
      key === 'value' || key === 'firstValue' || key === 'secondValue';
    const filteredOptions = Object.keys(options).filter(key => !isValue(key));

    filteredOptions.forEach(key => {
      this._setValue(key, options[key]);
    });

    const { state } = this._model;
    const newValue = (key: string) =>
      options[key] === undefined ? state[key] : options[key];

    if (state.interval) {
      this._setValue('firstValue', newValue('firstValue'));
      this._setValue('secondValue', newValue('secondValue'));
    } else {
      this._setValue('value', newValue('value'));
    }

    if (filteredOptions.length === 0) {
      this.notify('update');
    } else {
      debounce(() => {
        this.notify('render');
      }, 200)();
    }
  }

  getState() {
    return { ...this._model.state };
  }

  takeMeta() {
    const meta = { ...this._model.meta };
    this._model.meta.errors = [];
    return meta;
  }
}

export default Model;
