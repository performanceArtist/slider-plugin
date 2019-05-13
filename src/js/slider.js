import Model from './model/model';
import View from './view/view';
import Controller from './controller/controller';

function init(selector, opt = {}) {
  const model = new Model(selector, opt);
  const view = new View(model);
  const controller = new Controller(model, view);

  return {
    setState: model.setState,
    getState: model.getState
  };
}

export default init;
