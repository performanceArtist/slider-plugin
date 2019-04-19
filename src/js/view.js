function View(model) {
    this.model = model;
    this.root = document.querySelector(model.get('selector'));
    if(!this.root) throw new Error(`Invalid selector (${model.get('selector')}): element not found.`)
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
    render: function(controller) {
        let isHorizontal = this.model.get('horizontal'),
            newClass = isHorizontal ? 'slider-hor' : 'slider-ver',
            bubbleStyle = this.model.get('showBubble') ? 'display:absolute;' : 'display:none;',
            max = this.model.get('max'),
            min = this.model.get('min');

        let dom = {
            cont: create('div', {class:'slider-cont'}),
            input: create('input', {type:'text'}),
            slider: create('div', {class:`slider ${newClass}`}),
            bubble: create('div', {
                class:'value-bubble', 
                style: bubbleStyle
            }),
            sliderDone: create('div', {class:'slider-done'}),
            sliderHead: create('span', {class:'slider-head'})
        }

        dom.cont.appendChild(dom.input);
        dom.cont.appendChild(dom.slider);
        dom.bubble.innerHTML = min;
        [dom.bubble, dom.sliderDone, dom.sliderHead].forEach(el => {
            dom.slider.appendChild(el);
        });

        if(this.model.get('showSteps')) {
            let step = this.model.get('step');

            for(let i=0; i<=max-min; i+=step) {
                let perc = 100*i/(max-min),
                    label = create('label', {style: isHorizontal ? `left:${perc}%` : `top:${perc}%`});
                label.innerHTML = i + min; //).toFixed(2)
                dom.slider.appendChild(label);
            }
        }

        this.root.innerHTML = '';
        this.root.appendChild(dom.cont);
        
        dom.slider.addEventListener('click', controller.clickHandler);
        dom.sliderHead.addEventListener('mousedown', controller.dragHandler);
        dom.input.addEventListener('input', controller.inputHandler);

        let len = isHorizontal ? dom.slider.offsetWidth : dom.slider.offsetHeight;
        this.model.set('sliderLength', len);

        this.dom = dom;
    },
    update: function() {
        let pos = this.model.get('pos'),
            value = this.model.get('value'),
            isHorizontal = this.model.get('horizontal');

        if(isHorizontal) {
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