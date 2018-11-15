// use AMD format to define our module
define([], function(){
    // factory function for the module

    // module body
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

    // return an object with the exported methods
    return {
        map: map,
        reduce: reduce,
        sqrt: sqrt
    };
    /* 
    NOTE: Multiple functions exposed as methods ofwrapping object, 
    therefore it has to be accessed via 'obj.method' syntax when imported.
    */
});
