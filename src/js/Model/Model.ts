import { debounce } from './utils';
import SliderError, { ErrorType } from './SliderError';
import Observable from '../Observable/Observable';
import { Options, ModelType } from '../types';
import config from './config';

class Model extends Observable {
  private _state: Options;
  private _meta: { errors: Array<string> };

  constructor(options: Options | null = null) {
    super();

    this._state = { ...config };
    this._meta = { errors: [] };

    if (options) this.setState(options);

    this.validate = this.validate.bind(this);
    this.setRatio = this.setRatio.bind(this);
    this.setState = this.setState.bind(this);
    this.notifyUpdate = this.notifyUpdate.bind(this);
    this.getState = this.getState.bind(this);
    this.takeMeta = this.takeMeta.bind(this);
    this._validateSliderValue = this._validateSliderValue.bind(this);
    this._setValue = this._setValue.bind(this);
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

  setRatio(ratio: number) {
    if (Number.isNaN(ratio)) return;
    const { max, min } = this.getState();
    this.setState({ value: min + ratio * (max - min) });
  }

  setState(options: Options = {}) {
    if (!(options instanceof Object)) {
      console.log('Invalid object');
      return;
    }

    const isValue = (key: string) =>
      ['value', 'firstValue', 'secondValue'].indexOf(key) !== -1;
    const filteredOptions = Object.keys(options).filter(key => !isValue(key));

    filteredOptions.forEach(key => {
      this._setValue(key, options[key]);
    });

    const newValue = (key: string) =>
      options[key] === undefined ? this._state[key] : options[key];

    if (this._state.hasInterval) {
      this._setValue('value', newValue('value'));
      this._setValue('firstValue', newValue('firstValue'));
      this._setValue('secondValue', newValue('secondValue'));
    } else {
      this._setValue('value', newValue('value'));
    }

    if (filteredOptions.length === 0) {
      this.notifyUpdate();
    } else {
      debounce(() => {
        this.notify('optionsUpdate');
        this.notifyUpdate();
      }, 200)();
    }
  }

  notifyUpdate() {
    const { value, firstValue, secondValue, min, max } = this.getState();

    if (this._state.hasInterval) {
      this.notify('intervalValueUpdate', {
        first: {
          value: firstValue,
          ratio: (firstValue - min) / (max - min),
        },
        second: {
          value: secondValue,
          ratio: (secondValue - min) / (max - min),
        },
      });
    } else {
      this.notify('valueUpdate', {
        value,
        ratio: (value - min) / (max - min),
      });
    }
  }

  getState() {
    return { ...this._state };
  }

  takeMeta() {
    const meta = { ...this._meta };
    this._meta.errors = [];
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
    const { hasInterval, firstValue, secondValue } = this._state;
    const result = this.validate(key, newValue);

    if (result instanceof SliderError) {
      this._meta.errors.push(result.getMessage());
      result.show();
      return;
    }

    if (key === 'value' && hasInterval) {
      const isFirst =
        Math.abs(<number>result - firstValue) <
        Math.abs(<number>result - secondValue);
      const newKey = isFirst ? 'firstValue' : 'secondValue';
      this._state[newKey] = <number>result;
    } else {
      this._state[key] = result;
    }
  }
}

export default Model;
