import Model from './Model/Model';
import View from './Views/Main';
import Controller from './Controller/Controller';

import { SliderOptions } from './types';

declare global {
  interface Window {
    $: JQuery;
  }

  interface JQuery {
    slider: (
      options?: Partial<SliderOptions> | 'setState' | 'getState' | 'subscribeToUpdates',
      rest?: Partial<SliderOptions> | Function,
    ) => any;
  }
}

(function($) {
  $.fn.slider = function(options, ...args) {
    const init = () =>
      $(this).map(function() {
        const data = $(this).data() as Partial<SliderOptions>;
        const allOptions =
          typeof options === 'object' ? { ...data, ...options } : data;
        const model = new Model(allOptions);
        const view = new View(model, this);
        const controller = new Controller(model, view);

        $(this).data('controller', controller);

        return this;
      });

    const applyMethod = (name: string, $this: JQuery<Element>) => {
      if (!$this.data('controller')) {
        init();
      }

      const controller = $this.data('controller');

      if (controller[name]) {
        return controller[name].apply(controller, args);
      } else {
        return $.error(`${name} method does not exist.`);
      }
    };

    if (typeof options === 'string') {
      return $(this).map(function() {
        return applyMethod(options, $(this));
      });
    }

    return init();
  };
})($);
