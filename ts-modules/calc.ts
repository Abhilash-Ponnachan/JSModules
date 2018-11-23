// import default-export from 'math'
import Maths from './math';
// Note exported name was 'FuncMath'

// default export function
/* 
NOTE: here we are just using a function without class,
though we are using types for the param & return.
*/
export default function calc_rms(numbers: Array<number>): number{
    // access methods via the imoported class 'Maths'
    let r = Maths.reduce(Maths.map(numbers, (x) => {
            return x * x;
        }),
        (x,y) => {
            return x + y;
        },
        0
        );
    return Maths.sqrt(r);
};