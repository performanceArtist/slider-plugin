export default function(selector, slider) {
  const el = document.getElementById(selector);
  if (!el) return;

  el.addEventListener('submit', e => {
    e.preventDefault();

    Array.prototype.forEach.call(e.target.elements, elm => {
      if (elm.type === 'submit') return;

      const { name } = elm;
      let val = elm.value.trim();

      if (elm.type === 'radio' || elm.type === 'checkbox') val = elm.checked;

      // no empty strings
      if (val === '') return;

      slider.set(name, val);
    });

    slider.render();
  });
}
