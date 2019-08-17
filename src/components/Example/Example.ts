import { Options } from '../../js/types';
import '../../js/slider';
import Panel from '../Panel/Panel';

class Example {
  root: HTMLElement;
  $slider: JQuery<Element>;
  panel: Panel;

  constructor(root: HTMLElement, options: Options = {}) {
    this.root = root;
    this.init = this.init.bind(this);

    this.init(options);
  }

  init(options: Options) {
    const slider = this.root.querySelector('.js-example__slider .slider');
    const panel = this.root.querySelector('.js-example__panel .panel');

    this.$slider = $(slider).slider(options) as JQuery<Element>;
    this.panel = new Panel(panel as HTMLElement, this.$slider);
  }
}

export default Example;
