import { createSlider } from './utils';
import Model from '../model/model';
import Controller from '../controller/controller';
import Observable from '../Observable';

import { SliderDOM } from '../types';

class View extends Observable {
  model: Model;
  controller: Controller;
  root: HTMLElement;
  dom: SliderDOM;
  _sliderLength: number;

  constructor(model: Model, root: HTMLElement) {
    super();

    this.model = model;
    if (!root) throw new Error(`Invalid root element`);
    this.root = root;

    this.render = this.render.bind(this);
    this.update = this.update.bind(this);
    this.getSliderLength = this.getSliderLength.bind(this);

    this.render();
  }

  render() {
    const { horizontal, interval } = this.model.getState();
    const dom = createSlider(this.model.getState(), this.model.takeMeta());

    dom.slider.addEventListener('click', event => this.notify('click', event));
    dom.slider.addEventListener('drag', event => this.notify('drag', event));
    dom.input.addEventListener('blur', event => this.notify('blur', event));
    if (interval) {
      dom.firstHandle.addEventListener('mousedown', event =>
        this.notify('mousedown', event)
      );
      dom.secondHandle.addEventListener('mousedown', event =>
        this.notify('mousedown', event)
      );
    } else {
      dom.sliderHandle.addEventListener('mousedown', event =>
        this.notify('mousedown', event)
      );
    }

    this.root.innerHTML = '';
    this.root.appendChild(dom.container);
    this.dom = dom;

    // can only get slider length after it's been rendered
    const length = horizontal
      ? dom.slider.offsetWidth
      : dom.slider.offsetHeight;
    this._sliderLength = length;

    this.update();
  }

  update() {
    const { interval } = this.model.getState();
    const sliderLength = this.getSliderLength();

    if (interval) {
      const {
        firstValue,
        secondValue,
        min,
        max,
        horizontal
      } = this.model.getState();

      changePosition({
        handle: this.dom.firstHandle,
        done: this.dom.firstDone,
        bubble: this.dom.firstBubble,
        position: (sliderLength * (firstValue - min)) / (max - min),
        horizontal
      });

      changePosition({
        handle: this.dom.secondHandle,
        done: this.dom.selected,
        bubble: this.dom.secondBubble,
        position: (sliderLength * (secondValue - min)) / (max - min),
        horizontal
      });

      this.dom.firstBubble.innerHTML = firstValue.toString();
      this.dom.secondBubble.innerHTML = secondValue.toString();
      const input = this.dom.input as HTMLInputElement;
      input.value = (secondValue - firstValue).toString();
    } else {
      const { value, min, max, horizontal } = this.model.getState();

      changePosition({
        handle: this.dom.sliderHandle,
        done: this.dom.selected,
        bubble: this.dom.bubble,
        position: (sliderLength * (value - min)) / (max - min),
        horizontal
      });

      this.dom.bubble.innerHTML = value.toString();
      const input = this.dom.input as HTMLInputElement;
      input.value = value.toString();
    }
  }

  getSliderLength() {
    return this._sliderLength;
  }
}

interface PositionArgs {
  handle: HTMLElement;
  done: HTMLElement;
  bubble: HTMLElement;
  position: number;
  horizontal: boolean;
}

function changePosition({
  handle,
  done,
  bubble,
  position,
  horizontal
}: PositionArgs) {
  if (horizontal) {
    handle.style.left = `${position - 2}px`;
    done.style.width = `${position + 5}px`;
    bubble.style.left = `${position - 6}px`;
  } else {
    handle.style.top = `${position - 2}px`;
    done.style.height = `${position + 5}px`;
    bubble.style.top = `${position - 6}px`;
  }
}

export default View;
