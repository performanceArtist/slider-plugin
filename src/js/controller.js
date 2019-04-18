function Controller(model, view) {
    this.model = model;
    this.view = view;

    this.clickHandler = function(e) {    
        if(e.target.className === 'slider-head' || e.target.className === 'value-bubble') return;

        var rect = e.target.getBoundingClientRect(),
            pos = model.get('horizontal') ? e.clientX - rect.left : e.clientY - rect.top,
            valLen = model.get('max') - model.get('min'),
            value = Math.round(valLen*pos/model.get('sliderLength'));

        model.set('value', value);
        model.notifyAll();
    }

    this.inputHandler = function(e) {
        model.set('value', e.target.value);
        model.notifyAll();
    }

    this.dragHandler = function(e) {
        let hor = model.get('horizontal'),
            head = e.target,
            x = head.offsetLeft,
            y = head.offsetTop,
            ox = e.clientX,
            oy = e.clientY;

        function moveEl(e) {
            let pos = hor ? x + e.clientX - ox : y + e.clientY - oy,
                valLen = model.get('max') - model.get('min'),
                value = Math.round(valLen*pos/model.get('sliderLength'));

            model.set('value', value);
            model.notifyAll();
        }

        head.addEventListener('mousemove', moveEl);

        window.addEventListener('mouseup', function(e) {
            head.removeEventListener('mousemove', moveEl);
        });

    }

    view.init(this);
}

export default Controller;