import { Options, SliderDOM } from '../types';

// helper to create nodes
function createNode(type: string, attributes: { [key: string]: string } = {}) {
  const node = document.createElement(type);

  Object.keys(attributes).forEach(key => {
    node.setAttribute(key, attributes[key]);
  });

  return node;
}

// creates slider based purely on model
function createSlider(state: Options, props: any) {
  const { min, max, interval, showBubble, horizontal, showSteps, step } = state;
  const newClass = horizontal ? 'slider_hor' : 'slider_ver';
  const bubbleStyle = showBubble ? 'display:absolute;' : 'display:none;';

  const dom: SliderDOM = {
    container: createNode('div', { class: 'slider' }),
    input: createNode('input', { class: 'slider__input', type: 'text' }),
    slider: createNode('div', { class: `slider__slider ${newClass}` }),
    bubble: createNode('div', {
      class: 'slider__bubble',
      style: bubbleStyle
    }),
    selected: createNode('div', { class: 'slider__done' }),
    sliderHandle: createNode('span', { class: 'slider__head' }),
    errorCont: createNode('div', { class: 'slider__error-container' })
  };

  dom.container.appendChild(dom.input);
  dom.container.appendChild(dom.slider);
  dom.container.appendChild(dom.errorCont);

  if (interval) {
    dom.firstHandle = dom.sliderHandle.cloneNode() as HTMLElement;
    dom.firstHandle.classList.add('slider__first-handle');
    dom.secondHandle = dom.sliderHandle.cloneNode() as HTMLElement;
    dom.secondHandle.classList.add('slider__second-handle');
    dom.firstBubble = dom.bubble.cloneNode() as HTMLElement;
    dom.secondBubble = dom.bubble.cloneNode() as HTMLElement;
    dom.firstDone = createNode('div', { class: 'slider__first-done' });
  }

  props.errors
    .map((error: string) => {
      const row = createNode('div', { class: 'slider__error' });
      row.innerHTML = error;
      return row;
    })
    .forEach((element: HTMLElement) => {
      dom.errorCont.appendChild(element);
    });
  dom.bubble.appendChild(document.createTextNode(min.toString()));

  const inSlider = interval
    ? [
        dom.firstDone,
        dom.firstBubble,
        dom.secondBubble,
        dom.selected,
        dom.firstHandle,
        dom.secondHandle
      ]
    : [dom.bubble, dom.selected, dom.sliderHandle];

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
      label.innerHTML = (i + min).toString();
      dom.slider.appendChild(label);
    }
  }

  return dom;
}

export { createSlider };
