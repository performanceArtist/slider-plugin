import SliderError, { ErrorType } from './SliderError';

import { ModelType } from '../types';

export const getInitialState = (function memoizeDefaults() {
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

export const debounce = (callback: Function, delay: number) => {
  let inDebounce: NodeJS.Timeout;
  return function callFunction(...args: any) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => callback.apply(context, args), delay);
  };
};

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
