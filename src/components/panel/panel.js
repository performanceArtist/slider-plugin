export default function(selector, slider) {
    const el = document.getElementById(selector);
    if(!el) return;

    el.addEventListener('submit', function(e) {
        e.preventDefault();

        Array.prototype.forEach.call(e.target.elements, el => {
            if(el.type === 'submit') return;

            let name = el.name,
                val = el.value.trim();

            if(el.type === 'radio' || el.type === 'checkbox') val = el.checked;

            //no empty strings
            if(val === '') return;

            slider.model.set(name, val);
        });

        slider.view.render(slider.controller);
    });
}