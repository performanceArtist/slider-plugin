import SliderError from './SliderError';

import { getInitialState, debounce, checkType } from './utils';

const Model = function Model(selector, options = {}) {
  const model = getInitialState();
  model.props.selector = selector;

  function validate(key, value) {
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
    model.observers.forEach(observer => {
      try {
        switch (type) {
          case 'update':
            observer.update();
            break;
          case 'render':
            observer.render();
            break;
          default:
            throw new Error('Invalid type argument');
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  function setValue(key, val) {
    const res = validate(key, val);
    if (res instanceof SliderError) {
      model.props.errors.push(res.getMessage());
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
        notify('render');
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
