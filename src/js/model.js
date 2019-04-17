//defaults
const def = {
    value: 0,
    min: 0,
    max: 100,
    pos: 0,
    sliderLength: 1,
    step: 1,
    showBubble: true,
    showSteps: false,
    preset: 'slider-1',
    modifier: 'slider-ver'
}

//helpers
function isUndefined(val) {
    return val === undefined;
}

function handleError(e) {
    console.error(e);
}

const Model = function(selector, opt={}) {
    //model is private
    let model = {};

    for (let i in def) {
        model[i] = isUndefined(opt[i]) ? def[i] : opt[i];
    }

    model.selector = selector;
    model.observers = [];

    //public methods
    return {
        set: function(key, val) {
            switch(key) {
                case 'value':
                    if(parseInt(val) > model.max) {
                        val = model.max;
                    } else {
                        model.value = model.step*Math.round(val/model.step);
                        model.pos = model.sliderLength*model.value/model.max;
                    }
                    break;
                case 'pos':
                    return handleError(
                        new Error(
                        `${key} does not exists or isn't configurable.`
                        )
                    );
                default:
                    if(isUndefined(model[key])) return handleError(
                            new Error(
                            `${key} does not exists or isn't configurable.`
                            )
                    );
                    model[key] = val;
            }
            
        },
        get: function(key) {
            if(isUndefined(model[key])) return handleError(
                new Error(`${key} does not exists.`)
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