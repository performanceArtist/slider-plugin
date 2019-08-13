import Slider from './Slider';

document.body.innerHTML = '<div id="test"></div>';
const root = document.querySelector('#test');

describe('Slider view', () => {
  describe('init', () => {
    const slider = new Slider({}, root);

    it('Creates root, wrapper and range elements', () => {
      expect(slider.root).toBeInstanceOf(HTMLElement);
      expect(slider.wrapper).toBeInstanceOf(HTMLElement);
      expect(slider.range).toBeInstanceOf(HTMLElement);
    });
  });

  describe('addErrors', () => {
    const slider = new Slider({}, root);

    it('Creates error element for each string', () => {
      slider.addErrors(['test', 'test']);
      const errorCont = slider.root.querySelector('.slider__error-container');
      expect(errorCont).toBeInstanceOf(HTMLElement);
      expect(errorCont.children.length).toBe(2);
    });
  });

  /*
  describe('updateRange', () => {
    const slider = new Slider({}, root);

    it('Sets range length and position, if provided', () => {
      slider.updateRange(100, 20);

      expect(slider.range.style.left).toBe('20px');
      expect(slider.range.style.width).toBe('100px');
    });
  });*/

  describe('getLength', () => {
    const slider = new Slider({}, root);

    it('Returns slider length', () => {
      expect(Number.isNaN(slider.getLength())).toBe(false);
    });
  });
});
