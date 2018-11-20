Modularity in JS
================

Decomposing code into smaller modules is a basic appraoch in programming to control complexity.
Each module has a smaller surface area than a full program, improving the readability, testability, and maintainability of the code base.

### Concept
The 'Module' construct in any programming language is meant to address the following concerns:
* Encapsulation - How to encapsulate the code and avoid exposing everything to the global scope.
* Expose an Interface - How to export necessary members to the oustide through a defined interface
* Dependency Refernce - A structured way to refer dependencies.

### Background
Node.js has always supported modular programming from its inception, however in the browser world the support has been lagging. Today there are a number of approaches and tools to handle modules.

### Different Approaces
We shall examine each of the different approaches here. In order to do that we shall use an example scenario. We have a simple application with the following components:  
1) An 'index.html' page that is the UI for the application
2) A 'main.js' that has the main application code. It is the entry point.
3) The 'main.js' uses functions from a 'calc.js' to calculate the RMS value of a list of numbers.
4) It uses a 'display.js' to display the value in HTML.
5) The 'calc.js' in turn uses a 'math.js' to do some calculations.

So the dependency graph looks like -  
<pre>
          |----> calc ----> math 
main ---->|
          |----> display
</pre>

1) **Using Script Tags**  
    Issues with this approach :   
    a) *Lack of Dependency Resolution*  
    The order of the dependnecies are important and we have to ensure that we load/refer the script files in the correct order, else the code will fail.  
    b) *Pollution of Global namespace*  
    All the functions and file level varaibles are at global level, and this can lead to overwrites and bugs. 

2) **Module Object & IIFE**  
    In this approach we can reduce the global namespace pollution by having just one global object that will have all the methods needed.
    We normally need an additional JS file to define our global application object.  
    Then in each of the other JS files we wrap the entire code in an IIFE and within that add the fucntions to our global object as its methods (this is also known as the 'module pattern').  
    This way everything within the IIFE remains private to that and only one object is exposed globally.
    This was a common approach taken by the early libraries such as jQuery (the global object is '$').
    This still we have the same issues with :  
    a) *Lack of Dependency Resolution*  
    b) *Limited pollution of Global namespace*  
        Now there is only one global object that wraps everyting within it.

3) **CommonJS**  
    In 2009 ServerJS was setup to standardize JS for the server side. This later became CommonJS.
    CommonJS is a standardization body just like ECMA and W3C.
    * _W3C - Defines the sndards for the Web and JS Web APIs and DOM_
    * _ECMA - Defines the JS langauge standards_
    * _CommonJS - Defines common APIs for server, web and command line_

    This includes API for modules in JS (though not for the browser).   
    In a CommonJS compliant platform such as Node.js each JS file is treated as a separate module.  
    In fact Node.js wraps the code in the file within a 'module wrapper' which looks something like - 
    ```javascript
    (function(exports, require, module, __filename, __dirname){
        // original code in file goes here
        const myFunc = function(){..}
        module.exports = myFunc;
    })
    ```
    This keeps all the top level objects at module level and not global. It also provides some handles to objects such as 'module', 'exports' etc.  
    In this case our example will not have any HTML and will be run as a Node.js app from the commandline.  

    The way to use CommonJS is quite straightforward -   
    Whatever we wish to expose outside of our module (file) we assign as value to 'module.exports' where 'module' is a global object implemented by Node.js.  
    Our code for 'main.js' will look like below -    
    ```javascript
    // CommonJS will treat this file as a module
    // import the calculation module
    const calc_rms = require('./calc.js')
    // import the display module
    const display_value = require('./display.js')

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const rms = calc_rms(numbers);
    // NOTE: we are using the single exported function 

    display_value(rms);
    // NOTE: we are using the single exported function
    ```
    The dependency 'calc.js' will look like -    
    ```javascript
    // CommonJS will treat this file as a module
    // import the required functions from 'math.js'
    const myMath = require('./math.js')

    function calc_rms(numbers){
        // access methods via the imoported object
        let r = myMath.reduce(myMath.map(numbers, (x) => {
            // body suppressed for brevity
        });
        return myMath.sqrt(r);
    };

    // export the calc function from this module
    module.exports = calc_rms;
    // NOTE: it exports only one function
    ```
    And 'math.js' will look like -    
    ```javascript
    // CommonJS will treat this JS file as a module
    function map(items, fun){
        // body suppressed for brevity
    }

    function reduce(items, fun, seed){
        // body suppressed for brevity
    }

    function sqrt(num){
        // body suppressed for brevity
    }
    // all the above code will be private to this file/module

    // explicitly expose the required members via export
    module.exports = {map, reduce, sqrt};
    ```  
    Finally 'display.js' will be -
    ```javascript
    // CommonJS will treat this file as a module
    // define and export the function directly
    module.exports = function display_value(value){
        // Since CommonJS is server side we can just write to console
        console.log(`The RMS value is ${value}`);
    }
    ```  

    If we examine 'module' object for this project, we can see -
    ```javascript
    > module    
    Module {
    id: '.',
    exports: {},
    parent: null,
    filename: '<pwd>/main.js',
    loaded: false,
    children:
    [ Module {
        id: '<pwd>/calc.js',
        exports: [Function: calc_rms],
        parent: [Circular],
        filename: '<pwd>/calc.js',
        loaded: true,
        children: [Array],
        paths: [Array] },
        Module {
        id: '<pwd>/display.js',
        exports: [Function: display_value],
        parent: [Circular],
        filename: '<pwd>/display.js',
        loaded: true,
        children: [],
        paths: [Array] } ],
    paths:
    [ '<pwd>/node_modules',
        '<pwd>/../node_modules',
        ...
        '~/node_modules',
        'C/node_modules' ] }
    ```
    As we can see it has an 'exports' property and a set of 'paths'. The 'main.js' module has 2 child modules that it has imported viz. 'calc.js' and 'display.js'. note how the 'exports' property points to the exported object/function.  
    When we import a module using 'require()' function, it searches through the path for resolving the location and loading the module. When it finds the module it loads it returns whatever is associated with the 'module.exports' property.

