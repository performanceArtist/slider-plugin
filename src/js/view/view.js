import { createSlider } from './utils';

function View(model) {
  this.model = model;
  const { selector } = model.props;
  this.root = document.querySelector(selector);
  if (!this.root)
    throw new Error(`Invalid selector (${selector}): element not found.`);

  model.addObserver(this);
}

// initializes the controller used in render function
View.prototype.init = function init(controller) {
  this.controller = controller;
  this.render();
};

View.prototype.render = function render() {
  const { horizontal, interval } = this.model.getState();

  if (this.controller === undefined) {
    throw new Error('Controller was not initialized.');
  }
  const dom = createSlider(this.model);
  dom.slider.addEventListener('click', this.controller.handleClick);
  dom.input.addEventListener('blur', this.controller.handleInput);

  if (interval) {
    dom.first.addEventListener('mousedown', this.controller.handleDrag);
    dom.second.addEventListener('mousedown', this.controller.handleDrag);
  } else {
    dom.sliderHandle.addEventListener('mousedown', this.controller.handleDrag);
  }

  // cleanup, can only get slider length after it's been rendered
  this.root.innerHTML = '';
  this.model.props.errors = [];
  this.root.appendChild(dom.container);

  const length = horizontal ? dom.slider.offsetWidth : dom.slider.offsetHeight;

  this.helpers = { sliderLength: length };
  this.dom = dom;

  this.update();
};

function changePosition({ handle, done, bubble, pos, horizontal }) {
  if (horizontal) {
    handle.style.left = `${pos - 2}px`;
    done.style.width = `${pos + 5}px`;
    bubble.style.left = `${pos - 6}px`;
  } else {
    handle.style.top = `${pos - 2}px`;
    done.style.height = `${pos + 5}px`;
    bubble.style.top = `${pos - 6}px`;
  }
}

// value update only, no rerender
View.prototype.update = function update() {
  const { interval } = this.model.getState();

  if (interval) {
    const {
      firstValue,
      secondValue,
      min,
      max,
      horizontal
    } = this.model.getState();

    changePosition({
      handle: this.dom.first,
      done: this.dom.sliderNone,
      bubble: this.dom.firstBubble,
      pos: (this.helpers.sliderLength * (firstValue - min)) / (max - min),
      horizontal
    });

    changePosition({
      handle: this.dom.second,
      done: this.dom.sliderDone,
      bubble: this.dom.secondBubble,
      pos: (this.helpers.sliderLength * (secondValue - min)) / (max - min),
      horizontal
    });

    this.dom.firstBubble.innerHTML = firstValue;
    this.dom.secondBubble.innerHTML = secondValue;
    this.dom.input.value = secondValue - firstValue;
  } else {
    const { value, min, max, horizontal } = this.model.getState();

    changePosition({
      handle: this.dom.sliderHandle,
      done: this.dom.sliderDone,
      bubble: this.dom.bubble,
      horizontal,
      pos: (this.helpers.sliderLength * (value - min)) / (max - min)
    });

    this.dom.bubble.innerHTML = value;
    this.dom.input.value = value;
  }
};

export default View;
