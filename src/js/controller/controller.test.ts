import Model from '../model/model';
import View from '../view/view';
import Controller from './controller';

document.body.innerHTML = '<div id="test"></div>';

const root = document.querySelector('#test');
const model = new Model();
const view = new View(model, root);
const controller = new Controller(model, view);

controller.handleClick = jest.fn(controller.handleClick);
controller.handleInput = jest.fn(controller.handleInput);
controller.handleDrag = jest.fn(controller.handleDrag);
model.setState = jest.fn(model.setState);

describe('Controller', () => {
  it('Sets value on click, notifies observers', () => {
    view.dom.slider.dispatchEvent(new Event('click'));
    expect(controller.handleClick).toBeCalled();
    expect(model.setState).toBeCalled();
  });

  it('Changes value on blur, notifies observers', () => {
    view.dom.input.value = 20;
    view.dom.input.dispatchEvent(new Event('blur'));
    expect(controller.handleInput).toBeCalled();
    expect(model.setState).toBeCalled();
    const { value } = model.getState();
    expect(value).toBe(20);
  });

  it('Calls drag handler, notifies observers', () => {
    view.dom.sliderHandle.dispatchEvent(new Event('mousedown'));
    expect(controller.handleDrag).toBeCalled();
  });
});
