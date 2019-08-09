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
    this.slider = this.root.querySelector('.example__slider .slider');
    this.panel = this.root.querySelector('.example__panel .panel');

    const methods = $(this.slider).slider(options)[0];
    new Panel(this.panel, methods);
  }
}

export default Example;
