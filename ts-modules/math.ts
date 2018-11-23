// Use TS class and export it as defualt
export default class FuncMath{
    // static methods - no encapsulated state
    static map(items, fun){
        let r = [];
        for(let i=0; i<items.length; i++){
            r.push(fun(items[i]));
        }
        return r;
    }

    static reduce(items, fun, seed){
        let r = seed;
        for(let i=0; i<items.length; i++){
            r = fun(r, items[i]);
        }
        return r;
    }

    static sqrt(num){
        return Math.sqrt(num);
    }
}