function handleClick(event) {
  if (
    !event.target.classList.contains('slider__slider') &&
    event.target.className !== 'slider__done' &&
    event.target.className !== 'slider__first-done' &&
    event.target.className !== 'slider__label'
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

  const rect = event.target.getBoundingClientRect();
  const position = horizontal
    ? event.clientX - rect.left
    : event.clientY - rect.top;
  const valLen = max - min;
  const newValue =
    event.target.className === 'slider__label'
      ? event.target.innerHTML
      : min + (valLen * position) / this.view.helpers.sliderLength;

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

function handleInput(event) {
  const { interval, firstValue } = this.model.getState();

  if (interval) {
    const value = firstValue + parseInt(event.target.value, 10);
    this.model.setState({ secondValue: value });
  } else {
    this.model.setState({ value: event.target.value });
  }
}

function handleDrag(event) {
  const { model } = this;
  const { sliderLength } = this.view.helpers;
  const { horizontal, interval, max, min } = model.getState();
  const handle = event.target;
  const handleX = handle.offsetLeft;
  const handleY = handle.offsetTop;
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  event.preventDefault();

  function moveHandle(moveEvent) {
    const position = horizontal
      ? handleX + moveEvent.clientX - mouseX
      : handleY + moveEvent.clientY - mouseY;
    const relValue = ((max - min) * position) / sliderLength;

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
