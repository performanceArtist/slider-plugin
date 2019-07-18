import { createNode } from './utils';

class Handle {
  element: HTMLElement;
  private _bubble: HTMLElement;
  private _horizontal: boolean;

  constructor({ position = 0, horizontal = true, showBubble = true } = {}) {
    const bubbleStyle = showBubble ? 'display:absolute;' : 'display:none;';

    this.element = createNode('span', { class: 'slider__head' });
    this._bubble = createNode('div', {
      class: 'slider__bubble',
      style: bubbleStyle
    });
    this._horizontal = horizontal;
    this.setPosition = this.setPosition.bind(this);

    this.setPosition(0, position);
  }

  setPosition(value: number, position: number) {
    if (this._horizontal) {
      this.element.style.left = `${position - 12.5}px`;
      this._bubble.style.left = `${position - 18}px`;
    } else {
      this.element.style.top = `${position - 12.5}px`;
      this._bubble.style.top = `${position - 18}px`;
    }

    this._bubble.innerHTML = value.toString();
  }

  getElements() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.element);
    fragment.appendChild(this._bubble);
    return fragment;
  }
}

export default Handle;
