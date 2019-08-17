import Model from '../Model/Model';
import Observable from '../Observable/Observable';

import Handle from './Handle';
import Slider from './Slider';

type Position = { value: number; ratio: number };

class Main extends Observable {
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
    this.notifyClick = this.notifyClick.bind(this);
    this.notifyDrag = this.notifyDrag.bind(this);
    this.update = this.update.bind(this);
    this.updateInterval = this.updateInterval.bind(this);

    this.render();
  }

  render() {
    this.addSlider();
    this.addHandles();
  }

  addSlider() {
    this.root.innerHTML = '';
    this.slider = new Slider(this.model.getState(), this.root);
    const { errors } = this.model.takeMeta();
    this.slider.addErrors(errors);
    this.slider.subscribe(this.notifyClick, 'click');
  }

  addHandles() {
    const { hasInterval, showBubble, isHorizontal } = this.model.getState();

    if (hasInterval) {
      this.handle = {
        first: new Handle({ isHorizontal, showBubble }),
        second: new Handle({ isHorizontal, showBubble }),
      };

      this.handle.first.subscribe(this.notifyDrag, 'drag');
      this.handle.second.subscribe(this.notifyDrag, 'drag');

      this.slider.wrapper.appendChild(this.handle.first.getElements());
      this.slider.wrapper.appendChild(this.handle.second.getElements());
    } else {
      this.handle = new Handle({ isHorizontal, showBubble });
      this.handle.subscribe(this.notifyDrag, 'drag');
      this.slider.wrapper.appendChild(this.handle.getElements());
    }
  }

  notifyClick(value: number) {
    this.notify('scaleClick', value);
  }

  notifyDrag(position: number) {
    this.notify('handleDrag', position / this.slider.getLength());
  }

  update({ value, ratio }: Position) {
    const sliderLength = this.slider.getLength();
    const handle = this.handle as Handle;
    const position = sliderLength * ratio;

    handle.setPosition(value, position);
    this.slider.updateRange(position);
  }

  updateInterval({ first, second }: { first: Position; second: Position }) {
    const sliderLength = this.slider.getLength();
    const { first: firstHandle, second: secondHandle } = this.handle as {
      first: Handle;
      second: Handle;
    };

    const firstPosition = sliderLength * first.ratio;
    const secondPosition = sliderLength * second.ratio;

    firstHandle.setPosition(first.value, firstPosition);
    secondHandle.setPosition(second.value, secondPosition);

    this.slider.updateRange(secondPosition - firstPosition, firstPosition);
  }
}

export default Main;
