import './main.scss';

import Model from './js/model';
import View from './js/view';
import Controller from './js/controller';

import panel from './components/panel/panel';

function initPlugin(selector, opt = {}) {
  const model = new Model(selector, opt);
  const view = new View(model);
  const controller = new Controller(model, view);

  return {
    setState: model.setState,
    getState: model.getState
  };
}

window.onload = function init() {
  initPlugin('#example1');
  initPlugin('#example2', {
    value: 20,
    step: 20,
    showBubble: false,
    showSteps: true
  });
  initPlugin('#example3', {
    value: 10,
    min: 40,
    horizontal: false
  });

  const configExample = initPlugin('#config-example');

  panel('panel', configExample);
};
