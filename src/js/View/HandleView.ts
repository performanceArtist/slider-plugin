import { createNode } from './utils';
import Observable from '../Observable/Observable';

class Handle extends Observable {
  handle: HTMLElement;
  bubble: HTMLElement;
  isHorizontal: boolean;
  showBubble: boolean;

  constructor({ position = 0, isHorizontal = true, showBubble = true } = {}) {
    super();

    this.isHorizontal = isHorizontal;
    this.showBubble = showBubble;

    this.init = this.init.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.getElements = this.getElements.bind(this);

    this.init();
    this.setPosition(0, position);
  }

  init() {
    const bubbleStyle = this.showBubble ? 'display:absolute;' : 'display:none;';

    this.handle = createNode('span', { class: 'slider__head' });
    this.handle.addEventListener('mousedown', this.handleDrag);
    this.bubble = createNode('div', {
      class: 'slider__bubble',
      style: bubbleStyle,
    });
  }

  handleDrag(event: MouseEvent) {
    const handle = event.target as HTMLElement;
    const handleX = handle.offsetLeft;
    const handleY = handle.offsetTop;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    event.preventDefault();

    const moveHandle = (moveEvent: MouseEvent) => {
      const position = this.isHorizontal
        ? handleX + moveEvent.clientX - mouseX + handle.offsetWidth / 2
        : handleY + moveEvent.clientY - mouseY + handle.offsetHeight / 2;

      this.notify('newPosition', position);
    };

    window.addEventListener('mousemove', moveHandle);

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', moveHandle);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mouseup', handleMouseUp);
  }

  setPosition(value: number, position: number) {
    if (this.isHorizontal) {
      this.handle.style.left = `${position - this.handle.offsetWidth / 2}px`;
      this.bubble.style.left = `${position - this.bubble.offsetWidth / 2}px`;
    } else {
      this.handle.style.top = `${position - this.handle.offsetHeight / 2}px`;
      this.bubble.style.top = `${position - this.bubble.offsetHeight / 2}px`;
    }

    this.bubble.innerHTML = value.toString();
  }

  getElements() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.handle);
    fragment.appendChild(this.bubble);
    return fragment;
  }
}

export default Handle;
