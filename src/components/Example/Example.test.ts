import '../../js/slider';
import Example from './Example';
import Panel from '../Panel/Panel';

document.body.innerHTML = `
  <div id="example">
    <div class="js-example__slider">
      <div class="slider"></div>
    </div>
    <div class="js-example__panel">
      <div class="panel">
        <form>
          <div class="panel__value-inputs></div>
        </form>
      </div>
    </div>
  </div>
`;

describe('Example', () => {
  describe('init', () => {
    it('Creates Panel and slider instances', () => {
      const root = document.querySelector('#example');
      const example = new Example(root as HTMLElement);
      expect(example.panel).toBeInstanceOf(Panel);
      expect(example.$slider).toBeInstanceOf($);
    });
  });
});
