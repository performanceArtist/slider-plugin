export default function(selector, slider) {
    const el = document.getElementById(selector);
    if(!el) return;

    el.addEventListener('submit', function(e) {
        e.preventDefault();

        Array.prototype.forEach.call(e.target.elements, el => {
            if(el.type === 'submit') return;

            let name = el.name,
                val = el.value;

            if(el.type === 'radio' || el.type === 'checkbox') val = el.checked;

            slider.model.set(name, val);
        });

        slider.view.init(slider.controller);
    });
}