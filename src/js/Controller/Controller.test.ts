import Model from '../Model/Model';
import View from '../View/MainView';
import Controller from './Controller';
jest.mock('../Controller/Controller');

document.body.innerHTML = '<div id="test"></div>';

const root = document.querySelector('#test');
const model = new Model();
const view = new View(model, root);
const controller = new Controller(model, view);

describe('Controller', () => {
  it('Exists', () => {
    expect(true).toBe(true);
  });
});
