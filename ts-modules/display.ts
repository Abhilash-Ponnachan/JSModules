// TS module syntax

/*
NOTE: We are using just functions directly without class,
though we are specifying return type.
*/
function display_value(value: string){
    // Since this is server side we can just write to console
    console.log(`The RMS value is ${value}`);
}

// let us use a named export
export {display_value};
