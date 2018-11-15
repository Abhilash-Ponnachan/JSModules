// use AMD format to define module
define([], function(){
    // factory function for the module
    const display_value = function(elem, value){
        elem.innerHTML = value;
    }
    /*
    NOTE: If we add a ';' above after the assigment, thne this fails.
    Nothing seems to be returned from this module!!
    <TODO> : Need to explore and understand that later!
     */

    // return exposed function
    return display_value;
    /* 
    NOTE: function is directly exported without any wrapping object, 
    therefore it has to be accessed directly when imported.
    */
});
