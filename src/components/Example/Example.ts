import { Options } from '../../js/types';
import '../../js/slider';
import Panel from '../Panel/Panel';

class Example {
  root: HTMLElement;
  slider: HTMLElement;
  panel: HTMLElement;

  constructor(root: HTMLElement, options: Options = {}) {
    this.root = root;
    this.init = this.init.bind(this);

    this.init(options);
  }

  init(options: Options) {
    this.slider = this.root.querySelector('.js-example__slider .slider');
    this.panel = this.root.querySelector('.js-example__panel .panel');
    const $slider = $(this.slider).slider(options);
    new Panel(this.panel, $slider);
  }
}

export default Example;
