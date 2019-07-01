import Model from './model/model';
import View from './view/view';
import Controller from './controller/controller';

import Options from './Options';

function init(root: HTMLElement, options: Options = {}) {
  const model = new Model(options);
  const view = new View(model, root);
  new Controller(model, view);

  return {
    setState: model.setState,
    getState: model.getState
  };
}

export default init;
