import { SliderInterface } from '../../js/types';

export default function(selector: string, slider: SliderInterface) {
  const form = document.getElementById(selector) as HTMLFormElement;
  const state = slider.getState();
  if (!form) throw new Error('Invalid selector');

  Array.prototype.forEach.call(form.elements, (input: HTMLInputElement) => {
    const defaultValue = state[input.name];
    if (defaultValue !== undefined) {
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.checked = defaultValue as boolean;
      } else {
        input.value = defaultValue.toString();
      }
    }
  });

  form.addEventListener('change', event => {
    event.preventDefault();

    const options: { [key: string]: any } = {};
    const target = event.currentTarget as HTMLFormElement;

    Array.prototype.forEach.call(target.elements, (input: HTMLInputElement) => {
      if (input.type === 'submit') return;

      const { name } = input;
      let newValue: string | boolean = input.value.trim();

      if (input.type === 'radio' || input.type === 'checkbox')
        newValue = input.checked;

      // no empty strings
      //if (newValue === '') return;

      options[name] = newValue;
    });

    slider.setState(options);
  });
}
