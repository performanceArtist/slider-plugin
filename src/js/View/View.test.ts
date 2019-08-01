import Model from '../Model/Model';
import View from './View';
import Handle from './Handle';
import Controller from '../Controller/Controller';

document.body.innerHTML = '<div id="test"></div>';

const root = document.querySelector('#test');
const model = new Model();
const view = new View(model, root);
const controller = new Controller(model, view);

describe('View', () => {
  describe('constructor', () => {
    it('Given an HTML element and a model, sets the root element(slider container). Throws an error if the element is invalid.', () => {
      const root = document.querySelector('#none');
      expect(() => new View(new Model(), root)).toThrow();
      expect(view.root).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('render', () => {
    it('Creates dom and handle objects, sets sliderLength property', () => {
      expect(view.dom).toBeDefined();
      expect(view.handle).toBeDefined();
      expect(Number.isNaN(view.getSliderLength())).toBe(false);
    });

    it('Creates appropriate number of Handle objects', () => {
      expect(view.handle).toBeInstanceOf(Handle);
      model.setState({ interval: true });

      view.render();

      expect(view.handle).toEqual(
        expect.objectContaining({
          first: expect.any(Handle),
          second: expect.any(Handle),
        }),
      );
    });

    it('Puts newly created elements inside the root element', () => {
      expect(view.dom.container.parentNode === view.root).toBe(true);
    });
  });

  describe('update', () => {
    it('Updates slider values without full rerender', () => {
      model.setState({ firstValue: 20 });
      view.update();
      expect(view.handle.first.bubble.innerHTML).toBe('20');
    });
  });

  describe('getSliderLength', () => {
    it('Returns slider length', () => {
      expect(Number.isNaN(view.getSliderLength())).toBe(false);
    });
  });
});

describe('Handle', () => {
  const handle = new Handle({
    position: 0,
    horizontal: true,
    showBubble: true,
  });

  describe('constructor', () => {
    it('Creates handle element', () => {
      expect(handle.element).toBeInstanceOf(HTMLElement);
    });

    it('Adds value bubble according to options', () => {
      expect(handle.bubble).toBeInstanceOf(HTMLElement);
    });
  });

  describe('getElements', () => {
    it('Returns html fragment with handle elements', () => {
      expect(handle.getElements()).toBeInstanceOf(DocumentFragment);
    });
  });

  describe('setPosition', () => {
    it('Sets handle position and value in bubble', () => {
      handle.setPosition(20, 100);
      expect(parseInt(handle.element.style.left, 0)).toBeGreaterThan(0);
      expect(handle.bubble.innerHTML).toBe('20');
    });
  });
});
