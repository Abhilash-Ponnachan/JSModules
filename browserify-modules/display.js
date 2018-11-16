// browserify will use the CommonJS format for module
// CommonJS will treat this file as a module

// define and export the function directly
module.exports = function display_value(el, value){
    el.innerHTML = value;
}
