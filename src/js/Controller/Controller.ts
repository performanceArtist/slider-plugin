import Model from '../Model/Model';
import View from '../View/View';

class Controller {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    model.subscribe(view.update, 'update');
    model.subscribe(view.render, 'render');

    view.subscribe(view.handleClick, 'click');
    view.subscribe(view.handleDrag, 'mousedown');
    view.subscribe(view.preventDefaultDrag, 'drag');
  }
}

export default Controller;
