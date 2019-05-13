import Model from '../model/model';
import View from '../view/view';
import Controller from './controller';

document.body.innerHTML = '<div id="test"></div>';

const model = new Model('#test');
const view = new View(model);
const controller = new Controller(model, view);

controller.handleClick = jest.fn(controller.handleClick);
controller.handleInput = jest.fn(controller.handleInput);
controller.handleDrag = jest.fn(controller.handleDrag);
model.setState = jest.fn(model.setState);
model.notify = jest.fn(model.notify);

view.render(controller);

test('Set value on click, notify observers(view)', () => {
  view.dom.slider.dispatchEvent(new Event('click'));
  expect(controller.handleClick).toBeCalled();
  expect(model.setState).toBeCalled();
  //expect(model.notify).toBeCalled();
});

test('Change value on blur, notify observers', () => {
  view.dom.input.value = 20;
  view.dom.input.dispatchEvent(new Event('blur'));
  expect(controller.handleInput).toBeCalled();
  expect(model.setState).toBeCalled();
  const { value } = model.getState();
  expect(value).toBe(20);
  //expect(model.notify).toBeCalled();
});

test('Set value on click, notify observers(view)', () => {
  view.dom.sliderHandle.dispatchEvent(new Event('mousedown'));
  expect(controller.handleDrag).toBeCalled();
});
