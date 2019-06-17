import './main.scss';

import init from './js/slider';
import panel from './components/panel/panel';

window.onload = function windowHasLoaded() {
  init('#example1', { interval: true });
  /*
  init('#example2', {
    value: 20,
    step: 20,
    showBubble: false,
    showSteps: true
  });
  
  init('#example3', {
    value: 10,
    min: 40,
    interval: true
  });
*/
  const configExample = init('#config-example', { interval: true });
  panel('panel', configExample);
};
