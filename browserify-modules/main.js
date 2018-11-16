// browserify will use the CommonJS format for module
// CommonJS will treat this file as a module

// import the calculation module
const calc_rms = require('./calc.js')
// import the display module
const display_value = require('./display.js')

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const rms = calc_rms(numbers);
// NOTE: we are using the single exported function 
const el = document.getElementById('value');
display_value(el, rms);
// NOTE: we are using the single exported function