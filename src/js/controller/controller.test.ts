import Model from '../model/model';
import View from '../view/view';
import Controller from './controller';

document.body.innerHTML = '<div id="test"></div>';

const root = document.querySelector('#test');
const model = new Model();
const view = new View(model, root);
const controller = new Controller(model, view);

controller.handleClick = jest.fn(controller.handleClick);
controller.handleDrag = jest.fn(controller.handleDrag);
model.setState = jest.fn(model.setState);

describe('Controller', () => {
  it('Sets value on click, notifies observers', () => {
    view.dom.slider.dispatchEvent(new Event('click'));
    expect(controller.handleClick).toBeCalled();
    expect(model.setState).toBeCalled();
  });

  it('Calls drag handler, notifies observers', () => {
    view.dom.sliderHandle.dispatchEvent(new Event('mousedown'));
    expect(controller.handleDrag).toBeCalled();
  });
});
