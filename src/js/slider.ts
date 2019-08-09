import Model from './Model/Model';
import View from './Views/Main';
import Controller from './Controller/Controller';

import { Options, SliderInterface } from './types';

declare global {
  interface JQuery {
    slider: (options: Options) => JQuery<SliderInterface>;
  }
}

(function($) {
  function init(root: HTMLElement, options: Options | null = null) {
    const model = new Model(options);
    const view = new View(model, root);
    const controller = new Controller(model, view);

    return {
      setState: controller.setState,
      getState: controller.getState,
      subscribeToUpdates: controller.subscribeToUpdates,
    };
  }

  $.fn.slider = function(options = {}) {
    return $(this).map(function() {
      const data = $(this).data();
      return init(this, { ...data, ...options });
    });
  };
})(jQuery);
