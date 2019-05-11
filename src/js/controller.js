function handleClick(e) {
  if (
    !e.target.classList.contains('slider__slider') &&
    e.target.className !== 'slider__done'
  )
    return;

  const { horizontal, max, min } = this.model.getState();

  const rect = e.target.getBoundingClientRect();
  const pos = horizontal ? e.clientX - rect.left : e.clientY - rect.top;
  const valLen = max - min;
  const relValue = (valLen * pos) / this.view.helpers.sliderLength;

  this.model.setState({ value: relValue + min });
}

function handleInput(e) {
  this.model.setState({ value: e.target.value });
}

function handleDrag(e) {
  const { model } = this;
  const { sliderLength } = this.view.helpers;
  const { horizontal, max, min } = model.getState();
  const handle = e.target;
  const x = handle.offsetLeft;
  const y = handle.offsetTop;
  const ox = e.clientX;
  const oy = e.clientY;

  function moveHandle(ev) {
    const pos = horizontal ? x + ev.clientX - ox : y + ev.clientY - oy;
    const relValue = ((max - min) * pos) / sliderLength;

    model.setState({ value: relValue + min });
  }

  handle.addEventListener('mousemove', moveHandle);

  window.addEventListener('mouseup', () => {
    handle.removeEventListener('mousemove', moveHandle);
  });
}

function Controller(model, view) {
  this.model = model;
  this.view = view;

  this.handleClick = handleClick.bind(this);
  this.handleDrag = handleDrag.bind(this);
  this.handleInput = handleInput.bind(this);

  view.render(this);
}

export default Controller;
