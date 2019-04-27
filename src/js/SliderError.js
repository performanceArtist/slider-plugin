class SliderError extends Error {
    constructor(message, type='Unknown') {
        super(message);
        this.type = type;
    }

    show() {
        //console.error(this);
        //'Friendly' message
        console.log(this.message, `(${this.type})`);
    }
}

export default SliderError;