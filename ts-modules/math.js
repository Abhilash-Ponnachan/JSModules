"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Use TS class and export it as defualt
var FuncMath = /** @class */ (function () {
    function FuncMath() {
    }
    // static methods - no encapsulated state
    FuncMath.map = function (items, fun) {
        var r = [];
        for (var i = 0; i < items.length; i++) {
            r.push(fun(items[i]));
        }
        return r;
    };
    FuncMath.reduce = function (items, fun, seed) {
        var r = seed;
        for (var i = 0; i < items.length; i++) {
            r = fun(r, items[i]);
        }
        return r;
    };
    FuncMath.sqrt = function (num) {
        return Math.sqrt(num);
    };
    return FuncMath;
}());
exports.default = FuncMath;
//# sourceMappingURL=math.js.map