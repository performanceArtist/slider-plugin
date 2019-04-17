function Event(sender) {
    this.sender = sender;
    this.listeners = [];
}

Event.prototype = {
    attach: function (listener) {
        this.listeners.push(listener);
    },

    notify: function (args) {
        this.listeners.map(f => f(this.sender, args));

        /*
        for (var i = 0; i < this._listeners.length; i += 1) {
            this._listeners[i](this._sender, args);
        }*/
    }

};

export default Event;