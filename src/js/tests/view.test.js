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
controller.handleClick = jest.fn(controller.handleClick);
controller.handleInput = jest.fn(controller.handleInput);
controller.handleDrag = jest.fn(controller.handleDrag);

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
    expect(controller.handleClick).toBeCalled();
    view.dom.input.dispatchEvent(new Event('blur'));
    expect(controller.handleInput).toBeCalled();
    view.dom.sliderHandle.dispatchEvent(new Event('mousedown'));
    expect(controller.handleDrag).toBeCalled();
});

//test view updates
test('Check if values are set after an update call', () => {
    model.set('value', 20);
    view.update();

    let pos = model.get('pos'),
        sliderHandle = pos + 'px',
        sliderDone = pos + 5 + 'px',
        bubble = pos - 4 + 'px';
    
    expect(view.dom.sliderHandle.style.left).toBe(sliderHandle);
    expect(view.dom.sliderDone.style.width).toBe(sliderDone);
    expect(view.dom.bubble.style.left).toBe(bubble);

    expect(view.dom.bubble.innerHTML).toBe('20');
    expect(view.dom.input.value).toBe('20');
});
