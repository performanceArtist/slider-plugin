import Model from './Model/Model';
import View from './Views/Main';
import Controller from './Controller/Controller';

import { Options } from './types';

function init(root: HTMLElement, options: Options | null = null) {
  const model = new Model(options);
  const view = new View(model, root);
  const controller = new Controller(model, view);

  return {
    setState: controller.setState,
    getState: controller.getState,
    subscribeToUpdates: controller.subscribeToUpdates,
  };
}

export default init;
