import { Options } from '../../js/types';
import slider from '../../js/slider';
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

    const allOptions = { ...$(this.slider).data(), ...options };
    const methods = slider(this.slider, allOptions);

    new Panel(this.panel, methods);
  }
}

export default Example;
