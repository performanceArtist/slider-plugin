import Slider from './Slider';

document.body.innerHTML = '<div id="test"></div>';
const root = document.querySelector('#test');

describe('Slider view', () => {
  describe('init', () => {
    const slider = new Slider(root as HTMLElement);

    it('Creates root, wrapper and range elements', () => {
      expect(slider.root).toBeInstanceOf(HTMLElement);
      expect(slider.wrapper).toBeInstanceOf(HTMLElement);
      expect(slider.range).toBeInstanceOf(HTMLElement);
    });
  });

  describe('addErrors', () => {
    const slider = new Slider(root as HTMLElement);

    it('Creates error element for each string', () => {
      slider.addErrors(['test', 'test']);
      const errorCont = slider.root.querySelector('.slider__error-container');
      expect(errorCont).toBeInstanceOf(HTMLElement);
      expect(errorCont.children.length).toBe(2);
    });
  });

  describe('getLength', () => {
    const slider = new Slider(
      root as HTMLElement,
      { isHorizontal: true, hasInterval: true }
    );

    it('Returns slider length', () => {
      expect(Number.isNaN(slider.getLength())).toBe(false);
    });
  });
});
