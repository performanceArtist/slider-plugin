import { createNode } from './utils';
import Model from '../Model/Model';
import Observable from '../Observable/Observable';

import Handle from './HandleView';

import { SliderDOM } from '../types';

class View extends Observable {
  model: Model;
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
    this.notifyValueUpdate = this.notifyValueUpdate.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.preventDefaultDrag = this.preventDefaultDrag.bind(this);
    this.addSteps = this.addSteps.bind(this);

    this.render();
  }

  createSlider() {
    const { hasInterval, showBubble, isHorizontal } = this.model.getState();
    const errors = this.model.takeMeta().errors;

    const dom: SliderDOM = {
      root: createNode('div', {
        class: isHorizontal
          ? 'slider slider_horizontal'
          : 'slider slider_vertical',
      }),
      wrapper: createNode('div', {
        class: 'slider__wrapper',
      }),
      selected: createNode('div', { class: 'slider__done' }),
      errorCont: createNode('div', { class: 'slider__error-container' }),
    };

    dom.root.appendChild(dom.wrapper);

    dom.wrapper.appendChild(dom.selected);

    if (hasInterval) {
      this.handle = {
        first: new Handle({ isHorizontal, showBubble }),
        second: new Handle({ isHorizontal, showBubble }),
      };

      dom.wrapper.appendChild(this.handle.first.getElements());
      dom.wrapper.appendChild(this.handle.second.getElements());
    } else {
      this.handle = new Handle({ isHorizontal, showBubble });
      dom.wrapper.appendChild(this.handle.getElements());
    }

    dom.root.appendChild(dom.errorCont);

    errors
      .map((error: string) => {
        const row = createNode('div', { class: 'slider__error' });
        row.innerHTML = error;
        return row;
      })
      .forEach((element: HTMLElement) => {
        dom.errorCont.appendChild(element);
      });

    this.dom = dom;
  }

  notifyValueUpdate(position: number) {
    const { min, max } = this.model.getState();
    const value = min + ((max - min) * position) / this.getSliderLength();

    this.notify('newValue', value);
  }

  addSteps() {
    const { showSteps, isHorizontal, max, min, step } = this.model.getState();

    if (!showSteps) return;

    const sliderLength = this.getSliderLength();
    const stepCount = (max - min) / step;
    const gap = sliderLength / stepCount;
    const realStep =
      gap < 18 ? Math.floor(((max - min) * 18) / sliderLength) : step;

    for (let i = 0; i <= max - min; i += realStep) {
      const position = isHorizontal
        ? `${(100 * i) / (max - min) - 3.5}%`
        : `${(100 * i) / (max - min) - 2.7}%`;

      const label = createNode('label', {
        class: 'slider__label',
        style: isHorizontal ? `left:${position}` : `top:${position}`,
      });
      label.innerHTML = (i + min).toString();
      this.dom.wrapper.appendChild(label);
    }
  }

  render() {
    const { isHorizontal, hasInterval } = this.model.getState();
    this.createSlider();

    this.dom.wrapper.addEventListener('click', this.handleClick);
    this.dom.wrapper.addEventListener('drag', this.preventDefaultDrag);

    if (hasInterval) {
      const { first, second } = <{ first: Handle; second: Handle }>this.handle;

      first.subscribe(this.notifyValueUpdate, 'newPosition');
      second.subscribe(this.notifyValueUpdate, 'newPosition');
    } else {
      const handle = <Handle>this.handle;

      handle.subscribe(this.notifyValueUpdate, 'newPosition');
    }

    this.root.innerHTML = '';
    this.root.appendChild(this.dom.root);

    const length = isHorizontal
      ? this.dom.wrapper.offsetWidth
      : this.dom.wrapper.offsetHeight;
    this._sliderLength = length;

    this.addSteps();
    this.update();
  }

  update() {
    const sliderLength = this.getSliderLength();
    const {
      isHorizontal,
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

      if (isHorizontal) {
        this.dom.selected.style.width = `${secondPosition - firstPosition}px`;
        this.dom.selected.style.left = `${firstPosition}px`;
      } else {
        this.dom.selected.style.height = `${secondPosition - firstPosition}px`;
        this.dom.selected.style.top = `${firstPosition}px`;
      }
    } else {
      const handle = <Handle>this.handle;
      const position = (sliderLength * (value - min)) / (max - min);

      handle.setPosition(value, position);

      if (isHorizontal) {
        this.dom.selected.style.width = `${position}px`;
      } else {
        this.dom.selected.style.height = `${position}px`;
      }
    }
  }

  getSliderLength() {
    return this._sliderLength;
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isValidClick =
      target.classList.contains('slider__wrapper') ||
      target.className === 'slider__done' ||
      target.className === 'slider__label';

    if (!isValidClick) return;

    const { isHorizontal, max, min } = this.model.getState();
    const rect = this.dom.wrapper.getBoundingClientRect();
    const position = isHorizontal
      ? event.clientX - rect.left
      : event.clientY - rect.top;
    const sliderLength = this.getSliderLength();
    const value =
      target.className === 'slider__label'
        ? parseFloat(target.innerHTML)
        : min + ((max - min) * position) / sliderLength;

    this.notify('newValue', value);
  }

  preventDefaultDrag(event: MouseEvent) {
    event.preventDefault();
  }
}

export default View;
