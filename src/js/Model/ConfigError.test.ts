import ConfigError, { ErrorType } from './ConfigError';

describe('ConfigError', () => {
  const error = new ConfigError(ErrorType.BOOL, 'value');

  describe('getMessage', () => {
    it('Returns "friendly" message, containing the key whose value setting has failed', () => {
      expect(typeof error.getMessage()).toBe('string');
      expect(error.getMessage().includes('value')).toBe(true);
    });
  });

  describe('getType', () => {
    it('Returns error type', () => {
      expect(error.getType()).toBe(ErrorType.BOOL);
    });
  });

  describe('show', () => {
    global.console.log = jest.fn();

    it('Prints the error message to console.log', () => {
      error.show();
      expect(global.console.log).toBeCalledWith(error.getMessage());
    });
  });
});
