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
  handle: Handle | { first: Handle; second: Handle };
  private _sliderLength: number;

  constructor(model: Model, root: HTMLElement) {
    super();

    this.model = model;
    if (!root) throw new Error(`Invalid root element`);
    this.root = root;

    this.createSlider = this.createSlider.bind(this);
    this.render = this.render.bind(this);
    this.update = this.update.bind(this);
    this.getSliderLength = this.getSliderLength.bind(this);

    this.render();
  }

  createSlider() {
    const {
      min,
      max,
      interval,
      showBubble,
      horizontal,
      showSteps,
      step
    } = this.model.getState();
    const errors = this.model.takeMeta().errors;

    const dom: SliderDOM = {
      container: createNode('div', { class: 'slider' }),
      slider: createNode('div', {
        class: `slider__slider ${horizontal ? 'slider_hor' : 'slider_ver'}`
      }),
      selected: createNode('div', { class: 'slider__done' }),
      errorCont: createNode('div', { class: 'slider__error-container' })
    };

    dom.container.appendChild(dom.slider);
    dom.container.appendChild(dom.errorCont);

    if (interval) {
      this.handle = {
        first: new Handle({ horizontal, showBubble }),
        second: new Handle({ horizontal, showBubble })
      };

      dom.slider.appendChild(this.handle.first.getElements());
      dom.slider.appendChild(this.handle.second.getElements());
    } else {
      this.handle = new Handle({ horizontal, showBubble });
      dom.slider.appendChild(this.handle.getElements());
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

    this.dom = dom;
  }

  render() {
    const { horizontal, interval } = this.model.getState();
    this.createSlider();

    this.dom.slider.addEventListener('click', event =>
      this.notify('click', event)
    );
    this.dom.slider.addEventListener('drag', event =>
      this.notify('drag', event)
    );

    if (interval) {
      const { first, second } = <{ first: Handle; second: Handle }>this.handle;

      first.element.addEventListener('mousedown', event =>
        this.notify('mousedown', { event, handleNum: 1 })
      );
      second.element.addEventListener('mousedown', event =>
        this.notify('mousedown', { event, handleNum: 2 })
      );
    } else {
      const { element } = <Handle>this.handle;
      element.addEventListener('mousedown', event =>
        this.notify('mousedown', { event })
      );
    }

    this.root.innerHTML = '';
    this.root.appendChild(this.dom.container);

    // can only get slider length after it's been rendered
    const length = horizontal
      ? this.dom.slider.offsetWidth
      : this.dom.slider.offsetHeight;
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
      const { first, second } = <{ first: Handle; second: Handle }>this.handle;
      const firstPosition = (sliderLength * (firstValue - min)) / (max - min);
      const secondPosition = (sliderLength * (secondValue - min)) / (max - min);

      first.setPosition(firstValue, firstPosition);
      second.setPosition(secondValue, secondPosition);

      if (horizontal) {
        this.dom.selected.style.width = `${secondPosition -
          firstPosition +
          5}px`;
        this.dom.selected.style.left = `${firstPosition + 5}px`;
      } else {
        this.dom.selected.style.height = `${secondPosition -
          firstPosition +
          5}px`;
        this.dom.selected.style.top = `${firstPosition + 5}px`;
      }
    } else {
      const handle = <Handle>this.handle;
      const position = (sliderLength * (value - min)) / (max - min);

      handle.setPosition(value, position);
      this.dom.selected.style.width = `${position + 5}px`;
    }
  }

  getSliderLength() {
    return this._sliderLength;
  }
}

export default View;
