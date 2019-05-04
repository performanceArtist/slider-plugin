import './main.scss';

import Model from './js/model';
import View from './js/view';
import Controller from './js/controller';

import panel from './components/panel/panel';

function initPlugin(selector, opt = {}) {
  const model = new Model(selector, opt);
  const view = new View(model);
  const controller = new Controller(model, view);

  return { model, view, controller };
}

window.onload = function init() {
  initPlugin('#example1');
  initPlugin('#example2', {
    step: 20,
    showBubble: false,
    showSteps: true
  });
  initPlugin('#example3', {
    min: 40,
    max: 75,
    horizontal: false
  });
  const configExample = initPlugin('#config-example');

  panel('panel', configExample);
};
