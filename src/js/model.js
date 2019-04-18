//defaults, can be changed via 'set' method
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

//helpers
function isUndefined(val) {
    return val === undefined;
}

function handleError(e) {
    console.error(e || e.stack);
}

const Model = function(selector, opt={}) {
    //model is private
    let model = {};
    Object.assign(model, def);

    for (let i in opt) {
        validate(i, opt[i]);
    }

    //cannot be changed through 'set'
    model.pos = 0;
    model.selector = selector;
    model.observers = [];

    function validate(key, val) {
        if(isUndefined(def[key])) return handleError(
            new Error(`${key} does not exist or isn't configurable.`)
        );
        
        if(val === '') return;

        //check types
        switch(key) {
            case 'value':
            case 'max':
            case 'min':
            case 'step':
                val = parseFloat(val);
                if(isNaN(val)) {
                    return handleError(
                        new Error(`${key} is not a number.`)
                    );
                }
                break;
            case 'showBubble':
            case 'showSteps':
            case 'horizontal':
                if(typeof val !== "boolean") {
                    return handleError(
                        new Error(`${val} is not a boolean.`)
                    );
                }
                break;
        }

        switch(key) {
            case 'value':
                if(val > (model.max - model.min)) {
                    model.value = model.max;
                    model.pos = model.sliderLength;
                } else if(val < 0) {
                    model.value = model.min;
                    model.pos = 0;
                } else {
                    val = model.step*Math.round(val/model.step);
                    model.pos = model.sliderLength*val/(model.max - model.min);
                    model.value = model.min + val;
                }
                break;
            case 'max':
                if(val > model.min) model.max = val;
                break;
            case 'min':
                if(val < model.max) model.min = val;
                break;
            case 'step':
                if(model.min + val < model.min) return handleError(
                    new Error(`Invalid step value.`)
                );
                model.step = val;
                break;
            default:
                model[key] = val;
        }
    }

    //public methods
    return {
        set: function(key, val) {
            if(key instanceof Object) {
                for(let i in key) {
                    validate(i, key[i]);
                }
            } else {
                validate(key, val)
            }
        },
        get: function(key) {
            if(isUndefined(model[key])) return handleError(
                new Error(`${key} does not exist.`)
            );

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