4) **AMD**  
    Whilst CommonJS solves the problem for the server side, it has has a serious constrain for browser applications. The 'require()' function is a synchronous load and with nested dependencies this can block the browser from doing anything else while the modules load.  
    The Asynchronous Module Definition is a format that hopes to allieviate this issue by supporting asynchronous loading of modules.  
    The typical 'module pattern' looks like below:
    ```javascript
    (function(){
        aGlobalObj.exportedFunc = function() {};
    })();
    ```
    This approach relies on attaching properties to a global object.  
    Also the dependencies are assumed to be immediately available as soon as this function is executed, this limits the module loading strategies.

    AMD addresses these by providing a different pattern -
    ```javascript
    define(module_id // optional
        , ['dep1', 'dep2'] // dependencies
        , function(dep1, dep2){ // a module factory function
        // ... module code ...
        return function() {}
    })
    ```
    It introduces the concept of a 'define' function which takes an array of depenencies that is needed by our module (as strings just like the CommonJS approach), and a factory function that instantiates our module. _The 'module_id' parameter is optional (useful for edge cases)_.

    The AMD format takes a functional prgramming approach which allows:
    * Passing in the dependencies as arguments rather than relying on globals
    * The HOF 'define' takes a factory function that can be invoked once the required modules are loaded.  
    * Also note how the factory function uses 'Dependency Injection' pattern to provide the dependencies to the current module.

    The support for asynchrnous instantiation makes it ideal for today's browser scenarios. 

    ##### AMD Loaders
    There are a number of module loaders that implement the AMD format. Th emost common are -
    - RequireJS
    - cujojs/curl 

    Let us implement our example using AMD and RequireJS.  
    Now our 'math' module will look like -
    ```javascript
    // use AMD format to define our m
    define([], function(){
        // factory function for the module

        // module body
        function map(items, fun){
            // body suppressed for brevity
        }
        
        function reduce(items, fun, seed){
            // body suppressed for brevity
        }
        
        function sqrt(num){
            // body suppressed for brevity
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
    ```
    Our 'calc' module which uses 'math' will look like -
    ```javascript
    // use AMD to define our module
    define(['math'], function(math){
        // specify 'math' as dependency
        // dependency injection of - 'math' 
        // factory function for the module

        // module body
        const calc_rms = function (numbers){
            // body suppressed for brevity
        }

        // return exposed function
        return calc_rms;
        /* 
        NOTE: function is directly exported without any wrapping object, 
        therefore it has to be accessed directly when imported.
        */
    });
    ```
    And our 'main' will now look like so -
    ```javascript
    // use AMD to define our module
    define(['calc', 'display'], function(calc, display){
        // specify our dependencies as an array
        // dependency injection of 'calc' and 'display'
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
    ```
    Finally our 'index.html'
    ```html
    <html>
    <head>
        <title>JS Modules with Script-tags</title>
    </head>
    <body>
        <h1>RMS value of the numbers is <span id="value"></span>
        </h1>
        <script data-main="main" src="require.js"></script>
    </body>
    </html>
    ```
    Note how it has only one 'script tag' the 'require.js', and this has a 'data-main' attribute that tells it what is the entry point. 'require.js' does the rest. We can see the effect of this in the browser's developer tools.  

    First the view of using 'script' tags directly in HTML -
    ![using script tags](dev-network-script-tags.png)  
    We can clearly observe the longer stall times (in grey) while the scripts get queued for loading. _Since this is a local page on my machine, the actual load time is negligible_
    
    Next the view of using 'require.js' -
    ![using require.js](dev-network-amd.png)  
    _NOTE: I have simulated a low speed network from the settings_  
    We can observe the following:
    * 'index.html' loads 'require.js' and that in turn loads the entry point 'main.js' which in turn loads its dependencies and so on recursivley.
    * There is very little stall time while the page is loading. This is time that the browser is not blocked. This is in contrast to using 'script' tags directly for all dependencies!

    For all its benefits AMD has some  minor drawbacks -
    1) The syntax is too verbose, wrapping everything up in 'define' and specifying all those dependencies as paramters.
    2) The list of dependencies in the array must match the parameter list of of the factory function. This can get quite cumbersome as the count increases.
    3) With todays HTTP 1.1 browsers loading many small files can degrade the performance! _Currently bundling the assets for download seems to perform better, however with HTTP/2 the behaviour may flip over to multiple small assets._

