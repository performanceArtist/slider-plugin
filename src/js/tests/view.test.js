import Model from '../model';
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
//create mocks for further testing
controller.clickHandler = jest.fn(controller.clickHandler);
controller.inputHandler = jest.fn(controller.inputHandler);
controller.dragHandler = jest.fn(controller.dragHandler);

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

test('Check if events were added to their respective elements', 
() => {
    view.dom.slider.dispatchEvent(new Event('click'));
    expect(controller.clickHandler).toBeCalled();
    view.dom.input.dispatchEvent(new Event('input'));
    expect(controller.inputHandler).toBeCalled();
    view.dom.sliderHead.dispatchEvent(new Event('mousedown'));
    expect(controller.dragHandler).toBeCalled();
});

//test view updates
test('Check if values are set after update call', () => {
    model.set('value', 20);
    view.update();

    let pos = model.get('pos'),
        sliderHead = pos + 'px',
        sliderDone = pos + 5 + 'px',
        bubble = pos - 4 + 'px';
    
    expect(view.dom.sliderHead.style.left).toBe(sliderHead);
    expect(view.dom.sliderDone.style.width).toBe(sliderDone);
    expect(view.dom.bubble.style.left).toBe(bubble);

    expect(view.dom.bubble.innerHTML).toBe('20');
    expect(view.dom.input.value).toBe('20');
});
