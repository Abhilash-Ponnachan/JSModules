// ES6 module syntax

// import default member from calc
import calc_rms from './calc';
// import with alias from calc
//import {display_value as display} from './display';
// NOTE: use the above if it was a named exported
// use the below one for default exported
import display from './display';
// NOTE: the identifier name of imported binding can be different

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const rms = calc_rms(numbers);
// NOTE: we are using the single exported function 

const elem = document.getElementById('value');
display(elem, rms);
// NOTE: we are using the binding alias
