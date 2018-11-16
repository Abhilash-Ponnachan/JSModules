// brwoserify will use the CommonJS format for module
// CommonJS will treat this JS file as a module
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
// all the above code will be private to this file/module

// explicitly expose the required members via export
module.exports = {map, reduce, sqrt};
