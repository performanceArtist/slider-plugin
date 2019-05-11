import SliderError from './SliderError';

// defaults, values can be changed via 'set' method
const def = {
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  showBubble: true,
  showSteps: false,
  horizontal: true
};

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

const Model = function Model(selector, options = {}) {
  // model is private
  const model = { state: {}, props: {} };

  // copy object
  Object.assign(model.state, def);

  // private, cannot be changed through 'set'
  model.props = {
    selector,
    errors: []
  };

  model.observers = [];

  function validate(key, value) {
    if (def[key] === undefined) {
      return new SliderError(
        `${key} does not exist or is not configurable.`,
        'notProperty'
      );
    }

    let val = checkType(key, value);

    if (val instanceof SliderError) {
      return val;
    }

    switch (key) {
      case 'value':
        if (val > model.state.max) {
          return model.state.max;
        }
        if (val < model.state.min) {
          return model.state.min;
        }
        val =
          model.state.min +
          model.state.step *
            Math.round((val - model.state.min) / model.state.step);
        return val;
      case 'min':
        if (val >= model.state.max) {
          return new SliderError(`Invalid min value: ${val}`, 'notMin');
        }
        break;
      case 'max':
        if (val <= model.state.min) {
          return new SliderError(`Invalid max value: ${val}`, 'notMax');
        }
        break;
      case 'step':
        if (
          val <= 0 ||
          (model.state.max - model.state.min) % val !== 0 ||
          val > model.state.max - model.state.min
        ) {
          return new SliderError(`Invalid step value: ${val}`, 'notStep');
        }
        break;
      default:
        break;
    }

    return val;
  }

  function notify(type) {
    model.observers.forEach(ob => {
      try {
        switch (type) {
          case 'update':
            ob.update();
            break;
          case 'rerender':
            ob.rerender();
            break;
          default:
            throw new Error('Invalid type argument');
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  const debounce = (func, delay) => {
    let inDebounce;
    return function callFunction(...args) {
      const context = this;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  function setValue(key, val) {
    const res = validate(key, val);
    if (res instanceof SliderError) {
      model.props.errors.push(res);
      res.show();
    } else {
      model.state[key] = res;
    }
  }

  const setState = (options = {}) => {
    if (!(options instanceof Object)) {
      console.log('Invalid object');
      return;
    }

    const keys = Object.keys(options);
    const hasValue = keys.includes('value');
    const otherOptions = keys.filter(key => key !== 'value');

    otherOptions.forEach(key => {
      setValue(key, options[key]);
    });

    // set value after options update to ensure it's valid
    if (hasValue) {
      setValue('value', options.value);
    } else {
      setValue('value', model.state.value);
    }

    // decide whether to rerender everything or not
    if (otherOptions.length === 0) {
      notify('update');
    } else {
      debounce(() => {
        notify('rerender');
      }, 200)();
    }
  };

  setState(options);

  // public methods
  return {
    validate,
    getState: () => Object.assign(model.state, {}),
    setState,
    notify,
    props: model.props,
    addObserver(ob) {
      model.observers.push(ob);
    }
  };
};

export default Model;
