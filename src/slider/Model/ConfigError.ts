export enum ErrorType {
  NUM,
  BOOL,
  CONF,
  MAX,
  MIN,
  STEP,
}

const ErrorMessage = new Map<ErrorType, string>([
  [ErrorType.NUM, 'Expected a number'],
  [ErrorType.BOOL, 'Expected a boolean'],
  [ErrorType.CONF, 'Invalid or non-configurable key'],
  [ErrorType.MAX, 'Should be more than min'],
  [ErrorType.MIN, 'Should be less than max'],
  [ErrorType.STEP, 'Should be more than zero and less than max-min difference'],
]);

class ConfigError extends Error {
  private _type: ErrorType;
  private _message: string;

  constructor(type: ErrorType, key: string = '') {
    const message: string = `Error in ${key}: ${ErrorMessage.get(type)}`;
    super(message);

    this._type = type;
    this._message = message;
  }

  getMessage() {
    return this._message;
  }

  getType() {
    return this._type;
  }

  show() {
    console.log(this.getMessage());
  }
}

export default ConfigError;
