function Controller(model, view) {
    this.model = model;
    this.view = view;

    this.handleClick = handleClick.bind(this);
    this.handleDrag = handleDrag.bind(this);
    this.handleInput = handleInput.bind(this);

    view.render(this);
}

function handleClick(e) {    
    if(e.target.className === 'slider__head' || e.target.className === 'value-bubble') return;

    let rect = e.target.getBoundingClientRect(),
        pos = this.model.get('horizontal') ? e.clientX - rect.left : e.clientY - rect.top,
        valLen = this.model.get('max') - this.model.get('min'),
        relValue = valLen*pos/this.model.get('sliderLength');

    this.model.set('value', relValue + this.model.get('min'));
    this.model.notifyAll();
}

function handleInput(e) {
    this.model.set('value', e.target.value);
    this.model.notifyAll();
}

function handleDrag(e) {
    let model = this.model,
        hor = model.get('horizontal'),
        handle = e.target,
        x = handle.offsetLeft,
        y = handle.offsetTop,
        ox = e.clientX,
        oy = e.clientY;

    function moveEl(e) {
        let pos = hor ? x + e.clientX - ox : y + e.clientY - oy,
            valLen = model.get('max') - model.get('min'),
            relValue = valLen*pos/model.get('sliderLength');

        model.set('value', relValue + model.get('min'));
        model.notifyAll();
    }

    handle.addEventListener('mousemove', moveEl);

    window.addEventListener('mouseup', function(e) {
        handle.removeEventListener('mousemove', moveEl);
    });
}

export default Controller;