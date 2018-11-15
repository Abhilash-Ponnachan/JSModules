// use AMD to define our module
define(['math'], function(math){
    // specify 'math' as dependency
    // 'math' gets passed in as argument
    // factory function for the module

    // module body
    const calc_rms = function (numbers){
        let r = math.reduce(math.map(numbers, (x) => {
                // reference via 'math' object/param
                return x * x;
            }),
            (x,y) => {
                return x + y;
            },
            0
            );
        return math.sqrt(r);
    }

    // return exposed function
    return calc_rms;
    /* 
    NOTE: function is directly exported without any wrapping object, 
    therefore it has to be accessed directly when imported.
    */
});
