import Observable from './Observable';

describe('Observable', () => {
  const observable = new Observable();
  const callback = jest.fn();
  observable.subscribe(callback, 'test');

  describe('subscribe/notify', () => {
    it('Adds new callback to observers object, calls in on notify', () => {
      observable.notify('test', 'data');
      expect(callback).toBeCalledWith('data');
    });
  });

  describe('unsubscribe', () => {
    const anotherCallback = jest.fn();

    it('Removes callback from subscribers', () => {
      observable.subscribe(anotherCallback, 'test');
      observable.unsubscribe(anotherCallback, 'test');
      observable.notify('test');
      expect(anotherCallback).not.toHaveBeenCalled();
    });
  });
});
