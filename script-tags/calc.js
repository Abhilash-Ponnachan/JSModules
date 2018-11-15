function calc_rms(numbers){
    let r = reduce(map(numbers, (x) => {
            return x * x;
        }),
        (x,y) => {
            return x + y;
        },
        0
        );
    return sqrt(r);
}