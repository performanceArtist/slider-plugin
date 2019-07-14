import Model from '../model/model';
import View from './view';
import Controller from '../controller/controller';

document.body.innerHTML = '<div id="test"></div>';

const root = document.querySelector('#test');
const model = new Model();
const view = new View(model, root);
const controller = new Controller(model, view);
controller.handleClick = jest.fn(controller.handleClick);
controller.handleInput = jest.fn(controller.handleInput);
controller.handleDrag = jest.fn(controller.handleDrag);

describe('View', () => {
  it('Given a model with valid selector, sets the root element. Otherwise throws an error.', () => {
    const root = document.querySelector('#none');
    expect(() => new View(new Model(), root)).toThrow();
    expect(view.root).toBeInstanceOf(HTMLDivElement);
  });

  it("Given a controller, creates dom object and sets model's sliderLength", () => {
    view.render();
    // imitation, supposed to be set after rendering
    view._sliderLength = 200;
    expect(view.dom).toBeDefined();
  });

  it('Puts newly created elements inside the root element', () => {
    expect(view.dom.container.parentNode === view.root).toBe(true);
  });

  it('Adds event handlers to the respective elements', () => {
    view.dom.slider.dispatchEvent(new Event('click'));
    expect(controller.handleClick).toBeCalled();
    view.dom.input.dispatchEvent(new Event('blur'));
    expect(controller.handleInput).toBeCalled();
    view.dom.sliderHandle.dispatchEvent(new Event('mousedown'));
    expect(controller.handleDrag).toBeCalled();
  });
});
