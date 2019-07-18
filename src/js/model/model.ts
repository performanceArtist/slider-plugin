import { debounce } from './utils';
import SliderError, { ErrorType } from './SliderError';
import Observable from '../Observable';
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
    horizontal: true
  };

  return (): ModelType => ({
    state: { ...defaults },
    meta: { errors: [] }
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
    const { state } = this._model;

    if (newValue instanceof SliderError) {
      return newValue;
    }

    switch (key) {
      case 'value':
      case 'firstValue':
      case 'secondValue':
        if (key === 'firstValue' && newValue >= state.secondValue)
          return state.firstValue;
        if (key === 'secondValue' && newValue <= state.firstValue)
          return state.secondValue;
        if (newValue > state.max) return state.max;
        if (newValue < state.min) return state.min;
        return (
          state.min +
          state.step *
            Math.round(((newValue as number) - state.min) / state.step)
        );
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

        const newStep = newValue as number;
        const remainder = (state.max - state.min) % newStep;
        const quotient = Math.floor((state.max - state.min) / newStep);

        if (remainder !== 0) this.setState({ max: (quotient + 1) * newStep });

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
      const res = this.validate(key, newValue);
      if (res instanceof SliderError) {
        meta.errors.push(res.getMessage());
        res.show();
      } else {
        state[key] = res;
      }
    };
    const keys = Object.keys(options);
    const otherOptions = keys.filter(
      key => key !== 'value' && key !== 'firstValue' && key !== 'secondValue'
    );

    otherOptions.forEach(key => {
      setValue(key, options[key]);
    });

    // set value after options update to ensure it's valid
    const interval = state.interval || options.interval;

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
        options.value === undefined ? state.value : options.value
      );
    }

    // decide whether to rerender everything or not
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
