import Observable from '../Observable/Observable';
import { Options } from '../types';
import { createNode } from './utils';

class Slider extends Observable {
  root: HTMLElement;
  wrapper: HTMLElement;
  range: HTMLElement;

  private _options: Options;

  constructor(options: Options, root: HTMLElement) {
    super();

    this._options = options;

    this.init = this.init.bind(this);
    this.getLength = this.getLength.bind(this);
    this.addSteps = this.addSteps.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.preventDefaultDrag = this.preventDefaultDrag.bind(this);

    this.init(root);
  }

  init(root: HTMLElement) {
    const { isHorizontal } = this._options;

    this.root = createNode('div', {
      class: isHorizontal
        ? 'slider slider_horizontal'
        : 'slider slider_vertical',
    });

    this.wrapper = createNode('div', {
      class: 'slider__wrapper',
    });

    this.range = createNode('div', { class: 'slider__range' });

    this.root.appendChild(this.wrapper);
    this.wrapper.appendChild(this.range);

    this.wrapper.addEventListener('click', this.handleClick);
    this.wrapper.addEventListener('drag', this.preventDefaultDrag);

    root.appendChild(this.root);
    this.addSteps();
  }

  addSteps() {
    const { showSteps, isHorizontal, max, min, step } = this._options;

    if (!showSteps) return;

    const sliderLength = this.getLength();
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
      this.wrapper.appendChild(label);
    }
  }

  addErrors(errors: Array<string> = []) {
    const errorCont = createNode('div', { class: 'slider__error-container' });

    errors
      .map((error: string) => {
        const row = createNode('div', { class: 'slider__error' });
        row.innerHTML = error;
        return row;
      })
      .forEach((element: HTMLElement) => {
        errorCont.appendChild(element);
      });

    this.root.appendChild(errorCont);
  }

  updateRange(size: number, position: number | null = null) {
    const { isHorizontal } = this._options;

    if (isHorizontal) {
      this.range.style.width = `${size}px`;
      if (position !== null) this.range.style.left = `${position}px`;
    } else {
      this.range.style.height = `${size}px`;
      if (position !== null) this.range.style.top = `${position}px`;
    }
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isValidClick =
      target.className === 'slider__wrapper' ||
      target.className === 'slider__range' ||
      target.className === 'slider__label';

    if (!isValidClick) return;

    const { isHorizontal, max, min } = this._options;
    const { left, top } = this.wrapper.getBoundingClientRect();
    const position = isHorizontal ? event.clientX - left : event.clientY - top;
    const value =
      target.className === 'slider__label'
        ? parseFloat(target.innerHTML)
        : min + ((max - min) * position) / this.getLength();

    this.notify('click', value);
  }

  preventDefaultDrag(event: MouseEvent) {
    event.preventDefault();
  }

  getLength() {
    const { isHorizontal } = this._options;
    return isHorizontal ? this.wrapper.offsetWidth : this.wrapper.offsetHeight;
  }
}

export default Slider;
