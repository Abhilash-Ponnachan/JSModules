// CommonJS will treat this file as a module

// define and export the function directly
module.exports = function display_value(value){
    // Since CommonJS is server side we can just write to console
    console.log(`The RMS value is ${value}`);
}
