// wrap everything in a function expression
(function(){

// add method to global app object
RMS.calc_rms = function (numbers){
        // refer as methods of app object (RMS)
        let r = RMS.reduce(RMS.map(numbers, (x) => {
                return x * x;
            }),
            (x,y) => {
                return x + y;
            },
            0
            );
        return RMS.sqrt(r);
    }
})();   // invoke immediately