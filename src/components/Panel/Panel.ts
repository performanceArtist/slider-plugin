import { SliderInterface } from '../../js/types';
import { createNode } from '../../js/View/utils';

class Panel {
  root: HTMLElement;
  form: HTMLFormElement;
  slider: SliderInterface;
  inputContainer: HTMLDivElement;

  constructor(root: HTMLElement, slider: SliderInterface) {
    this.root = root;
    this.slider = slider;

    this.init = this.init.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addValueInputs = this.addValueInputs.bind(this);
    this.update = this.update.bind(this);

    this.slider.subscribe(this.update, 'update');
    this.slider.subscribe(this.update, 'render');

    this.init();
  }

  static createInput(
    attributes: { [key: string]: string } = {},
    label: string = '',
  ) {
    const container = createNode('div', { class: 'panel__input-wrapper' });
    const input = createNode('input', {
      class: 'panel__input',
      ...attributes,
    });
    const labelElement = createNode('label', { class: 'panel__label' });
    labelElement.innerText = label;

    container.appendChild(input);
    container.appendChild(labelElement);

    return container;
  }

  init() {
    this.form = this.root.querySelector('form');
    this.inputContainer = this.form.querySelector('.panel__value-inputs');

    this.form.addEventListener('change', this.handleChange);
  }

  handleChange(event: Event) {
    event.preventDefault();

    const options: { [key: string]: any } = {};
    const target = event.currentTarget as HTMLFormElement;

    [...target.elements].forEach((input: HTMLInputElement) => {
      const { name, type, value, checked } = input;
      const hasChecked = type === 'radio' || type === 'checkbox';
      if (type === 'submit') return;

      options[name] = hasChecked ? checked : value.trim();
    });

    this.slider.setState(options);
  }

  addValueInputs() {
    const {
      hasInterval,
      value,
      firstValue,
      secondValue,
    } = this.slider.getState();

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

  update() {
    const state = this.slider.getState();
    this.addValueInputs();

    [...this.form.elements].forEach((input: HTMLInputElement) => {
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
