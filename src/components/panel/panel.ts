export default function(selector: string, slider) {
  const element = document.getElementById(selector);
  if (!element) return;

  element.addEventListener('change', event => {
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
      if (newValue === '') return;

      options[name] = newValue;
    });

    slider.setState(options);
  });
}
