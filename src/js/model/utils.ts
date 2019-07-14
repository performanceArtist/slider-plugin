import SliderError, { ErrorType } from './SliderError';

import { Options, ModelType } from '../types';

export const getInitialState = (function getInitialState() {
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

  return function createModel() {
    const model: ModelType = {
      state: { ...defaults },
      props: { errors: [] },
      observers: []
    };
    return model;
  };
})();

export const checkType = (key: string, value: any) => {
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

export const debounce = (callback: Function, delay: number) => {
  let inDebounce: NodeJS.Timeout;
  return function callFunction(...args: any) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => callback.apply(context, args), delay);
  };
};

export const makeValidate = (state: Options) => {
  return (key: string, value: number | string | boolean) => {
    const newValue = checkType(key, value);

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
  };
};
