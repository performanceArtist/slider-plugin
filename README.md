# Slider plugin

## Usage

### Project Setup

Run the following commands:

To clone the repository

```
git clone https://github.com/performanceArtist/slider.git
```

To install dependencies

```
npm install
```

To start the development server on port 5000(can be set in webpack.config)

```shell
npm start
```

Development build

```shell
npm run dev
```

Production build

```
npm run build
```

Eslint(airbnb)

```
npx eslint src
```

Run tests, generate html report(Jest):

```
npm test
```

### Initializing

```js
//default
init('#slider');

//custom options
init('#slider', {
    max: 20,
    step: 5
});

//throws an error
init('does-not-exist');
```

Default options(can be overriden during initialization or changed with `setState` method after object has been created):

```js
const def = {
    value: 0,
    firstValue: 0,
    secondValue: 0,
    min: 0,
    max: 100,
    step: 1,
    interval: false,
    showBubble: true,
    showSteps: false,
    horizontal: true
}
```

### Getting/setting model values

You can only set values from the options above:

```js
const slider = init('#slider');

slider.setState({ value: 10 });

// getState returns state object copy
const { value } = slider.getState();

// displays an error due to the model's validation/type checking
slider.setState({ value: 'NaN' });

// causes rerender, since not only the value is updated
slider.setState({value:5, horizontal:false});
```

## Architecture

### UML

![UML diagram](diagram.png)

### Model

The main concern of the model is to store values which represent slider's state. It also has some validation logic. For instance, if you try setting `max` to a random string or to a value less than `min`, the action will fail. You'll get an error message in console instead. 

Here are the value constraints:

* `value`, `firstValue`, `secondValue`, `min`, `max` and `step` should be numbers.
* `interval`, `showBubble`, `showStep` and `horizontal` should be booleans.
* `value`, `firstValue` or `secondValue` should be a number lying between `min` and `max`. If it goes out of bounds, it'll be rounded to `min` or `max` respectively. Otherwise it's rounded to the nearest value divisible by `step`.
* If `interval` is set, `value` should a positive number less than `max`. It also has to be divisible by step.
* `firstValue` should be less than `secondValue`
* `secondValue` should be more than `firstValue`
* `min` should be less than `max`.
* `max` should be more than `min`.
* `step` should be positive, `min` and `max` difference should be divisible by it.

### View

View's sole responsibility is DOM manipulation. It has two methods - `render` and `update`. `render` method creates creates new , while `update` only changes handle(s) position(s). The constructor has one parameter - model. Upon object creation, view:

* Tries to set its root element with the model's selector(throws error on failure).
* Adds itself to the model's observers.

### Controller

Controller is used to implement event handling logic. Its constructor has two parameters - model and view. It calls view's `render` method, providing reference to itself as an argument. `render` adds browser events to the controller's handlers, which include:

* `handleClick` is bound to the slider's status bar. It calculates value relative to the bar's width, calls model's `setState` method, which in turn decides whether to call `render` or `update` method. In this case since only `value` is updated, there is no need to rerender.
* `handleInput` takes input element value on blur event, sets it and notifies view.
* `handleDrag` is called on mousedown event on the slider's handle. While mouse key is pressed, it updates the slider's and model's values accordingly.