function View(model) {
  this.model = model;
  this.root = document.querySelector(model.get('selector'));
  if (!this.root)
    throw new Error(
      `Invalid selector (${model.get('selector')}): element not found.`
    );

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
  const value = this.model.get('value');
  const min = this.model.get('min');
  const max = this.model.get('max');
  const isHorizontal = this.model.get('horizontal');
  const pos = (this.helpers.sliderLength * (value - min)) / (max - min);

  if (isHorizontal) {
    this.dom.sliderHandle.style.left = `${pos}px`;
    this.dom.sliderDone.style.width = `${pos + 5}px`;
    this.dom.bubble.style.left = `${pos - 4}px`;
  } else {
    this.dom.sliderHandle.style.top = `${pos}px`;
    this.dom.sliderDone.style.height = `${pos + 5}px`;
    this.dom.bubble.style.top = `${pos - 4}px`;
  }

  this.dom.bubble.innerHTML = value;
  this.dom.input.value = value;
};

View.prototype.render = function render(controller) {
  const view = this;

  function rerender() {
    const isHorizontal = view.model.get('horizontal');
    const newClass = isHorizontal ? 'slider_hor' : 'slider_ver';
    const bubbleStyle = view.model.get('showBubble')
      ? 'display:absolute;'
      : 'display:none;';
    const max = view.model.get('max');
    const min = view.model.get('min');

    const dom = {
      container: createNode('div', { class: 'slider-cont' }),
      input: createNode('input', { type: 'text' }),
      slider: createNode('div', { class: `slider ${newClass}` }),
      bubble: createNode('div', {
        class: 'value-bubble',
        style: bubbleStyle
      }),
      sliderDone: createNode('div', { class: 'slider__done' }),
      sliderHandle: createNode('span', { class: 'slider__head' })
    };

    dom.container.appendChild(dom.input);
    dom.container.appendChild(dom.slider);
    dom.bubble.innerHTML = min;
    [dom.bubble, dom.sliderDone, dom.sliderHandle].forEach(el => {
      dom.slider.appendChild(el);
    });

    if (view.model.get('showSteps')) {
      const step = view.model.get('step');

      for (let i = 0; i <= max - min; i += step) {
        const percentage = (100 * i) / (max - min);
        const label = createNode('label', {
          style: isHorizontal ? `left:${percentage}%` : `top:${percentage}%`
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

    const length = isHorizontal
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
