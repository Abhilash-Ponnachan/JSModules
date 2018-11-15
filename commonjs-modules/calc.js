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
    return r;
};

// export the calc function from this module
module.exports = calc_rms;
// NOTE: it exports only one function

