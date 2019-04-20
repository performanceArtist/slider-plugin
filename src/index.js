import './main.scss';

import Model from './js/model';
import View from './js/view';
import Controller from './js/controller';

import panel from './components/panel/panel';

function initPlugin(selector, opt={}) {
    let model = new Model(selector, opt),
        view = new View(model),
        controller = new Controller(model, view);

    return {model, view, controller};
}

window.onload = function() {
    let example1 = initPlugin('#example1'),
        example2 = initPlugin('#example2', {
            step:20, 
            showBubble:false, 
            showSteps: true
        }),
        example3 = initPlugin('#example3', {
            horizontal: false,
            min: 40,
            max: 80
        }),
        configExample = initPlugin('#config-example');

    panel('panel', configExample);
}