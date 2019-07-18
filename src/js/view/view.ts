import { createNode } from './utils';
import Model from '../model/model';
import Controller from '../controller/controller';
import Observable from '../Observable';

import Handle from './Handle';

import { SliderDOM } from '../types';

class View extends Observable {
  model: Model;
  controller: Controller;
  root: HTMLElement;
  dom: SliderDOM;
  handle: Handle | [Handle, Handle];
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

  createSlider() {
    const state = this.model.getState();
    const errors = this.model.takeMeta().errors;
    const {
      min,
      max,
      interval,
      showBubble,
      horizontal,
      showSteps,
      step
    } = state;
    const newClass = horizontal ? 'slider_hor' : 'slider_ver';

    const dom: SliderDOM = {
      container: createNode('div', { class: 'slider' }),
      slider: createNode('div', { class: `slider__slider ${newClass}` }),
      selected: createNode('div', { class: 'slider__done' }),
      errorCont: createNode('div', { class: 'slider__error-container' })
    };

    dom.container.appendChild(dom.slider);
    dom.container.appendChild(dom.errorCont);

    let handle: Handle | [Handle, Handle];

    if (interval) {
      handle = [
        new Handle({ horizontal, showBubble }),
        new Handle({ horizontal, showBubble })
      ];

      dom.slider.appendChild(handle[0].getElements());
      dom.slider.appendChild(handle[1].getElements());
    } else {
      handle = new Handle({ horizontal, showBubble });
      dom.slider.appendChild(handle.getElements());
    }

    errors
      .map((error: string) => {
        const row = createNode('div', { class: 'slider__error' });
        row.innerHTML = error;
        return row;
      })
      .forEach((element: HTMLElement) => {
        dom.errorCont.appendChild(element);
      });

    dom.slider.appendChild(dom.selected);

    if (showSteps) {
      for (let i = 0; i <= max - min; i += step) {
        const position = horizontal
          ? `${(100 * i) / (max - min) - 3.5}%`
          : `${(100 * i) / (max - min) - 2.7}%`;

        const label = createNode('label', {
          class: 'slider__label',
          style: horizontal ? `left:${position}` : `top:${position}`
        });
        label.innerHTML = (i + min).toString();
        dom.slider.appendChild(label);
      }
    }

    return { dom, handle };
  }

  render() {
    const { horizontal, interval } = this.model.getState();
    const { dom, handle } = this.createSlider();
    this.dom = dom;
    this.handle = handle;

    dom.slider.addEventListener('click', event => this.notify('click', event));
    dom.slider.addEventListener('drag', event => this.notify('drag', event));

    if (interval) {
      handle[0].handle.addEventListener('mousedown', event =>
        this.notify('mousedown', { event, handleNum: 1 })
      );
      handle[1].handle.addEventListener('mousedown', event =>
        this.notify('mousedown', { event, handleNum: 2 })
      );
    } else {
      handle.handle.addEventListener('mousedown', event =>
        this.notify('mousedown', { event })
      );
    }

    this.root.innerHTML = '';
    this.root.appendChild(dom.container);

    // can only get slider length after it's been rendered
    const length = horizontal
      ? dom.slider.offsetWidth
      : dom.slider.offsetHeight;
    this._sliderLength = length;

    this.update();
  }

  update() {
    const sliderLength = this.getSliderLength();
    const {
      horizontal,
      interval,
      value,
      firstValue,
      secondValue,
      min,
      max
    } = this.model.getState();

    if (interval) {
      const first = (sliderLength * (firstValue - min)) / (max - min);
      const second = (sliderLength * (secondValue - min)) / (max - min);

      this.handle[0].setPosition(firstValue, first);
      this.handle[1].setPosition(secondValue, second);

      if (horizontal) {
        this.dom.selected.style.width = `${second - first + 5}px`;
        this.dom.selected.style.left = `${first + 5}px`;
      } else {
        this.dom.selected.style.height = `${second - first + 5}px`;
        this.dom.selected.style.top = `${first + 5}px`;
      }
    } else {
      const position = (sliderLength * (value - min)) / (max - min);
      this.handle.setPosition(value, position);
      this.dom.selected.style.width = `${position + 5}px`;
    }
  }

  getSliderLength() {
    return this._sliderLength;
  }
}

export default View;
