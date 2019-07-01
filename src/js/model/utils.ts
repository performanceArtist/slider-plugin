import SliderError from './SliderError';

import Options from '../Options';

interface ModelType {
  state: Options;
  props: { errors: Array<string> };
  observers: Array<Function>;
}

const getInitialState = (function getInitialState() {
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

function checkType(key: string, val: string | number | boolean) {
  switch (key) {
    case 'value':
    case 'firstValue':
    case 'secondValue':
    case 'max':
    case 'min':
    case 'step':
      return Number.isNaN(parseFloat(val))
        ? new SliderError(`${key} is not a number.`, 'notNum')
        : parseFloat(val);
    case 'interval':
    case 'showBubble':
    case 'showSteps':
    case 'horizontal':
      return typeof val !== 'boolean'
        ? new SliderError(`${key} is not a boolean.`, 'notBool')
        : val;
    default:
      return new SliderError(`${key} is not configurable`, 'notConf');
  }
}

const debounce = (func: Function, delay: number) => {
  let inDebounce;
  return function callFunction(...args) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export { getInitialState, debounce, checkType };
