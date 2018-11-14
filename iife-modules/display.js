// wrap inside a function expression
(function(){
    // add method to global app object
    RMS.display_value = function(elem, value){
        elem.innerHTML = value;
    }
})(); // invoke immediately