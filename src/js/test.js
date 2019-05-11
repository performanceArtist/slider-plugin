const slider = initPlugin('#slider');

slider.model.setState({ value: 10 });
let { value } = slider.model.getState();

//displays an error due to the model's validation/type checking
slider.model.set({ value: 'NaN' });
