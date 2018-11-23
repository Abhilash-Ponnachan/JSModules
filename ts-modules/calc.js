"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import default-export from 'math'
var math_1 = require("./math");
// Note exported name was 'FuncMath'
// default export function
/*
NOTE: here we are just using a function without class,
though we are using types for the param & return.
*/
function calc_rms(numbers) {
    // access methods via the imoported class 'Maths'
    var r = math_1.default.reduce(math_1.default.map(numbers, function (x) {
        return x * x;
    }), function (x, y) {
        return x + y;
    }, 0);
    return math_1.default.sqrt(r);
}
exports.default = calc_rms;
;
//# sourceMappingURL=calc.js.map