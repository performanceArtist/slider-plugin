import './css/layout.scss';
import './css/slider.scss';

import Model from './js/model';
import View from './js/view';
import Controller from './js/controller';

function initPlugin(selector, opt={}) {
    let model = new Model(selector, opt),
        view = new View(model),
        controller = new Controller(model, view);
}

window.onload = function() {
    initPlugin('#test', {step:1});
    initPlugin('#test1', {showBubble:false, step:25, modifier:'slider-hor', showSteps:true});
}