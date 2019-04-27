function View(model) {
    this.model = model;
    this.root = document.querySelector(model.get('selector'));
    if(!this.root) throw new Error(`Invalid selector (${model.get('selector')}): element not found.`)
    model.addObserver(this);
}

//helper to create nodes
function createNode(type, attr={}) {
    let node = document.createElement(type);
    for (let i in attr) {
        node.setAttribute(i, attr[i]);
    }
    return node;
}

View.prototype = {
    render: function(controller) {
        let isHorizontal = this.model.get('horizontal'),
            newClass = isHorizontal ? 'slider_hor' : 'slider_ver',
            bubbleStyle = this.model.get('showBubble') ? 'display:absolute;' : 'display:none;',
            max = this.model.get('max'),
            min = this.model.get('min');

        let dom = {
            cont: createNode('div', {class:'slider-cont'}),
            input: createNode('input', {type:'text'}),
            slider: createNode('div', {class:`slider ${newClass}`}),
            bubble: createNode('div', {
                class:'value-bubble', 
                style: bubbleStyle
            }),
            sliderDone: createNode('div', {class:'slider__done'}),
            sliderHandle: createNode('span', {class:'slider__head'})
        }

        dom.cont.appendChild(dom.input);
        dom.cont.appendChild(dom.slider);
        dom.bubble.innerHTML = min;
        [dom.bubble, dom.sliderDone, dom.sliderHandle].forEach(el => {
            dom.slider.appendChild(el);
        });

        if(this.model.get('showSteps')) {
            let step = this.model.get('step');

            for(let i=0; i<=max-min; i+=step) {
                let perc = 100*i/(max-min),
                    label = createNode('label', {style: isHorizontal ? `left:${perc}%` : `top:${perc}%`});
                label.innerHTML = i + min; 
                dom.slider.appendChild(label);
            }
        }

        this.root.innerHTML = '';
        this.root.appendChild(dom.cont);
        
        dom.slider.addEventListener('click', controller.handleClick);
        dom.sliderHandle.addEventListener('mousedown', controller.handleDrag);
        dom.input.addEventListener('blur', controller.handleInput);

        let len = isHorizontal ? dom.slider.offsetWidth : dom.slider.offsetHeight;
        this.model.set('sliderLength', len);

        this.dom = dom;
    },
    update: function() {
        let pos = this.model.get('pos'),
            value = this.model.get('value'),
            isHorizontal = this.model.get('horizontal');

        if(isHorizontal) {
            this.dom.sliderHandle.style.left = pos + 'px';
            this.dom.sliderDone.style.width = pos + 5 + 'px';
            this.dom.bubble.style.left = pos - 4 + 'px';
        } else {
            this.dom.sliderHandle.style.top = pos + 'px';
            this.dom.sliderDone.style.height = pos + 5 + 'px';
            this.dom.bubble.style.top = pos - 4 + 'px';
        }

        this.dom.bubble.innerHTML = value;
        this.dom.input.value = value;
    }
}

export default View;