function handleClick(e) {
  if (
    !e.target.classList.contains('slider__slider') &&
    e.target.className !== 'slider__done' &&
    e.target.className !== 'slider__first-done' &&
    e.target.className !== 'slider__label'
  )
    return;

  const {
    firstValue,
    secondValue,
    horizontal,
    max,
    min,
    interval
  } = this.model.getState();

  const rect = e.target.getBoundingClientRect();
  const pos = horizontal ? e.clientX - rect.left : e.clientY - rect.top;
  const valLen = max - min;
  const newValue =
    e.target.className === 'slider__label'
      ? e.target.innerHTML
      : min + (valLen * pos) / this.view.helpers.sliderLength;

  if (interval) {
    if (newValue < firstValue - min + (secondValue - firstValue) / 2) {
      this.model.setState({ firstValue: newValue });
    } else {
      this.model.setState({ secondValue: newValue });
    }
  } else {
    this.model.setState({ value: newValue });
  }
}

function handleInput(e) {
  const { interval, firstValue } = this.model.getState();

  if (interval) {
    const value = firstValue + parseInt(e.target.value, 10);
    this.model.setState({ secondValue: value });
  } else {
    this.model.setState({ value: e.target.value });
  }
}

function handleDrag(e) {
  const { model } = this;
  const { sliderLength } = this.view.helpers;
  const { horizontal, interval, max, min } = model.getState();
  const handle = e.target;
  const x = handle.offsetLeft;
  const y = handle.offsetTop;
  const ox = e.clientX;
  const oy = e.clientY;

  e.preventDefault();

  function moveHandle(ev) {
    const pos = horizontal ? x + ev.clientX - ox : y + ev.clientY - oy;
    const relValue = ((max - min) * pos) / sliderLength;

    if (interval) {
      if (handle.classList.contains('slider__first-handle')) {
        model.setState({ firstValue: relValue + min });
      } else {
        model.setState({ secondValue: relValue + min });
      }
    } else {
      model.setState({ value: relValue + min });
    }
  }

  window.addEventListener('mousemove', moveHandle);

  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', moveHandle);
  });
}

export { handleClick, handleDrag, handleInput };
