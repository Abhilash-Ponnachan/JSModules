// ES6 module syntax

// import default member from calc
import calc_rms from './calc';
// import with alais from calc
//import {display_value as display} from './display';
// NOTE: the above does not work with Node V 8.10 as of now
// fallback
import display_value from './display';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const rms = calc_rms(numbers);
// NOTE: we are using the single exported function 

display_value(rms);
// NOTE: we are using the binding alais
