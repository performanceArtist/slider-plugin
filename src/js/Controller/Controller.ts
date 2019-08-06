import Model from '../Model/Model';
import View from '../Views/Main';

class Controller {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    model.subscribe(view.render, 'render');
    model.subscribe(view.update, 'update');
    model.subscribe(view.updateInterval, 'updateInterval');

    view.subscribe(
      (value: number) => this.model.setState({ value }),
      'newValue',
    );
    view.subscribe(this.model.setRatio, 'newRatio');
  }
}

export default Controller;
