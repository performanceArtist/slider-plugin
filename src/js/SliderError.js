class SliderError extends Error {
  constructor(message, type = 'Unknown') {
    super(message);
    this.type = type;
  }

  getMessage() {
    return `${this.message} (${this.type})`;
  }

  show() {
    console.error(this);
    // 'Friendly' message
    console.log(this.getMessage());
  }
}

export default SliderError;
