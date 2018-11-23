"use strict";
// ES6 module syntax
Object.defineProperty(exports, "__esModule", { value: true });
// import default member from calc
var calc_1 = require("./calc");
// import with alais from display
var display_1 = require("./display");
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var rms = calc_1.default(numbers);
// NOTE: we are using the single exported function 
display_1.display_value(rms.toString());
// NOTE: we are using the binding alais
//# sourceMappingURL=main.js.map