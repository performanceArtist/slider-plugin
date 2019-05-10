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

const Model = function Model(selector, opt = {}) {
  // model is private
  const model = { state: {}, props: {} };

  // copy object
  Object.assign(model.state, def);

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
        if (val > model.state.max) {
          return new SliderError(`Invalid min value: ${val}`, 'notMin');
        }
        break;
      case 'max':
        if (val < model.state.min) {
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

  // private, cannot be changed through 'set'
  model.props = {
    selector
  };

  model.observers = [];

  function setValue(key, val) {
    const res = validate(key, val);
    if (res instanceof SliderError) {
      res.show();
    } else {
      model.state[key] = res;
    }
  }

  Object.keys(opt).forEach(key => {
    setValue(key, opt[key]);
  });

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

  // public methods
  return {
    set(key, val) {
      if (key instanceof Object) {
        Object.keys(key).forEach(k => {
          setValue(k, key[k]);
        });
        //to make sure it's still valid after min/max were set
        if (key.value !== undefined) setValue('value', key.value);
        debounce(() => {
          notify('rerender');
        }, 200)();
      } else {
        setValue(key, val);
        if (key === 'value') {
          notify('update');
        } else {
          debounce(() => {
            notify('rerender');
          }, 60)();
        }
      }
    },
    validate,
    get(key) {
      if (model.state[key] === undefined && model.props[key] === undefined) {
        throw new SliderError(`${key} does not exist.`, 'notProperty');
      }

      if (model.state[key] === undefined) {
        return model.props[key];
      }

      return model.state[key];
    },
    addObserver(ob) {
      model.observers.push(ob);
    }
  };
};

export default Model;