5) **Browserify**  
    Given that today performance is generally better in browsers with fewer assets to download (over HTTP/1.1), and the fact that AMD syntax is percieved as more verbose, a preferred appraoch is to use the CommonJS format and bundle the code together.  
    'Browserify' is a command line tool that achieves this. It traverses the dependency tree of our code and bundles them all into a single file. And we can use the CommonJS format.

    In order to use 'Browserify' we have to install it using NPM (so it requires Node.js and NPM installed first). So we first do that -
    ```bash
    $ npm install -g browserify

    ..\AppData\Roaming\npm\browserify -> ..\AppData\Roaming\npm\node_modules\browserify\bin\cmd.js
        + browserify@16.2.3
        added 137 packages in 61.987s
    ```
    Now that we have browserify installed globally via npm, let us modify our example slightly to use it.  
    The JS code will look just like our CommonJS example, so the 'main.js' would be -
    ```javascript
    // browserify will use the CommonJS format for module
    // CommonJS will treat this file as a module

    // import the calculation module
    const calc_rms = require('./calc.js')
    // import the display module
    const display_value = require('./display.js')

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const rms = calc_rms(numbers);
    // use the single exported function 
    const el = document.getElementById('value');
    display_value(el, rms);
    // use the single exported function
    ```
    The other modules namely 'math.js', 'calc.js', 'display.js' will be on same lines (using CommonJS).  
    The 'index.html' however will have a slight change -
    ```html
    <html>
        <head>
            <title>JS Modules with Script-tags</title>
        </head>
        <body>
            <h1>RMS value of the numbers is <span id="value"></span>
            </h1>
            <script type="text/javascript" src="bundle.js"></script>
        </body>
    </html>
    ```
    Note how the script tag refers to a 'bundle.js' file (which we have not written)!

    Now we run 'browserify' bundler within our project directory -
    ```bash
    $ browserify main.js -o bundle.js
    ```
    Here we specify our entry point 'main.js' and the '-o' followed by the name we wish for the output (bundled) JS file. It is file that is specified in our script tag of our HTML.  
    Browserify will parse the JS files, traverse the dependency tree and create a single bundled JS file - 'bundle.js' -
    ```javascript
    (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

        // our code will be here ...

    
        },{}]},{},[3]);
    ```
    The generated file is slightly cryptic looking but our familiar code sections are recognizable.

    Now let us see what the network characteristics are when we load the page -  
    ![using browserify](dev-network-browserify.png)  
    And we can see that there is only one single JS file that gets downloaded which happens relatively fast.








