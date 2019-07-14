import './main.scss';

import init from './js/slider';

import panel from './components/panel/panel';

window.onload = function windowHasLoaded() {
  init(document.querySelector('#example2'), {
    value: 20,
    step: 20,
    showBubble: false,
    showSteps: true
  });

  init(document.querySelector('#example3'), {
    value: 10,
    min: 40,
    horizontal: false,
    interval: true
  });

  const configExample = init(document.querySelector('#config-example'), {
    interval: true
  });
  panel('panel', configExample);
};
