"use strict";
// ES6 module syntax
Object.defineProperty(exports, "__esModule", { value: true });
/*
NOTE: We are using just functions directly without class,
though we are specifying return type.
*/
function display_value(value) {
    // Since this is server side we can just write to console
    console.log("The RMS value is " + value);
}
exports.display_value = display_value;
//# sourceMappingURL=display.js.map