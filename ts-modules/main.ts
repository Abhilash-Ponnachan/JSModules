// TS module syntax

// import default member from calc
import calc_rms from './calc';
// import with alais from display
import {display_value as display} from './display';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const rms = calc_rms(numbers);
// NOTE: we are using the single exported function 

display(rms.toString());
// NOTE: we are using the binding alais
