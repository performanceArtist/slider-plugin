import './js/slider';

import Example from './components/Example/Example';

window.onload = function windowHasLoaded() {
  document
    .querySelectorAll('.example')
    .forEach((example: HTMLElement) => new Example(example));
};

function importAll(resolve: any) {
  resolve.keys().forEach(resolve);
}

importAll(require.context('./', true, /\.(css|scss)$/));
