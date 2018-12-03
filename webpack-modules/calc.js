// ES6 module syntax

// import everything from 'math'
import * as math from './math';

// default export
export default function calc_rms(numbers){
    // access methods via teh imoported namespace 'math'
    let r = math.reduce(math.map(numbers, (x) => {
            return x * x;
        }),
        (x,y) => {
            return x + y;
        },
        0
        );
    return math.sqrt(r);
};