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

Run tests(Jest):

```
npm test
```

### Initializing

```js
//initPlugin(<selector>, {<options>});
//returns {model, view, controller} object

//default
initPlugin('#slider');

//custom options
initPlugin('#slider', {
    max: 20,
    step: 5
});

//throws an error
initPlugin('does-not-exist');
```

Default options(can be overriden during initialization or changed with `model.setState` method after object has been created):

```js
const def = {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    showBubble: true,
    showSteps: false,
    horizontal: true
}
```

### Getting/setting model values

You can only set values from the options above:

```js
const slider = initPlugin('#slider');

slider.model.setState({ value: 10 });
let { value } = slider.model.getState();

//displays an error due to the model's validation/type checking
slider.model.set({ value: 'NaN' });
```

## Architecture

### UML

![UML diagram](diagram.png)

### Model

The main concern of the model is to store values which represent slider's state. It also has some validation logic. For instance, if you try setting `max` to a random string, the action will fail. You'll get an error message in console instead. 

Here are the value constraints:

* `value`, `min`, `max` and `step` should be numbers.
* `showBubble`, `showStep` and `horizontal` should be booleans.
* `value` should be a number lying between `min` and `max`. If it goes out of bounds, it'll be rounded to `min` or `max` respectively. Otherwise it is rounded to the nearest value divisible by `step`.
* `min` should be less than `max`.
* `max` should be more than `min`.
* `step` should be positive, `min` and `max` difference should be divisible by it.

Model also has methods for adding and notifying observers(views). `addObserver` simply adds an object reference to an array, `notify` calls each view's `update` or `rerender` method. Although here there is no need to have multiple views, this can still come in handy for some new features.

### View

View's sole responsibility is DOM manipulation. It has three methods - `render`, `rerender` and `update`. The constructor has one parameter - model. Upon object creation, view:

* Tries to set its root element with the model's selector(throws error on failure).
* Adds itself to the model's observers.
* Sets rerender function(gets the controller object in closure)

### Controller

Controller is used to implement event handling logic. Its constructor has two parameters - model and view. It calls view's `render` method, providing reference to controller as an argument. `render` adds browser events to controller's handlers, which include:

* `handleClick` is bound to the slider's status bar. It calculates value relative to the bar's width, calls model's `setState` and `notify` methods(all handlers do this, since the model's `value` is updated).
* `handleInput` takes input element value on blur event, sets it and notifies view.
* `handleDrag` is called on mousedown event on the slider's handle. While mouse key is pressed, it updates the slider's and model's values accordingly.