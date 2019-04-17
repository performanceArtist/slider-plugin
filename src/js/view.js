function View(model) {
    this.model = model;
    this.root = document.querySelector(model.get('selector'));
    model.addObserver(this);
}

//helper to create nodes
function create(type, attr={}) {
    let node = document.createElement(type);
    for (let i in attr) {
        node.setAttribute(i, attr[i]);
    }
    return node;
}

View.prototype = {
    init: function(controller) {
        let dom = {
            cont: create('div', {class:this.model.get('preset')}),
            input: create('input', {type:'text'}),
            slider: create('div', {class:`slider ${this.model.get('modifier')}`}),
            bubble: create('div', {
                class:'value-bubble', 
                style: this.model.get('showBubble') ? 'display:absolute;' : 'display:none;'
            }),
            sliderDone: create('div', {class:'slider-done'}),
            sliderHead: create('span', {class:'slider-head'})
        }

        dom.cont.appendChild(dom.input);
        dom.cont.appendChild(dom.slider);
        [dom.bubble, dom.sliderDone, dom.sliderHead].forEach(el => {
            dom.slider.appendChild(el);
        });

        if(this.model.get('showSteps')) {
            let step = this.model.get('step'),
                max = this.model.get('max');

            for(let i=0; i<=max; i+=step) {
                let hor = this.model.get('modifier') === 'slider-hor',
                    perc = Math.round(100*i/max),
                    label = create('label', {style: hor ? `left:${perc}%` : `top:${perc}%`});
                label.innerHTML = i;
                dom.slider.appendChild(label);
            }
        }

        this.root.appendChild(dom.cont);
        
        dom.slider.addEventListener('click', controller.clickHandler);
        dom.input.addEventListener('input', controller.handleInput);

        let len = this.model.get('modifier') === 'slider-hor' ? dom.slider.offsetWidth : dom.slider.offsetHeight;
        this.model.set('sliderLength', len);
        this.dom = dom;
    },
    update: function() {
        let pos = this.model.get('pos'),
            value = this.model.get('value'),
            hor = this.model.get('modifier') === 'slider-hor';

        if(hor) {
            this.dom.sliderHead.style.left = pos + 'px';
            this.dom.sliderDone.style.width = pos + 5 + 'px';
            this.dom.bubble.style.left = pos - 4 + 'px';
        } else {
            this.dom.sliderHead.style.top = pos + 'px';
            this.dom.sliderDone.style.height = pos + 5 + 'px';
            this.dom.bubble.style.top = pos - 4 + 'px';
        }

        this.dom.bubble.innerHTML = value;
        this.dom.input.value = value;
    }
}

export default View;