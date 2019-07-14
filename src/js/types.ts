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
  props: { errors: Array<string> };
}

export type SliderDOM = Record<string, HTMLElement>;
