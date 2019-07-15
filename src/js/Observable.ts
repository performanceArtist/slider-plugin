class Observable {
  private _observers: { [key: string]: Array<Function> };

  constructor() {
    this._observers = {};

    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.notify = this.notify.bind(this);
  }

  subscribe(callback: Function, type: string) {
    if (this._observers[type] instanceof Array) {
      this._observers[type].push(callback);
    } else {
      this._observers[type] = [callback];
    }
  }

  unsubscribe(callback: Function, type: string) {
    this._observers[type] = this._observers[type].filter(
      observer => observer === callback
    );
  }

  notify(type: string, data?: any) {
    this._observers[type].forEach(observer => observer(data));
  }
}

export default Observable;
