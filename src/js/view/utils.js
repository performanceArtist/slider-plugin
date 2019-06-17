// helper to create nodes
function createNode(type, attr = {}) {
  const node = document.createElement(type);

  Object.keys(attr).forEach(key => {
    node.setAttribute(key, attr[key]);
  });

  return node;
}

// creates slider based purely on model
function createSlider(model) {
  const {
    min,
    max,
    interval,
    showBubble,
    horizontal,
    showSteps,
    step
  } = model.getState();

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
  if (interval) {
    dom.first = dom.sliderHandle.cloneNode();
    dom.first.classList.add('slider__first-handle');
    dom.second = dom.sliderHandle.cloneNode();
    dom.second.classList.add('slider__second-handle');
    dom.firstBubble = dom.bubble.cloneNode();
    dom.secondBubble = dom.bubble.cloneNode();
    dom.sliderNone = createNode('div', { class: 'slider__none' });
    delete dom.sliderHandle;
  }

  dom.container.appendChild(dom.errorCont);
  model.props.errors
    .map(err => {
      const row = createNode('div', { class: 'slider__error' });
      row.innerHTML = err;
      return row;
    })
    .forEach(elm => {
      dom.errorCont.appendChild(elm);
    });
  dom.bubble.innerHTML = min;
  const inSlider = interval
    ? [
        dom.sliderNone,
        dom.firstBubble,
        dom.secondBubble,
        dom.sliderDone,
        dom.first,
        dom.second
      ]
    : [dom.bubble, dom.sliderDone, dom.sliderHandle];
  inSlider.forEach(el => {
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

  return dom;
}

export { createSlider };
