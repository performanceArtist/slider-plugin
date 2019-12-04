import Model from '../Model/Model';
import View from '../Views/Main';
import Controller from './Controller';

import { SliderOptions } from '../types';

document.body.innerHTML =
  '<div id="slider"></div><div id="interval-slider"></div>';

const init = (selector: string, options?: Partial<SliderOptions>) => {
  const root = document.querySelector(selector);
  const model = new Model(options);
  const view = new View(model, root as HTMLElement);
  const controller = new Controller(model, view);

  return { model, view, controller };
};

describe('Controller', () => {
  describe('subscribeToUpdates', () => {
    it('Invokes the provided callback on any update notification(valueUpdate, intervalValueUpdate, optionsUpdate)', () => {
      const callback = jest.fn();

      const slider = init('#slider');
      slider.controller.subscribeToUpdates(callback);
      slider.model.notify('valueUpdate', { value: 0, ratio: 0 });
      slider.model.notify('optionsUpdate');
      expect(callback).toBeCalledTimes(2);
      callback.mockClear();

      const intervalSlider = init('#interval-slider', { hasInterval: true });
      intervalSlider.controller.subscribeToUpdates(callback);
      intervalSlider.model.notify('intervalValueUpdate', {
        first: { value: 0, ratio: 0 },
        second: { value: 0, ratio: 0 },
      });
      intervalSlider.model.notify('optionsUpdate');
      expect(callback).toBeCalledTimes(2);
    });
  });
});
