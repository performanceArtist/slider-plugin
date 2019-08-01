import Model from '../Model/Model';
import View from '../View/View';

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

  changeValue({
    value,
    handleNum = null,
  }: {
    value: number;
    handleNum: number | null;
  }) {
    const { firstValue, secondValue, hasInterval } = this.model.getState();

    if (hasInterval) {
      const isFirst = handleNum
        ? handleNum === 1
        : Math.abs(value - firstValue) < Math.abs(value - secondValue);

      if (isFirst) {
        this.model.setState({ firstValue: value });
      } else {
        this.model.setState({ secondValue: value });
      }
    } else {
      this.model.setState({ value });
    }
  }
}

export default Controller;
