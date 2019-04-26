import SliderError from './SliderError';

//defaults, values can be changed via 'set' method
const def = {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    showBubble: true,
    showSteps: false,
    horizontal: true,
    sliderLength: 0
}

function isUndefined(val) {
    return val === undefined;
}

const Model = function(selector, opt={}) {
    //model is private
    let model = {};
    Object.assign(model, def);

    for (let i in opt) {
        let res = validate(i, opt[i]);
        if(res instanceof SliderError) {
            res.show();
        } else {
            model[i] = res;
        }
    }

    //cannot be changed through 'set'
    model.pos = 0;
    model.selector = selector;
    model.observers = [];

    function validate(key, val) {
        if(isUndefined(def[key])) {
            return new SliderError(`${key} does not exist or is not configurable.`, 'notProperty');
        }

        //check types
        switch(key) {
            case 'value':
            case 'max':
            case 'min':
            case 'step':
                val = parseFloat(val);
                if(isNaN(val)) {
                    return new SliderError(`${key} is not a number.`, 'notNum');
                }
                break;
            case 'showBubble':
            case 'showSteps':
            case 'horizontal':
                if(typeof val !== "boolean") {
                    return new SliderError(`${key} is not a boolean.`, 'notBool');
                }
                break;
        }

        switch(key) {
            case 'value':
                if(val > model.max) {
                    model.pos = model.sliderLength;
                    return model.max;
                } else if(val < model.min) {
                    model.pos = 0;
                    return model.min;
                } else {
                    val = model.step*Math.round(val/model.step);
                    model.pos = model.sliderLength*(val - model.min)/(model.max - model.min);
                }
                break;
            case 'min':
                if(val > model.max) {
                    return new SliderError(`Invalid min value: ${val}`, 'notMin');
                }
                break;
            case 'max':
                if(val < model.min) {
                    return new SliderError(`Invalid max value: ${val}`, 'notMax');
                }
                break;
            case 'step':
                if(val <= 0 || (model.max-model.min) % val !== 0 || val > (model.max-model.min)) {
                    return new SliderError(`Invalid step value: ${val}`, 'notStep');
                }
                break;
        }

        return val;
    }

    //public methods
    return {
        set: function(key, val) {
            if(key instanceof Object) {
                for(let i in key) {
                    const res = validate(i, key[i]);
                    if(res instanceof SliderError) {
                        res.show();
                    } else {
                        model[i] = res;
                    }
                }
            } else {
                const res = validate(key, val);
                if(res instanceof SliderError) {
                    res.show();
                } else {
                    model[key] = res;
                }
            }
        },
        validate: validate,
        get: function(key) {
            if(isUndefined(model[key])) {
                throw new SliderError(`${key} does not exist.`, 'notKey');
            }
            return model[key];
        },
        addObserver: function(ob) {
            model.observers.push(ob);
        },
        notifyAll: function() {
            model.observers.forEach(ob => {
                ob.update();
            });
        }
    }
}

export default Model;