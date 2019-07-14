export interface Options {
  value?: number;
  firstValue?: number;
  secondValue?: number;
  min?: number;
  max?: number;
  step?: number;
  interval?: boolean;
  showBubble?: boolean;
  showSteps?: boolean;
  horizontal?: boolean;
}

export interface Observer {
  update?: Function;
  render?: Function;
}

export interface ModelType {
  state: Options;
  props: { errors: Array<string> };
  observers: Array<Observer>;
}
