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

const checkType = (key: string, value: any) => {
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
};

class Model extends Observable {
  private _model: ModelType;

  constructor(options: Options | null = null) {
    super();

    this._model = getInitialState();
    if (options) this.setState(options);

    this.validate = this.validate.bind(this);
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.takeMeta = this.takeMeta.bind(this);
  }

  validate(key: string, value: number | string | boolean) {
    const newValue = checkType(key, value);
    const state = this.getState();

    if (newValue instanceof SliderError) {
      return newValue;
    }

    switch (key) {
      case 'value':
      case 'firstValue':
      case 'secondValue':
        if (key === 'firstValue' && newValue >= state.secondValue - state.step)
          return state.firstValue;
        if (key === 'firstValue' && newValue > state.max) return state.min;
        if (key === 'secondValue' && newValue <= state.firstValue + state.step)
          return state.secondValue;

        const rawValue = (newValue as number) - state.min;

        const length = state.max - state.min;
        if (length % state.step !== 0) {
          const tail = Math.floor(length / state.step) * state.step;
          const valueRemainder = rawValue - tail;
          const stepRemainder = length - tail;
          if (valueRemainder > stepRemainder / 2) return state.max;
        }

        const result =
          state.min + state.step * Math.round(rawValue / state.step);

        if (result < state.min) return state.min;
        if (result > state.max) return state.max;
        return result;
      case 'min':
        return newValue >= state.max
          ? new SliderError(ErrorType.MIN, key)
          : newValue;
      case 'max':
        return newValue <= state.min
          ? new SliderError(ErrorType.MAX, key)
          : newValue;
      case 'step':
        if (newValue <= 0 || newValue > state.max - state.min)
          return new SliderError(ErrorType.STEP, key);
        return newValue;
      default:
        return newValue;
    }
  }

  setState(options: Options = {}) {
    if (!(options instanceof Object)) {
      console.log('Invalid object');
      return;
    }

    const { state, meta } = this._model;
    const setValue = (key: string, newValue: number | string | boolean) => {
      const result = this.validate(key, newValue);
      if (result instanceof SliderError) {
        meta.errors.push(result.getMessage());
        result.show();
      } else {
        state[key] = result;
      }
    };
    const keys = Object.keys(options);
    const otherOptions = keys.filter(
      key => key !== 'value' && key !== 'firstValue' && key !== 'secondValue',
    );

    otherOptions.forEach(key => {
      setValue(key, options[key]);
    });

    const interval =
      options.interval === undefined ? state.interval : options.interval;

    if (interval) {
      const first =
        options.firstValue === undefined
          ? state.firstValue
          : options.firstValue;
      const second =
        options.secondValue === undefined
          ? state.secondValue
          : options.secondValue;

      setValue('firstValue', first);
      setValue('secondValue', second);
    } else {
      setValue(
        'value',
        options.value === undefined ? state.value : options.value,
      );
    }

    if (otherOptions.length === 0) {
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
