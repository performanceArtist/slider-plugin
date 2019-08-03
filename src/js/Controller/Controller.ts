import Model from '../Model/Model';
import View from '../Views/Main';

class Controller {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.changeValue = this.changeValue.bind(this);

    model.subscribe(view.update, 'update');
    model.subscribe(view.render, 'render');

    view.subscribe(this.changeValue, 'newValue');
  }

  changeValue(value: number) {
    this.model.setState({ value });
  }
}

export default Controller;
