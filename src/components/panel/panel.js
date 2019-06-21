export default function(selector, slider) {
  const element = document.getElementById(selector);
  if (!element) return;

  element.addEventListener('change', event => {
    event.preventDefault();

    const options = {};

    Array.prototype.forEach.call(event.currentTarget.elements, input => {
      if (input.type === 'submit') return;

      const { name } = input;
      let newValue = input.value.trim();

      if (input.type === 'radio' || input.type === 'checkbox')
        newValue = input.checked;

      // no empty strings
      if (newValue === '') return;

      options[name] = newValue;
    });

    slider.setState(options);
  });
}
