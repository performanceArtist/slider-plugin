import Handle from './Handle';

describe('Handle view', () => {
  const handle = new Handle({
    position: 0,
    isHorizontal: true,
    showBubble: true,
  });

  describe('constructor', () => {
    it('Creates handle element', () => {
      expect(handle.handle).toBeInstanceOf(HTMLElement);
    });

    it('Adds value bubble if showBubble is true', () => {
      expect(handle.bubble).toBeInstanceOf(HTMLElement);
    });
  });

  describe('getElements', () => {
    it('Returns html fragment with handle elements', () => {
      expect(handle.getElements()).toBeInstanceOf(DocumentFragment);
    });
  });

  describe('setPosition', () => {
    it('Sets handle position and bubble value', () => {
      handle.setPosition(20, 100);
      expect(parseInt(handle.handle.style.left, 0)).toBeGreaterThan(0);
    });
  });
});
