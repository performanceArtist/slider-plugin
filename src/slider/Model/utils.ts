export const debounce = (callback: Function, delay: number) => {
  let inDebounce: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => callback.apply(null, args), delay);
  };
};
