import init from './js/slider';
import Panel from './components/panel/panel';

import { Options } from './js/types';

window.onload = function windowHasLoaded() {
  const createExample = (id: string, sliderOptions: Options = {}) => {
    const slider = init(document.getElementById(id), sliderOptions);
    new Panel(`[data-slider=${id}]`, slider);
  };

  createExample('example-1', {
    interval: true
  });

  createExample('example-2', {
    value: 20,
    step: 20,
    showBubble: false,
    showSteps: true
  });

  createExample('example-3', {
    value: 10,
    min: 40,
    horizontal: false,
    interval: true
  });
};

function importAll(resolve: any) {
  resolve.keys().forEach(resolve);
}

importAll(require.context('./', true, /\.(css|scss)$/));