6) **ES6 Module Syntax**
    With the ES6 (ES2015+) language specification, JS now has a native syntax support for modules. The ES6 modules have been deisgned to behave in some particular ways:  
    -  In ES6 each 'JS file' is a module. We cannot split a module into multiple files neither can we combine multiple modules in one file (apart from bundling). 
    - A JS file/module provides encapsulation for all code within it. Anything we wish to expose should be done so with 'export' statement. Everything else remains private.
    - A module exposes a 'static interface' (somewhat like static typed cmpiled languages). This cannot be modified at runtime. If at all any such need arises it has to be handled through members of exported objects.
    - A module API exposes only 'bindings' and not values. These are references to exportted objects and not value copies. This means that anytime the value exposed by an API is modified, all imported references are impacted. Think of it like 'pointers'.
    - These bindings are one-way, that is they cannot be modified from outside the module. The imported binding identifiers are read-only. This makes sense as otherwise there would be no control on the state of the module.
    - To access the exposed API of a module we have to 'import' it.
    - Importing a module is same as loading it (unless it is already loaded). This results in a blaocking load.
    - An ES6 module is a singleton. All imports of a given module will get the same instance. If an API modifies any state within the module it can impact  all other imports of that module.  

    ***Syntax for export***
    - Named export -
    ```javascript
    // prefix the 'declaration' with 'export'
    export function foo(){}
    export var PI = 3.4141;
    ```
    ```javascript
    // use identifiers to export
    function foo(){}
    var PI = 3.4141;
    // specify a list of identifiers in export
    export {foo, PI}
    // NOTE: 'foo' in export is an identifier pointing to function expression foo!
    ```
    - Default export - 
    We can sepcify a particular exported binding to be the default one. This just means that when importing this module the syntax is simpler. Under the hood the default binding is exported literally using the name 'default'!  
    There can be only one defualt export per module and is the preferred way when possible.
    ```javascript
    // default export with declaration
    export default function foo(){}
    ```
    ```javascript
    function foo(){}
    // default export the function expression
    export default foo;
    ```
    ```javascript
    function foo(){}
    // default export an identifier to the function
    export {foo as default};
    // NOTE: here 'foo' identifier has become default because it was aliased as 'default'!
    ```
    - Export alias -
    ```javascript
    function foo(){}
    // export foo with another alias
    export {foo as bar};
    // NOTE: when imported the binding will have name 'bar' and foo will be private
    ```
    - Re-export from another module -
    ```javascript
    export * from "baz";
    // 'from' keyword to re-export
    ```
    ***Syntax for import***
    For importing we use the 'import' keyword.
    - Specify named members -
    ```javascript
    // import specified members
    import {foo, bar, baz} from "foo";
    ```  
    Note: "foo" is the module-specifier and has to be a string becuase it is statically analyzed.  
    The identifiers specified (foo, bar) in import shoudl match the exported bindings from the module.
    - Rename imported members -
    ```javascript
    // rename to avoid naming conflict or for friendly name
    import {calcluateAverage as mean} from "stats";
    ```  
    - Import default member -
    ```javascript
    // identifier without {..}
    import foo from "foo";
    // same as
    import {default as foo} from "foo";
    ``` 
    The default import has the cleanest syntax and is the recommended way.  
    Of course we can have one default and other specified imports in the same statement.
    ```javascript
    // default and named
    import foo, {bar, baz as "bar2"} from "foo";
    // foo is default
    ``` 
    - Import everything -
    We can import all exported bindings in one go. Generally imported to a namespace object
    ```javascript
    // wildcard '*'
    import * as foo from "foo";

    // access using namespace
    foo.default() // default exported -> foo()
    foo.bar();
    foo.baz();
    ``` 
    ```javascript
    // mix default & '*'
    import fooFn, * as foo from "foo";

    // access using namespace
    fooFn(); // default export -> foo()
    foo.default() // default exported -> foo()
    foo.bar();
    foo.baz();
    ``` 
    - Empty import -
    ```javascript
    // no identifier specified
    import "foo";
    ```  
    In this case nothing gets imported into this scope. It just loads the module 'foo'. Usually used when we want some initialization codeto be excuted.  
    Let us modify our example to work with ES6 syntax, and we shall do this on the server-side first -  
     - our math module will now look like - 
     ```javascript
    // ES6 module syntax
    function map(items, fun){
        // body suppressed for brevity
    }

    function reduce(items, fun, seed){
        // body suppressed for brevity
    }

    function sqrt(num){
        // body suppressed for brevity
    }

    // export a list of function bindings
    export {map, reduce, sqrt};
    ``` 
     - and calc which uses math will look like - 
     ```javascript
    // ES6 module syntax
    // import everything from 'math'
    import * as math from './math';

    // default export
    export default function calc_rms(numbers){
        // access methods via the imported namespace 'math'
        let r = math.reduce(math.map(numbers, (x) => {
            // body suppressed for brevity
        };
        return math.sqrt(r);
    };
    ``` 
     - display module will have simialr change to export - 
     ```javascript
    // ES6 module syntax
    // import default member from calc
    import calc_rms from './calc';
    // import with alais from calc

    //import {display_value as display} from './display';
    // NOTE: the above does not work with Node V 8.10 as of now
    // fallback to default
    import display_value from './display';

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const rms = calc_rms(numbers);
    // NOTE: we are using the single exported function 

    display_value(rms);
    // NOTE: we are using the binding alais
    ```
    - _Support for ES6 in Node.js as of v8.10_
    It is important to note that as of v8.10 of Node.js the support for ES6 modules is still experimental, and in order to execute this code we need to do two things -
         - rename all the '\*.js' files to '\*.mjs'
         - excute node using the switch --experimental-modules
         ```bash
         $ node --experimental-modules main.mjs
         ```