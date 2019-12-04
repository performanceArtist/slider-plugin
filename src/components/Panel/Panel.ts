import { createNode } from '../../slider/Views/utils';
import { SliderOptions } from '../../slider/types';

class Panel {
  root: HTMLElement;
  form: HTMLFormElement;
  $slider: JQuery<Element>;
  inputContainer: HTMLDivElement;

  constructor(root: HTMLElement, $slider: JQuery<Element>) {
    this.root = root;
    this.$slider = $slider;

    this.handleChange = this.handleChange.bind(this);
    this.addValueInputs = this.addValueInputs.bind(this);
    this.update = this.update.bind(this);

    this.init();
  }

  init() {
    this.$slider.slider('subscribeToUpdates', this.update);
    const form = this.root.querySelector('form');
    if (!form) return console.log('No form found');
    const inputContainer = form.querySelector('.panel__value-inputs');
    if (!inputContainer) return console.log('No inputs found');

    this.form = form;
    this.inputContainer = inputContainer as HTMLDivElement;

    this.form.addEventListener('change', this.handleChange);
  }

  static createInput(
    attributes: { [key: string]: string } = {},
    label: string = '',
  ) {
    const wrapper = createNode('div', { class: 'panel__input' });
    const container = createNode('div', { class: 'input__wrapper' });
    const input = createNode('input', {
      class: 'input__input',
      ...attributes,
    });
    const labelElement = createNode('label', { class: 'input__label' });
    labelElement.innerText = label;

    container.appendChild(input);
    container.appendChild(labelElement);
    wrapper.appendChild(container);
    return wrapper;
  }

  handleChange(event: Event) {
    event.preventDefault();

    const options: { [key: string]: any } = {};
    const target = event.currentTarget as HTMLFormElement;

    [...target.elements].forEach((input) => {
      const { name, type, value, checked } = input as HTMLInputElement;
      const hasChecked = type === 'radio' || type === 'checkbox';
      if (type === 'submit') return;

      options[name] = hasChecked ? checked : value.trim();
    });

    this.$slider.slider('setState', options);
  }

  addValueInputs() {
    const states = this.$slider.slider('getState') as JQuery<SliderOptions>;

    const { hasInterval, value, firstValue, secondValue } = states[0];

    if (hasInterval) {
      const firstInput = Panel.createInput(
        {
          name: 'firstValue',
          type: 'number',
          value: firstValue.toString(),
        },
        'First value',
      );
      const secondInput = Panel.createInput(
        {
          name: 'secondValue',
          type: 'number',
          value: secondValue.toString(),
        },
        'Second value',
      );
      this.inputContainer.innerHTML = '';
      this.inputContainer.appendChild(firstInput);
      this.inputContainer.appendChild(secondInput);
    } else {
      const input = Panel.createInput(
        {
          name: 'value',
          type: 'number',
          value: value.toString(),
        },
        'Value',
      );
      this.inputContainer.innerHTML = '';
      this.inputContainer.appendChild(input);
    }
  }

  update(state: SliderOptions) {
    this.addValueInputs();

    [...this.form.elements].forEach((element) => {
      const input = element as HTMLInputElement;
      const { name, type } = input;
      const defaultValue = state[name];
      const hasChecked = type === 'radio' || type === 'checkbox';

      if (defaultValue === undefined) return;

      if (hasChecked) {
        input.checked = defaultValue as boolean;
      } else {
        input.value = defaultValue.toString();
      }
    });
  }
}

export default Panel;
