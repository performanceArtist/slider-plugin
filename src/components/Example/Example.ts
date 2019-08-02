import { Options } from '../../js/types';
import slider from '../../js/slider';
import Panel from '../Panel/Panel';

class Example {
  root: HTMLElement;
  slider: HTMLElement;
  panel: HTMLElement;
  jsOptions: Options;

  constructor(root: HTMLElement, options: Options = {}) {
    this.root = root;
    this.jsOptions = options;
    this.init = this.init.bind(this);

    this.init();
  }

  init() {
    this.slider = this.root.querySelector('.example__slider .slider');
    this.panel = this.root.querySelector('.example__panel .panel');
    const options = { ...$(this.slider).data(), ...this.jsOptions };

    console.log(this.slider, options);
    const methods = slider(this.slider, options);
    new Panel(this.panel, methods);
  }
}

export default Example;
