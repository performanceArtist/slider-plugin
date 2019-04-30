import SliderError from './SliderError';

// defaults, values can be changed via 'set' method
const def = {
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  showBubble: true,
  showSteps: false,
  horizontal: true,
  sliderLength: 0,
};

function isUndefined(val) {
  return val === undefined;
}

function checkType(key, val) {
  let num = 0;

  switch (key) {
    case 'value':
    case 'max':
    case 'min':
    case 'step':
    case 'sliderLength':
      num = parseFloat(val);
      if (Number.isNaN(num)) {
        return new SliderError(`${key} is not a number.`, 'notNum');
      }
      return num;
    case 'showBubble':
    case 'showSteps':
    case 'horizontal':
      if (typeof val !== 'boolean') {
        return new SliderError(`${key} is not a boolean.`, 'notBool');
      }
      return val;
    default:
      return new SliderError(`${key} is not configurable`, 'notConf');
  }
}

const Model = function Model(selector, opt = {}) {
  // model is private
  const model = {};

  // copy object
  Object.assign(model, def);

  function validate(key, value) {
    if (isUndefined(def[key])) {
      return new SliderError(`${key} does not exist or is not configurable.`, 'notProperty');
    }

    let val = checkType(key, value);

    if (val instanceof SliderError) {
      return val;
    }

    switch (key) {
      case 'value':
        if (val > model.max) {
          model.pos = model.sliderLength;
          return model.max;
        } if (val < model.min) {
          model.pos = 0;
          return model.min;
        }
        val = model.min + model.step * Math.round((val - model.min) / model.step);
        model.pos = model.sliderLength * (val - model.min) / (model.max - model.min);
        return val;
      case 'min':
        if (val > model.max) {
          return new SliderError(`Invalid min value: ${val}`, 'notMin');
        }
        break;
      case 'max':
        if (val < model.min) {
          return new SliderError(`Invalid max value: ${val}`, 'notMax');
        }
        break;
      case 'step':
        if (val <= 0 || (model.max - model.min) % val !== 0 || val > (model.max - model.min)) {
          return new SliderError(`Invalid step value: ${val}`, 'notStep');
        }
        break;
      case 'sliderLength':
        if (val <= 0) {
          return new SliderError('Invalid slider length value', 'notLength');
        }
        break;
      default:
        break;
    }

    return val;
  }

  function setVal(key, val) {
    const res = validate(key, val);
    if (res instanceof SliderError) {
      res.show();
    } else {
      model[key] = res;
    }
  }

  Object.keys(opt).forEach((key) => {
    setVal(key, opt[key]);
  });

  // private, cannot be changed through 'set'
  model.pos = 0;
  model.selector = selector;
  model.observers = [];

  // public methods
  return {
    set(key, val) {
      if (key instanceof Object) {
        Object.keys(key).forEach((k) => {
          setVal(k, key[k]);
        });
      } else {
        setVal(key, val);
      }
    },
    validate,
    get(key) {
      if (isUndefined(model[key])) {
        throw new SliderError(`${key} does not exist.`, 'notProperty');
      }
      return model[key];
    },
    addObserver(ob) {
      model.observers.push(ob);
    },
    notifyAll() {
      model.observers.forEach((ob) => {
        try {
          ob.update();
        } catch (err) {
          console.error(err);
        }
      });
    },
  };
};

export default Model;
