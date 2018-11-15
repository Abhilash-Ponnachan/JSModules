// use AMD to define our module
define(['calc', 'display'], function(calc, display){
    // specify our dependencies as an array
    // parameters to inject our depenencies
    // factory function for module instantiation

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const rms = calc(numbers);
    const el = document.getElementById('value');
    display(el, rms);
    // accessing imported function directly
    /* 
    NOTE: The actual name of exported member is not important.
    In the 'display.js' module it was 'display_value'.
    What matters is the parameter we use for dependency injection. 
    */

    // nothing to export here
});
