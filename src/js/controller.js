function Controller(model, view) {
    this.model = model;
    this.view = view;

    this.clickHandler = clickHandler.bind(this);
    this.dragHandler = dragHandler.bind(this);
    this.inputHandler = inputHandler.bind(this);

    view.render(this);
}

function clickHandler(e) {    
    if(e.target.className === 'slider-head' || e.target.className === 'value-bubble') return;

    let rect = e.target.getBoundingClientRect(),
        pos = this.model.get('horizontal') ? e.clientX - rect.left : e.clientY - rect.top,
        valLen = this.model.get('max') - this.model.get('min'),
        value = Math.round(valLen*pos/this.model.get('sliderLength'));

    this.model.set('value', value);
    this.model.notifyAll();
}

function inputHandler(e) {
    this.model.set('value', e.target.value);
    this.model.notifyAll();
}

function dragHandler(e) {
    let model = this.model,
        hor = model.get('horizontal'),
        head = e.target,
        x = head.offsetLeft,
        y = head.offsetTop,
        ox = e.clientX,
        oy = e.clientY;

    function moveEl(e) {
        let pos = hor ? x + e.clientX - ox : y + e.clientY - oy,
            valLen = model.get('max') - model.get('min'),
            value = valLen*pos/model.get('sliderLength');

        model.set('value', value);
        model.notifyAll();
    }

    head.addEventListener('mousemove', moveEl);

    window.addEventListener('mouseup', function(e) {
        head.removeEventListener('mousemove', moveEl);
    });
}

export default Controller;