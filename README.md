# Slider plugin

## Project Setup

Run the following commands:

To clone the repository:

```
git clone https://github.com/performanceArtist/slider.git
```

To install dependencies:

```
npm install
```

To start the development server on port 5000(can be set in webpack.config):

```shell
npm start
```

Development build:

```shell
npm run dev
```

Production build:

```
npm run build
```

## Usage

### Initialization

```ts
// default
$('.slider').slider();

// custom options
$('.slider').slider({hasInterval: true, max: 20, step: 5});
```

### Default options

```ts
interface Options {
  value?: number;
  firstValue?: number;
  secondValue?: number;
  min?: number;
  max?: number;
  step?: number;
  hasInterval?: boolean;
  isHorizontal?: boolean;
  showBubble?: boolean;
  showSteps?: boolean;
  [key: string]: boolean | number;
}

const defaults: Options = {
    value: 0,
    firstValue: 0,
    secondValue: 0,
    min: 0,
    max: 100,
    step: 1,
    hasInterval: false,
    isHorizontal: true
    showBubble: true,
    showSteps: false
}
```

### Getting/setting values

```ts
$('.slider').slider('setState', { max: 10 });

// dispays an error in console for undefined options
$('.slider').slider('setState', { unknown: 5 });

// displays an error due to the model's validation/type checking
$('.slider').slider('setState', { value: 'Nan' });

// getState returns JQuery array object
const states = $('.slider').slider('getState') as JQuery<Options>;
const firstState = states[0];
```

### Subscribing to updates

Plugin has a method to keep track of slider updates. It invokes its callback argument every time the state changes, passing a new state. This function can be utilized to manage dependent components, like configuration panel on example page or value inputs. 

```ts
const callback = (state: Options) => {
  console.log('New state', state);
};

$('.slider').slider('subscribeToUpdates', callback);
```

## Architecture

### Model

The main concern of the model is to store values which represent slider's state. It also has some validation logic. For instance, if you try setting `max` to a random string or to a number less than `min`, the action will fail. You'll get an error message in console instead. 

Here are the value constraints:

* `value`, `firstValue`, `secondValue`, `min`, `max` and `step` should be numbers.
* `hasInterval`, `showBubble`, `showStep` and `isHorizontal` should be booleans.
* `value`, `firstValue` or `secondValue` should be a number lying between `min` and `max`. If it goes out of bounds, it'll be rounded to `min` or `max` respectively. Otherwise it's rounded to the nearest value divisible by `step`.
* `firstValue` should be less than `secondValue`.
* `secondValue` should be more than `firstValue`.
* `min` should be less than `max`.
* `max` should be more than `min`.
* `step` should be positive, `min` and `max` difference should be divisible by it.

### View

View layer's sole responsibility is DOM manipulation. It consists of three parts: Main, Handle and Slider. Main view manages both Handle and Slider views by subscribing to their change events and notifying the controller. The controller in turn calls model's setState method, which notifies Main view's `render` and `update`. Update methods such as `udpate` and `updateInterval` are used to perform 'light' updates, such as value change on handle drag, while `render` creates a new slider from scratch.  

### Controller

Controls the flow of model's and view's events. Upon creation it subscribes to view and model notifications, binding them to their methods. It also has its own public methods: `setState` and `getState` are basically wrappers over model functionality, while `subscribeToUpdates` allows user to keep track of any state changes, abstracting away their cause, arguments and actual event names. 

### UML(needs update)

![UML diagram](diagram.png)