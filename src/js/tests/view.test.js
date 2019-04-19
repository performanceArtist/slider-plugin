import {Model} from '../model';
//jest.mock('../view');
import View from '../view';
import Controller from '../controller';

document.body.innerHTML = '<div id="test"></div>';

const model = new Model('#test', {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    showBubble: true,
    showSteps: false,
    horizontal: true,
});

//test object initialization
const view = new View(model);

test('Given a model with valid selector, should set the root element and add itself to the model\'s observers',
() => {
    expect(view.root).toBeInstanceOf(HTMLDivElement);
    expect(model.get('observers').length).toBe(1);
    expect(model.get('observers')[0] === view).toBe(true);
});

//test rendering calls
const controller = new Controller(model, view);

test('Given a controller, should create dom object, and set model\'s sliderLength', 
() => {
    view.render(controller);

    //imitation, supposed to be set after rendering
    model.set('sliderLength', 200);
    expect(view.dom).toBeDefined();
});

test('Newly created elements now should be inside the root element', 
() => {
    expect(view.dom.cont.parentNode === view.root).toBe(true);
});

/*
test('Check if events were added to their respective elements', 
() => {
    let click = jest.fn(controller.clickHandler);
    
    var event = new Event('click', {
        'bubbles': false
    });

    //expect(mockCallback.mock.calls.length).toBe(2);
    dom.slider.dispatchEvent(event);
    expect(click).toBeCalled();
    
});
*/

test('Check model updates', () => {
    model.set('value', 20);
    
});