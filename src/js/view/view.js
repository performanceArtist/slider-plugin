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
  if (this.controller === undefined) {
    throw new Error('Controller was not initialized.');
  }
  const dom = createSlider(this.model);
  dom.slider.addEventListener('click', this.controller.handleClick);
  dom.sliderHandle.addEventListener('mousedown', this.controller.handleDrag);
  dom.input.addEventListener('blur', this.controller.handleInput);

  // cleanup, can only get slider length after it's been rendered
  this.root.innerHTML = '';
  this.model.props.errors = [];
  this.root.appendChild(dom.container);

  const { horizontal } = this.model.getState();

  const length = horizontal ? dom.slider.offsetWidth : dom.slider.offsetHeight;

  this.helpers = { sliderLength: length };
  this.dom = dom;

  this.update();
};

// value update only, no rerender
View.prototype.update = function update() {
  const { value, min, max, horizontal } = this.model.getState();
  const pos = (this.helpers.sliderLength * (value - min)) / (max - min);

  if (horizontal) {
    this.dom.sliderHandle.style.left = `${pos - 2}px`;
    this.dom.sliderDone.style.width = `${pos + 5}px`;
    this.dom.bubble.style.left = `${pos - 6}px`;
  } else {
    this.dom.sliderHandle.style.top = `${pos - 2}px`;
    this.dom.sliderDone.style.height = `${pos + 5}px`;
    this.dom.bubble.style.top = `${pos - 6}px`;
  }

  this.dom.bubble.innerHTML = value;
  this.dom.input.value = value;
};

export default View;
