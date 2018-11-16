(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// browserify will use the CommonJS format for module
// CommonJS will treat this file as a module

// import the required functions from 'math.js'
const myMath = require('./math.js')

function calc_rms(numbers){
    // access methods via teh imoported object
    let r = myMath.reduce(myMath.map(numbers, (x) => {
            return x * x;
        }),
        (x,y) => {
            return x + y;
        },
        0
        );
    return myMath.sqrt(r);
};

// export the calc function from this module
module.exports = calc_rms;
// NOTE: it exports only one function


},{"./math.js":4}],2:[function(require,module,exports){
// browserify will use the CommonJS format for module
// CommonJS will treat this file as a module

// define and export the function directly
module.exports = function display_value(el, value){
    el.innerHTML = value;
}

},{}],3:[function(require,module,exports){
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
},{"./calc.js":1,"./display.js":2}],4:[function(require,module,exports){
// CommonJS will treat this JS file as a module
function map(items, fun){
    let r = [];
    for(let i=0; i<items.length; i++){
        r.push(fun(items[i]));
    }
    return r;
}

function reduce(items, fun, seed){
    let r = seed;
    for(let i=0; i<items.length; i++){
        r = fun(r, items[i]);
    }
    return r;
}

function sqrt(num){
    return Math.sqrt(num);
}
// all the above code will be private to this file/module

// explicitly expose the required members via export
module.exports = {map, reduce, sqrt};

},{}]},{},[3]);
