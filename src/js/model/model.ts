import { getInitialState, debounce, checkType } from './utils';
import SliderError, { ErrorType } from './SliderError';
import Observable from '../Observable';
import { Options, ModelType } from '../types';

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
        if (
          newValue <= 0 ||
          (state.max - state.min) % (newValue as number) !== 0 ||
          newValue > state.max - state.min
        ) {
          return new SliderError(ErrorType.STEP, key);
        } else {
          return newValue;
        }
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
      const first = options.firstValue || state.firstValue;
      const second = options.secondValue || state.secondValue;

      setValue('firstValue', first);
      setValue('secondValue', second);
    } else {
      setValue('value', options.value || state.value);
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
