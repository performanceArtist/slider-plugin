import Model from '../Model/Model';
import View from '../Views/Main';

import { Options } from '../types';

class Controller {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.init = this.init.bind(this);
    this.subscribeToUpdates = this.subscribeToUpdates.bind(this);
    this.getState = this.getState.bind(this);
    this.setState = this.setState.bind(this);

    this.init();
  }

  init() {
    this.model.subscribe(this.view.render, 'optionsUpdate');
    this.model.subscribe(this.view.update, 'valueUpdate');
    this.model.subscribe(this.view.updateInterval, 'intervalValueUpdate');

    this.view.subscribe(
      (value: number) => this.model.setState({ value }),
      'scaleClick',
    );
    this.view.subscribe(this.model.setRatio, 'handleDrag');
  }

  subscribeToUpdates(callback: Function) {
    const updateEvents = [
      'valueUpdate',
      'intervalValueUpdate',
      'optionsUpdate',
    ];

    updateEvents.forEach(event =>
      this.model.subscribe(() => callback(this.model.getState()), event),
    );
  }

  getState() {
    return this.model.getState();
  }

  setState(options: Options) {
    this.model.setState(options);
  }
}

export default Controller;
