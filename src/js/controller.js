function handleClick(e) {
  if (e.target.className === 'slider__head' || e.target.className === 'value-bubble') return;

  const rect = e.target.getBoundingClientRect();
  const pos = this.model.get('horizontal') ? e.clientX - rect.left : e.clientY - rect.top;
  const valLen = this.model.get('max') - this.model.get('min');
  const relValue = valLen * pos / this.model.get('sliderLength');

  this.model.set('value', relValue + this.model.get('min'));
  this.model.notifyAll();
}

function handleInput(e) {
  this.model.set('value', e.target.value);
  this.model.notifyAll();
}

function handleDrag(e) {
  const { model } = this;
  const hor = model.get('horizontal');
  const handle = e.target;
  const x = handle.offsetLeft;
  const y = handle.offsetTop;
  const ox = e.clientX;
  const oy = e.clientY;

  function moveEl(ev) {
    const pos = hor ? x + ev.clientX - ox : y + ev.clientY - oy;
    const valLen = model.get('max') - model.get('min');
    const relValue = valLen * pos / model.get('sliderLength');

    model.set('value', relValue + model.get('min'));
    model.notifyAll();
  }

  handle.addEventListener('mousemove', moveEl);

  window.addEventListener('mouseup', () => {
    handle.removeEventListener('mousemove', moveEl);
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
