import Model from '../Model/Model';
import Observable from '../Observable/Observable';

import Handle from './Handle';
import Slider from './Slider';

class View extends Observable {
  model: Model;
  root: HTMLElement;
  slider: Slider;
  handle: Handle | { first: Handle; second: Handle };

  constructor(model: Model, root: HTMLElement) {
    super();

    if (!root) throw new Error(`Invalid root element`);

    this.model = model;
    this.root = root;

    this.render = this.render.bind(this);
    this.addSlider = this.addSlider.bind(this);
    this.addHandles = this.addHandles.bind(this);
    this.notifyPositionUpdate = this.notifyPositionUpdate.bind(this);
    this.notifyValueUpdate = this.notifyValueUpdate.bind(this);
    this.update = this.update.bind(this);

    this.render();
  }

  render() {
    this.addSlider();
    this.addHandles();
    this.update();
  }

  addSlider() {
    this.root.innerHTML = '';
    this.slider = new Slider(this.model.getState(), this.root);
    this.slider.subscribe(this.notifyValueUpdate, 'click');
  }

  addHandles() {
    const { hasInterval, showBubble, isHorizontal } = this.model.getState();

    if (hasInterval) {
      this.handle = {
        first: new Handle({ isHorizontal, showBubble }),
        second: new Handle({ isHorizontal, showBubble }),
      };

      this.handle.first.subscribe(this.notifyPositionUpdate, 'newPosition');
      this.handle.second.subscribe(this.notifyPositionUpdate, 'newPosition');

      this.slider.wrapper.appendChild(this.handle.first.getElements());
      this.slider.wrapper.appendChild(this.handle.second.getElements());
    } else {
      this.handle = new Handle({ isHorizontal, showBubble });
      this.handle.subscribe(this.notifyPositionUpdate, 'newPosition');
      this.slider.wrapper.appendChild(this.handle.getElements());
    }
  }

  notifyPositionUpdate(position: number) {
    const { min, max } = this.model.getState();
    const value = min + ((max - min) * position) / this.slider.getLength();

    this.notifyValueUpdate(value);
  }

  notifyValueUpdate(value: number) {
    this.notify('newValue', value);
  }

  update() {
    const sliderLength = this.slider.getLength();
    const {
      hasInterval,
      value,
      firstValue,
      secondValue,
      min,
      max,
    } = this.model.getState();

    if (hasInterval) {
      const { first, second } = <{ first: Handle; second: Handle }>this.handle;
      const firstPosition = (sliderLength * (firstValue - min)) / (max - min);
      const secondPosition = (sliderLength * (secondValue - min)) / (max - min);

      first.setPosition(firstValue, firstPosition);
      second.setPosition(secondValue, secondPosition);

      this.slider.updateRange(secondPosition - firstPosition, firstPosition);
    } else {
      const handle = <Handle>this.handle;
      const position = (sliderLength * (value - min)) / (max - min);

      handle.setPosition(value, position);

      this.slider.updateRange(position);
    }
  }
}

export default View;
