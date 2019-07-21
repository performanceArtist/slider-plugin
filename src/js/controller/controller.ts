import Model from '../model/model';
import View from '../view/view';

class Controller {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.handleClick = this.handleClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    model.subscribe(view.update, 'update');
    model.subscribe(view.render, 'render');

    view.subscribe(this.handleClick, 'click');
    view.subscribe(this.handleDrag, 'mousedown');
    view.subscribe((event: MouseEvent) => event.preventDefault(), 'drag');
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // line clicks only
    if (
      !target.classList.contains('slider__slider') &&
      target.className !== 'slider__done' &&
      target.className !== 'slider__label'
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

    const rect = this.view.dom.slider.getBoundingClientRect();
    const position = horizontal
      ? event.clientX - rect.left
      : event.clientY - rect.top;
    const valLen = max - min;
    const sliderLength = this.view.getSliderLength();
    const newValue =
      target.className === 'slider__label'
        ? parseFloat(target.innerHTML)
        : min + (valLen * position) / sliderLength;

    if (interval) {
      if (Math.abs(newValue - firstValue) < Math.abs(newValue - secondValue)) {
        this.model.setState({ firstValue: newValue });
      } else {
        this.model.setState({ secondValue: newValue });
      }
    } else {
      this.model.setState({ value: newValue });
    }
  }

  handleDrag({ event, handleNum }: { event: MouseEvent; handleNum?: number }) {
    const { model } = this;
    const sliderLength = this.view.getSliderLength();
    const { horizontal, interval, max, min } = model.getState();
    const handle = event.target as HTMLElement;
    const handleX = handle.offsetLeft;
    const handleY = handle.offsetTop;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    event.preventDefault();

    function moveHandle(moveEvent: MouseEvent) {
      const position = horizontal
        ? handleX + moveEvent.clientX - mouseX
        : handleY + moveEvent.clientY - mouseY;
      const relValue = ((max - min) * position) / sliderLength;

      if (interval) {
        if (handleNum === 1) {
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
}

export default Controller;
