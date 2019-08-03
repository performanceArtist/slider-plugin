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

    this.render = this.render.bind(this);
    this.getSliderLength = this.getSliderLength.bind(this);
    this.createSlider = this.createSlider.bind(this);
    this.addHandles = this.addHandles.bind(this);
    this.addSteps = this.addSteps.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.notifyValueUpdate = this.notifyValueUpdate.bind(this);
    this.update = this.update.bind(this);
    this.updateRange = this.updateRange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.preventDefaultDrag = this.preventDefaultDrag.bind(this);

    this.render();
  }

  render() {
    const { isHorizontal, hasInterval } = this.model.getState();
    this.createSlider();
    this.addHandles();
    this.addSteps();
    this.addErrors();

    this.dom.wrapper.addEventListener('click', this.handleClick);
    this.dom.wrapper.addEventListener('drag', this.preventDefaultDrag);

    if (hasInterval) {
      const { first, second } = <{ first: Handle; second: Handle }>this.handle;

      first.subscribe(this.notifyValueUpdate, 'newPosition');
      second.subscribe(this.notifyValueUpdate, 'newPosition');
    } else {
      (<Handle>this.handle).subscribe(this.notifyValueUpdate, 'newPosition');
    }

    this.root.innerHTML = '';
    this.root.appendChild(this.dom.root);

    this._sliderLength = isHorizontal
      ? this.dom.wrapper.offsetWidth
      : this.dom.wrapper.offsetHeight;

    this.update();
  }

  getSliderLength() {
    return this._sliderLength;
  }

  createSlider() {
    const { isHorizontal } = this.model.getState();

    this.dom = {
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

    this.dom.root.appendChild(this.dom.wrapper);
    this.dom.root.appendChild(this.dom.errorCont);
    this.dom.wrapper.appendChild(this.dom.selected);
  }

  addHandles() {
    const { hasInterval, showBubble, isHorizontal } = this.model.getState();

    if (hasInterval) {
      this.handle = {
        first: new Handle({ isHorizontal, showBubble }),
        second: new Handle({ isHorizontal, showBubble }),
      };

      this.dom.wrapper.appendChild(this.handle.first.getElements());
      this.dom.wrapper.appendChild(this.handle.second.getElements());
    } else {
      this.handle = new Handle({ isHorizontal, showBubble });
      this.dom.wrapper.appendChild(this.handle.getElements());
    }
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

  addErrors() {
    const errors = this.model.takeMeta().errors;

    errors
      .map((error: string) => {
        const row = createNode('div', { class: 'slider__error' });
        row.innerHTML = error;
        return row;
      })
      .forEach((element: HTMLElement) => {
        this.dom.errorCont.appendChild(element);
      });
  }

  notifyValueUpdate(position: number) {
    const { min, max } = this.model.getState();
    const value = min + ((max - min) * position) / this.getSliderLength();

    this.notify('newValue', value);
  }

  update() {
    const sliderLength = this.getSliderLength();
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

      this.updateRange(secondPosition - firstPosition, firstPosition);
    } else {
      const handle = <Handle>this.handle;
      const position = (sliderLength * (value - min)) / (max - min);

      handle.setPosition(value, position);

      this.updateRange(position);
    }
  }

  updateRange(size: number, position: number | null = null) {
    const { isHorizontal } = this.model.getState();

    if (isHorizontal) {
      this.dom.selected.style.width = `${size}px`;
      if (position) this.dom.selected.style.left = `${position}px`;
    } else {
      this.dom.selected.style.height = `${size}px`;
      if (position) this.dom.selected.style.top = `${position}px`;
    }
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isValidClick =
      target.className === 'slider__wrapper' ||
      target.className === 'slider__done' ||
      target.className === 'slider__label';

    if (!isValidClick) return;

    const { isHorizontal, max, min } = this.model.getState();
    const { left, top } = this.dom.wrapper.getBoundingClientRect();
    const position = isHorizontal ? event.clientX - left : event.clientY - top;
    const value =
      target.className === 'slider__label'
        ? parseFloat(target.innerHTML)
        : min + ((max - min) * position) / this.getSliderLength();

    this.notify('newValue', value);
  }

  preventDefaultDrag(event: MouseEvent) {
    event.preventDefault();
  }
}

export default View;
