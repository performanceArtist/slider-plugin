import Model from './Model/Model';
import View from './Views/Main';
import Controller from './Controller/Controller';

import { Options } from './types';

function init(root: HTMLElement, options: Options | null = null) {
  const model = new Model(options);
  const view = new View(model, root);
  new Controller(model, view);

  return {
    setState: model.setState,
    getState: model.getState,
    subscribe: model.subscribe,
    unsubscribe: model.unsubscribe,
  };
}

export default init;
