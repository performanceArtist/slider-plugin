import { SliderOptions } from '../../slider/types';
import '../../slider';
import Panel from '../Panel/Panel';

class Example {
  $slider: JQuery<Element>;
  panel: Panel;

  constructor(public root: Element, options: Partial<SliderOptions> = {}) {
    this.init(options);
  }

  init(options: Partial<SliderOptions>) {
    const slider = this.root.querySelector('.js-example__slider .slider');
    const panel = this.root.querySelector('.js-example__panel .panel');

    if (!slider) {
      return console.log('Slider element not found');
    }

    this.$slider = $(slider).slider(options) as JQuery<Element>;
    this.panel = new Panel(panel as HTMLElement, this.$slider);
  }
}

export default Example;
