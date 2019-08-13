import Model from '../Model/Model';
import View from './Main';
import Controller from '../Controller/Controller';
import Handle from './Handle';

document.body.innerHTML = '<div id="test"></div>';

const root = document.querySelector('#test');
const model = new Model();
const view = new View(model, root);
const controller = new Controller(model, view);

describe('Main view', () => {
  describe('constructor', () => {
    it('Given an HTML element and a model, sets the root element(slider container). Throws an error if the element is invalid.', () => {
      const root = document.querySelector('#none');
      expect(() => new View(new Model(), root)).toThrow();
      expect(view.root).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('render', () => {
    it('Creates slider and handle objects, sets sliderLength property', () => {
      expect(view.slider).toBeDefined();
      expect(view.handle).toBeDefined();
      expect(Number.isNaN(view.slider.getLength())).toBe(false);
    });

    it('Creates appropriate number of Handle objects', () => {
      expect(view.handle).toBeInstanceOf(Handle);
      model.setState({ hasInterval: true });

      view.render();

      expect(view.handle).toEqual(
        expect.objectContaining({
          first: expect.any(Handle),
          second: expect.any(Handle),
        }),
      );
    });

    it('Puts newly created elements inside the root element', () => {
      expect(view.slider.root.parentNode === view.root).toBe(true);
    });
  });

  /*
  describe('update', () => {
    it('Updates slider values without full rerender', () => {
      model.setState({ firstValue: 20 });
      view.updateInterval(view.handle);
      expect(view.handle.first.bubble.innerHTML).toBe('20');
    });
  });*/
});
