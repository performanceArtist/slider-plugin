export interface Options {
  value?: number;
  firstValue?: number;
  secondValue?: number;
  min?: number;
  max?: number;
  step?: number;
  hasInterval?: boolean;
  showBubble?: boolean;
  showSteps?: boolean;
  isHorizontal?: boolean;
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
  subscribeToUpdates: (callback: Function) => void;
};
