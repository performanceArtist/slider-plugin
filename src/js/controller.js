function Controller(model, view) {
    this.model = model;
    this.view = view;

    this.clickHandler = function(e) {
        var rect = e.target.getBoundingClientRect(),
            hor = model.get('modifier') === 'slider-hor',
            pos = hor ? e.clientX - rect.left : e.clientY - rect.top,
            value = Math.round(model.get('max')*pos/model.get('sliderLength'));

        model.set('value', value);
        model.notifyAll();
    }

    this.handleInput = function(e) {
        model.set('value', e.target.value);
        model.notifyAll();
    }

    view.init(this);
}

export default Controller;