import Model from '../model';
import View from '../view';
import Controller from '../controller';

document.body.innerHTML = '<div id="test"></div>';

let model = new Model('#test'),
    view = new View(model),
    controller = new Controller(model, view);

controller.clickHandler = jest.fn(controller.clickHandler);
controller.inputHandler = jest.fn(controller.inputHandler);
controller.dragHandler = jest.fn(controller.dragHandler);
model.set = jest.fn(model.set);
model.notifyAll = jest.fn(model.notifyAll);

//need this in order for mocks to work
model.set('sliderLength', 200);
view.render(controller);

test('Set value on click, notify observers(view)', 
() => {
    view.dom.slider.dispatchEvent(new Event('click'));
    expect(controller.clickHandler).toBeCalled();
    expect(model.set).toBeCalled();
    expect(model.notifyAll).toBeCalled();
});

test('Change value on blur, notify observers', 
() => {
    view.dom.input.value = 20;
    view.dom.input.dispatchEvent(new Event('blur'));
    expect(controller.inputHandler).toBeCalled();
    expect(model.set).toBeCalled();
    expect(model.get('value')).toBe(20);
    expect(model.notifyAll).toBeCalled();
});

test('Set value on click, notify observers(view)', 
() => {
    view.dom.sliderHandle.dispatchEvent(new Event('mousedown'));
    expect(controller.dragHandler).toBeCalled();
});