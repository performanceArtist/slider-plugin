function View(model) {
  this.model = model;
  const { selector } = model.props;
  this.root = document.querySelector(selector);
  if (!this.root)
    throw new Error(`Invalid selector (${selector}): element not found.`);

  model.addObserver(this);
}

// helper to create nodes
function createNode(type, attr = {}) {
  const node = document.createElement(type);

  Object.keys(attr).forEach(key => {
    node.setAttribute(key, attr[key]);
  });

  return node;
}

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

View.prototype.render = function render(controller) {
  const view = this;

  function rerender() {
    const {
      min,
      max,
      showBubble,
      horizontal,
      showSteps,
      step
    } = view.model.getState();
    const newClass = horizontal ? 'slider_hor' : 'slider_ver';
    const bubbleStyle = showBubble ? 'display:absolute;' : 'display:none;';

    const dom = {
      container: createNode('div', { class: 'slider' }),
      input: createNode('input', { class: 'slider__input', type: 'text' }),
      slider: createNode('div', { class: `slider__slider ${newClass}` }),
      bubble: createNode('div', {
        class: 'slider__bubble',
        style: bubbleStyle
      }),
      sliderDone: createNode('div', { class: 'slider__done' }),
      sliderHandle: createNode('span', { class: 'slider__head' }),
      errorCont: createNode('div', { class: 'slider__error-container' })
    };

    dom.container.appendChild(dom.input);
    dom.container.appendChild(dom.slider);
    dom.container.appendChild(dom.errorCont);
    view.model.props.errors
      .map(err => {
        const row = createNode('div', { class: 'slider__error' });
        row.innerHTML = err.getMessage();
        return row;
      })
      .forEach(elm => {
        dom.errorCont.appendChild(elm);
      });
    view.model.props.errors = [];
    dom.bubble.innerHTML = min;
    [dom.bubble, dom.sliderDone, dom.sliderHandle].forEach(el => {
      dom.slider.appendChild(el);
    });

    if (showSteps) {
      for (let i = 0; i <= max - min; i += step) {
        const percentage = (100 * i) / (max - min);
        const label = createNode('label', {
          class: 'slider__label',
          style: horizontal ? `left:${percentage}%` : `top:${percentage}%`
        });
        label.innerHTML = i + min;
        dom.slider.appendChild(label);
      }
    }

    dom.slider.addEventListener('click', controller.handleClick);
    dom.sliderHandle.addEventListener('mousedown', controller.handleDrag);
    dom.input.addEventListener('blur', controller.handleInput);

    // do this before getting the slider length
    view.root.innerHTML = '';
    view.root.appendChild(dom.container);

    const length = horizontal
      ? dom.slider.offsetWidth
      : dom.slider.offsetHeight;

    view.helpers = { sliderLength: length };
    view.dom = dom;

    // update value
    view.update();
  }

  this.rerender = rerender;
  rerender();
};

export default View;
