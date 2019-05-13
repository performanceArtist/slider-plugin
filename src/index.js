import './main.scss';

import init from './js/slider';
import panel from './components/panel/panel';

window.onload = function windowHasLoaded() {
  init('#example1');
  init('#example2', {
    value: 20,
    step: 20,
    showBubble: false,
    showSteps: true
  });
  init('#example3', {
    value: 10,
    min: 40,
    horizontal: false
  });

  const configExample = init('#config-example');
  panel('panel', configExample);
};
