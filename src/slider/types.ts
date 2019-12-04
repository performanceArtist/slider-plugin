export interface SliderOptions {
  value: number;
  firstValue: number;
  secondValue: number;
  min: number;
  max: number;
  step: number;
  hasInterval: boolean;
  showBubble: boolean;
  showSteps: boolean;
  isHorizontal: boolean;
}

export interface ModelType {
  state: SliderOptions;
  meta: { errors: Array<string> };
}

export type SliderDOM = Record<string, HTMLElement>;

export type SliderInterface = {
  getState: () => SliderOptions;
  setState: (options: Partial<SliderOptions>) => void;
  subscribeToUpdates: (callback: Function) => void;
};
