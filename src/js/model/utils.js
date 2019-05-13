import SliderError from './SliderError';

const getInitialState = (function getInitialState() {
  const defaults = {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    showBubble: true,
    showSteps: false,
    horizontal: true
  };

  return function createModel() {
    const model = {
      state: Object.assign({}, defaults),
      props: { selector: '', errors: [] },
      observers: []
    };
    return model;
  };
})();

function checkType(key, val) {
  switch (key) {
    case 'value':
    case 'max':
    case 'min':
    case 'step':
      return Number.isNaN(parseFloat(val))
        ? new SliderError(`${key} is not a number.`, 'notNum')
        : parseFloat(val);
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

const debounce = (func, delay) => {
  let inDebounce;
  return function callFunction(...args) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export { getInitialState, debounce, checkType };
