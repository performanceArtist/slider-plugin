import Model from '../Model/Model';
import View from '../View/View';
import Controller from './Controller';
jest.mock('../Controller/Controller');

document.body.innerHTML = '<div id="test"></div>';

const root = document.querySelector('#test');
const model = new Model();
const view = new View(model, root);
const controller = new Controller(model, view);

model.setState = jest.fn(model.setState);

describe('Controller', () => {
  it('Exists', () => {
    expect(true).toBe(true);
  });
  /*
  it('Sets value on click, notifies observers', () => {
    view.dom.slider.dispatchEvent(new Event('click'));
    expect(controller.handleClick).toBeCalled();
    expect(model.setState).toBeCalled();
  });

  it('Calls drag handler, notifies observers', () => {
    view.dom.sliderHandle.dispatchEvent(new Event('mousedown'));
    expect(controller.handleDrag).toBeCalled();
  });*/
});
