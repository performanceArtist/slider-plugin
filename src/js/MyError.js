class MyError extends Error {
    constructor(message, type='Unknown') {
        super(message);
        this.type = type;
    }

    show() {
        //show everything
        //console.log(this);
        //'Friendly' message
        console.log(this.message, `(${this.type})`);
    }
}

export default MyError;