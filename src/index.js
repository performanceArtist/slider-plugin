import './main.scss';

import init from './js/slider';
import panel from './components/panel/panel';

(function($) {
  $.fn.slider = init;
})(jQuery);

window.onload = function windowHasLoaded() {
  $('#example1').slider('#example1', { interval: true });

  init('#example2', {
    value: 20,
    step: 20,
    showBubble: false,
    showSteps: true
  });

  init('#example3', {
    value: 10,
    min: 40,
    horizontal: false,
    interval: true
  });
  const configExample = init('#config-example', { interval: true });
  panel('panel', configExample);
};
