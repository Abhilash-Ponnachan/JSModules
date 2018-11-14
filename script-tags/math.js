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