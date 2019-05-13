import { handleClick, handleDrag, handleInput } from './utils';

function Controller(model, view) {
  this.model = model;
  this.view = view;

  this.handleClick = handleClick.bind(this);
  this.handleDrag = handleDrag.bind(this);
  this.handleInput = handleInput.bind(this);

  view.init(this);
}

export default Controller;
