import Model from '../Model/Model';
import View from '../Views/Main';

class Controller {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    model.subscribe(view.render, 'optionsUpdate');
    model.subscribe(view.update, 'valueUpdate');
    model.subscribe(view.updateInterval, 'intervalValueUpdate');

    view.subscribe(
      (value: number) => this.model.setState({ value }),
      'scaleClick',
    );
    view.subscribe(this.model.setRatio, 'handleDrag');
  }
}

export default Controller;
