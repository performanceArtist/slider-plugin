import { SliderInterface } from '../../js/types';
import { createNode } from '../../js/View/utils';

function createPanelInput(
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

class Panel {
  form: HTMLFormElement;
  slider: SliderInterface;
  inputContainer: HTMLDivElement;

  constructor(selector: string, slider: SliderInterface) {
    const container = document.querySelector(selector) as HTMLElement;
    const form = container.querySelector('form');
    if (!form || !container) throw new Error('Invalid element');

    this.form = form;
    this.inputContainer = form.querySelector('.panel__value-inputs');
    this.slider = slider;

    this.init = this.init.bind(this);
    this.update = this.update.bind(this);

    this.slider.subscribe(this.update, 'update');
    this.slider.subscribe(this.update, 'render');
    this.init();
  }

  init() {
    this.form.addEventListener('change', event => {
      event.preventDefault();

      const options: { [key: string]: any } = {};
      const target = event.currentTarget as HTMLFormElement;

      Array.prototype.forEach.call(
        target.elements,
        (input: HTMLInputElement) => {
          const { name, type, value, checked } = input;
          if (type === 'submit') return;

          let newValue: string | boolean = value.trim();

          if (type === 'radio' || type === 'checkbox') newValue = checked;

          options[name] = newValue;
        },
      );

      this.slider.setState(options);
    });
  }

  update() {
    const state = this.slider.getState();
    const { interval, value, firstValue, secondValue } = state;

    if (interval) {
      const firstInput = createPanelInput(
        {
          name: 'firstValue',
          type: 'number',
          value: firstValue.toString(),
        },
        'First value',
      );
      const secondInput = createPanelInput(
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
      const input = createPanelInput(
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

    Array.prototype.forEach.call(
      this.form.elements,
      (input: HTMLInputElement) => {
        const defaultValue = state[input.name];
        if (defaultValue !== undefined) {
          if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = defaultValue as boolean;
          } else {
            input.value = defaultValue.toString();
          }
        }
      },
    );
  }
}

export default Panel;
