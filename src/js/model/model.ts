import SliderError from './SliderError';

import { getInitialState, debounce, checkType } from './utils';

import Options from '../Options';

const Model = function Model(options = {}) {
  const model = getInitialState();

  function validate(key, value) {
    let newValue = checkType(key, value);

    if (newValue instanceof SliderError) {
      return newValue;
    }

    switch (key) {
      case 'value':
      case 'firstValue':
      case 'secondValue':
        if (key === 'firstValue' && newValue >= model.state.secondValue)
          return model.state.firstValue;
        if (key === 'secondValue' && newValue <= model.state.firstValue)
          return model.state.secondValue;
        if (newValue > model.state.max) return model.state.max;
        if (newValue < model.state.min) return model.state.min;

        newValue =
          model.state.min +
          model.state.step *
            Math.round((newValue - model.state.min) / model.state.step);
        return newValue;
      case 'min':
        if (newValue >= model.state.max) {
          return new SliderError(`Invalid min value: ${newValue}`, 'notMin');
        }
        break;
      case 'max':
        if (newValue <= model.state.min) {
          return new SliderError(`Invalid max value: ${newValue}`, 'notMax');
        }
        break;
      case 'step':
        if (
          newValue <= 0 ||
          (model.state.max - model.state.min) % newValue !== 0 ||
          newValue > model.state.max - model.state.min
        ) {
          return new SliderError(`Invalid step value: ${newValue}`, 'notStep');
        }
        break;
      default:
        break;
    }

    return newValue;
  }

  interface Observer {
    update?: Function;
    render?: Function;
  }

  function notify(type: string) {
    model.observers.forEach((observer: Observer) => {
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

  function setValue(key: string, newValue: number | string | boolean) {
    const res = validate(key, newValue);
    if (res instanceof SliderError) {
      model.props.errors.push(res.getMessage());
      res.show();
    } else {
      model.state[key] = res;
    }
  }

  const setState = (options: Options = {}) => {
    if (!(options instanceof Object)) {
      console.log('Invalid object');
      return;
    }

    const keys = Object.keys(options);
    const otherOptions = keys.filter(
      key => key !== 'value' && key !== 'firstValue' && key !== 'secondValue'
    );

    otherOptions.forEach(key => {
      setValue(key, options[key]);
    });

    const interval = model.state.interval || options.interval;

    // set value after options update to ensure it's valid
    if (interval) {
      const first = options.firstValue || model.state.firstValue;
      const second = options.secondValue || model.state.secondValue;

      setValue('firstValue', first);
      setValue('secondValue', second);
    } else {
      setValue('value', options.value || model.state.value);
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
    getState: () => ({ ...model.state }),
    setState,
    notify,
    props: model.props,
    addObserver(observer: Observer) {
      model.observers.push(observer);
    }
  };
};

export default Model;
