import Model from './model/model';
import View from './view/view';
import Controller from './controller/controller';

import { Options } from './types';

function init(root: HTMLElement, options: Options | null = null) {
  const model = new Model(options);
  const view = new View(model, root);
  new Controller(model, view);

  return {
    setState: model.setState,
    getState: model.getState,
    subscribe: model.subscribe,
    unsubscribe: model.unsubscribe
  };
}

export default init;
