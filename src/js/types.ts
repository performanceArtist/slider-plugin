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
  [key: string]: string | boolean | number;
}

export interface ModelType {
  state: Options;
  meta: { errors: Array<string> };
}

export type SliderDOM = Record<string, HTMLElement>;

export type SliderInterface = {
  getState: () => Options;
  setState: (options: Options) => void;
  subscribe: (callback: Function, type: string) => void;
  unsubscribe: (callback: Function, type: string) => void;
};
