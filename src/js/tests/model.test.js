import Model from '../model';
import MyError from '../MyError';

//sample model, default values(don't set anything in this model, create one if the need arises)
const def = {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    showBubble: true,
    showSteps: false,
    horizontal: true,
};

const model = new Model();

//helper for error checks
function myErrorCheck(key, val, type) {
    let res = model.validate(key, val);
    expect(res).toBeInstanceOf(MyError);
    expect(res.type).toBe(type);
}

//model.validate
//Returns custom error with 'type' property

test('Only defined keys', () => {
    myErrorCheck('doesntExist', 20, 'notProperty');
});

test('Only configurable keys', () => {
    //underlying model object has 'selector' property, but it can't be changed
    myErrorCheck('selector', 20, 'notProperty');
});

test('Return custom error for invalid argument type', () => {
    let isNumber = ['value', 'min', 'max', 'step'],
        isBool = ['showBubble', 'showSteps', 'horizontal'];

    isNumber.forEach(el => myErrorCheck(el, 'NaN', 'notNum'));
    isBool.forEach(el => myErrorCheck(el, 42, 'notBool'));
});

test('Get model property by key, if property is defined, otherwise throw an error', () => {
    expect(() => model.get('nothing')).toThrow(MyError);
    expect(model.get('max')).toBe(100);
});

test('Set model property only if the new value passed the validation', () => {
    let smodel = new Model('test', {value:0});

    expect(smodel.validate('value', 'string')).toBeInstanceOf(MyError);
    smodel.set('value', 'string');
    expect(smodel.get('value')).toBe(0);

    expect(smodel.validate('value', 5)).toBe(5);
    smodel.set('value', 5);
    expect(smodel.get('value')).toBe(5);
});

//value validation
test('When setting the value, return a number, parse and round it if necessary', () => {
        expect(model.validate('value', 5)).toBe(5);
        expect(model.validate('value', 5.4)).toBe(5);
        expect(model.validate('value', 5.6)).toBe(6);
        expect(model.validate('value', '5')).toBe(5);
    }
);

test('If value is too big or too small, set it to zero or the model\'s min and max difference', () => {
    expect(model.validate('value', -10)).toBe(0);
    expect(model.validate('value', 200)).toBe(model.get('max') - model.get('min'));
});

test('Value is relative to the max and min difference and defaults to zero', () => {
    let negative = new Model('none', {min:-50, max:50}),
        min = new Model('none', {min:20, max:50});
    
    expect(negative.get('value')).toBe(0);
    expect(min.get('value')).toBe(0);
    expect(negative.validate('value', -30)).toBe(0);
});

test('Position of the slider head should be set proportionally to value', 
() => {
    let nmodel = new Model();

    nmodel.set({
        sliderLength: 200,
        value: 20
    });

    expect(nmodel.get('pos')).toBe(40);
});

//min/max validation
test('Min value should be less than max and vice versa', () => {
    myErrorCheck('min', 120, 'notMin');
    myErrorCheck('max', -20, 'notMax');
});

//step validation
test(`Step should be more than zero, less than max/min difference 
and max/min difference should be divisable by it`,
 () => {
    myErrorCheck('step', -4, 'notStep');
    myErrorCheck('step', 13, 'notStep');
    myErrorCheck('step', 200, 'notStep');
});
