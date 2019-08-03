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
    hasInterval: false,
    showBubble: true,
    showSteps: false,
    isHorizontal: true,
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
    this._validateSliderValue = this._validateSliderValue.bind(this);
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
      case 'hasInterval':
      case 'showBubble':
      case 'showSteps':
      case 'isHorizontal':
        return typeof value !== 'boolean'
          ? new SliderError(ErrorType.BOOL, key)
          : value;
      default:
        return new SliderError(ErrorType.CONF, key);
    }
  }

  validate(key: string, value: number | string | boolean) {
    const newValue = Model.checkType(key, value);
    const { min, max } = this.getState();

    if (newValue instanceof SliderError) {
      return newValue;
    }

    switch (key) {
      case 'value':
      case 'firstValue':
      case 'secondValue':
        return this._validateSliderValue(key, newValue as number);
      case 'min':
        return newValue >= max ? new SliderError(ErrorType.MIN, key) : newValue;
      case 'max':
        return newValue <= min ? new SliderError(ErrorType.MAX, key) : newValue;
      case 'step':
        const invalidStep = newValue <= 0 || newValue > max - min;
        return invalidStep ? new SliderError(ErrorType.STEP, key) : newValue;
      default:
        return newValue;
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

    if (state.hasInterval) {
      this._setValue('value', newValue('value'));
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

  private _validateSliderValue(
    key: 'value' | 'firstValue' | 'secondValue',
    value: number,
  ) {
    const {
      hasInterval,
      firstValue,
      secondValue,
      step,
      min,
      max,
    } = this.getState();

    if (hasInterval) {
      const isFirst =
        key === 'value'
          ? Math.abs(value - firstValue) < Math.abs(value - secondValue)
          : key === 'firstValue';

      const firstAtMax = isFirst && value >= secondValue - step;
      if (firstAtMax) return firstValue;

      const noInterval = isFirst && value > max;
      if (noInterval) return min;

      const secondAtMin = !isFirst && value <= firstValue + step;
      if (secondAtMin) return secondValue;
    }

    const rawValue = value - min;
    const length = max - min;

    if (length % step !== 0) {
      const tail = Math.floor(length / step) * step;
      const valueRemainder = rawValue - tail;
      const stepRemainder = length - tail;
      if (valueRemainder > stepRemainder / 2) return max;
    }

    const result = min + step * Math.round(rawValue / step);

    if (result < min) return min;
    if (result > max) return max;
    return result;
  }

  private _setValue(key: string, newValue: number | string | boolean) {
    const { meta, state } = this._model;
    const { hasInterval, firstValue, secondValue } = state;
    const result = this.validate(key, newValue);

    if (result instanceof SliderError) {
      meta.errors.push(result.getMessage());
      result.show();
      return;
    }

    if (key === 'value' && hasInterval) {
      const isFirst =
        Math.abs(<number>result - firstValue) <
        Math.abs(<number>result - secondValue);
      const newKey = isFirst ? 'firstValue' : 'secondValue';
      state[newKey] = <number>result;
    } else {
      state[key] = result;
    }
  }
}

export default Model;
