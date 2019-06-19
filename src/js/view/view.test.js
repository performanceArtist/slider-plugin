import Model from '../model/model';
import View from './view';
import Controller from '../controller/controller';

document.body.innerHTML = '<div id="test"></div>';

const model = new Model('#test');
const view = new View(model);
const controller = new Controller(model, view);
controller.handleClick = jest.fn(controller.handleClick);
controller.handleInput = jest.fn(controller.handleInput);
controller.handleDrag = jest.fn(controller.handleDrag);

describe('View', () => {
  it('Given a model with valid selector, sets the root element. Otherwise throws an error.', () => {
    expect(() => new View(new Model('#none'))).toThrow();
    expect(view.root).toBeInstanceOf(HTMLDivElement);
  });

  it("Given a controller, creates dom object and sets model's sliderLength", () => {
    view.render(controller);

    // imitation, supposed to be set after rendering
    view.helpers.sliderLength = 200;
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

/*
// test view updates
it('Check if values are set after an update call', () => {
  model.setState({ value: 20 });
  view.update();

  const pos = model.get('handlePosition');
  const sliderHandle = `${pos}px`;
  const selected = `${pos + 5}px`;
  const bubble = `${pos - 4}px`;

  expect(view.dom.sliderHandle.style.left).toBe(sliderHandle);
  expect(view.dom.selected.style.width).toBe(selected);
  expect(view.dom.bubble.style.left).toBe(bubble);

  expect(view.dom.bubble.innerHTML).toBe('20');
  expect(view.dom.input.value).toBe('20');
});
*/
