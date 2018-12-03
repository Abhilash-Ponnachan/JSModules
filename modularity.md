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
    // default export
    export default function display_value(value){
        // Since this is server side we can just write to console
        console.log(`The RMS value is ${value}`);
    }
    ```
    - finally the main module which brings it all together - 
     ```javascript
    // ES6 module syntax
    // import default member from calc
    import calc_rms from './calc';
    // import with alais from calc
    //import {display_value as display} from './display';
    // NOTE: use the above if it was a named exported
    // use the below one for default exported
    import display from './display';
    // NOTE: the identifier name of imported binding can be different

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const rms = calc_rms(numbers);
    // NOTE: we are using the single exported function 

    display(rms);
    // NOTE: we are using the binding alais
    ```
    - _Support for ES6 in Node.js as of v8.10_
    It is important to note that as of v8.10 of Node.js the support for ES6 modules is still experimental, and in order to execute this code we need to do two things -
         - rename all the '\*.js' files to '\*.mjs'
         - excute node using the switch --experimental-modules
         ```bash
         $ node --experimental-modules main.mjs
         ```

7) **TS Module System**  
    Whilst the ES6 specification has introduced module as a first class concept in the language, the implementation is in different stages of catch-up on various platforms.  
    A cleaner way to get support for ES6 features is to use a transpiler like Babel or TypeScript.  
    Babel transpiler provides full support for ES6 language features and converts them down to supported JS format.  
    Whilst TypeScript also does the same task oc transpiling to JS, it is also introduces a statically typed language over JS. TypeScript follows a principle of being a 'strict superset' of JS. That is any valid JS/ES6 code is valid TS code.  
    The module concepts in TS are same as that of ES6. we have different synatx and semantics for export and import.  

    ***Syntax for export***  
    - Export declaration -
    A way of named exports directly while declaring the member - 
    ```typescript
    // specify export along with declaration
    export const PI = 3.41459;
    
    export function calcArea(radius){
        // ...
    }

    export class Calculator{
        // ...
    } 
    ```   
    - Export statement -
    A way of named exports of members as identifiers after they are declared - 
    ```typescript
    // specify export along with declaration
    const PI = 3.41459;
    
    function calcArea(radius){
        // ...
    }

    class Calculator{
        // ...
    } 

    // export members as identifiers 
    export {PI, calcArea, Calculator};
    ```   
     - Export alias -
    With export statements we can rename our exported member and give an alais which is what will get exposed.
    ```typescript
    // export members with alais
    export {PI, calcArea as area, Calculator as Calc};
    ``` 
    - Re-export -
    Sometimes a module might need to export part of another module. We can do this using re-export.
    ```typescript
    // re-export members from another module
    // use the 'export .. from' syntax
    export {calcArea as area} from "./mycalc";
    ``` 
    Here the re-exported module is not imported locally!
    - Default export -
    A module can also specify a member as a 'default' export. The real difference is from when we import from this module, it provides a more simpler syntax. We shall see this in the import section later.
    ```typescript
    // default export with declaration
    export default class Calculator{
        // ...
    } 
    ```
    ```typescript
    const PI = 3.41459;

    function calcArea{
        // ...
    } 

    // default export statement for function
    export default calcArea;
    // named export statement for constant
    export {PI};
    ```
    ***Syntax for import***  
    - Named import -
    Import a set of exported members from a module explicitly by name - 
    ```typescript
    // specify members to be imported
    import {calcArea, Calculator} from "./myCalc";
    ``` 
    - Named import with alais/rename -
    ```typescript
    // rename the member on import
    import {calcArea as area, Calculator as Calc} from "./myCalc";
    ```  
     - Import everything - Using '*'
    ```typescript
    // import all exported members into a namespace
    import * as calc from "./myCalc";
    // access members using the wrapper
    const area = calc.calcArea(4.0);
    ```  
    - Empty import -
    Import without getting any members into scope. Used just for side-effects when module is loaded.
    ```typescript
    // import only for side-effects
    import "./myCalc";
    ```  
    - Default import -
    Import default exported members with a simpler syntax.
    ```typescript
    // import default exported member into an identifier
    import Calc from "./myCalc";
    ```  
    Now let us try writing our example uisng TS.  
    When we use VS Code as our IDE, it is relatively easy to configure a TS project. The first step is to create a "tsconfig.json" file. This is a manifest file that instructs VS Code that this is a TS project and to function accordingly.  
    - our 'tsconfig.json' -
    ```json
    {
        "compilerOptions":{
            "target": "es5",
            "module": "commonjs",
            "sourceMap": true
        }
    }
    ```
    - the math module as '.ts' file -
    ```typescript
    // Use TS class and export it as defualt
    export default class FuncMath{
        // static methods - no encapsulated state
        static map(items, fun){
            // body suppressed for bervity
        }

        static reduce(items, fun, seed){
            // body suppressed for bervity
        }

        static sqrt(num){
            // body suppressed for bervity
        }
    }
    ```
    - calc module that uses math -
    ```typescript
    // import default-export from 'math'
    import Maths from './math';
    // Note exported name was 'FuncMath'
    // default export function
    /* 
    NOTE: here we are just using a function without class,
    though we are using types for the param & return.
    */
    export default function calc_rms(numbers: Array<number>): number{
        // access methods via the imoported class 'Maths'
        let r = Maths.reduce(Maths.map(numbers, (x) => {
            // body suppressed for brevity
        };
        return Maths.sqrt(r);
    };
    ```
    - display module -
    ```typescript
    /*
    NOTE: We are using just functions directly without class,
    though we are specifying return type.
    */
    function display_value(value: string){
        // Since this is server side we can just write to console
        console.log(`The RMS value is ${value}`);
    }
    // let us use a named export
    export {display_value};
    ```
    - bring it all together with the main -
    ```typescript
    // TS module syntax
    // import default member from calc
    import calc_rms from './calc';
    // import with alais from display
    import {display_value as display} from './display';

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const rms = calc_rms(numbers);
    // NOTE: we are using the single exported function 

    display(rms.toString());
    // NOTE: we are using the binding alias
    ```  
    In order to build this in VS Code we Run Build Task (Ctrl+Shift+B), which should show up "tsc: build - tsconfig.json" and "tsc: watch - tsconfig.json" options. The "build2 option builds once, and "watch" runs build everytime a '.ts' file in the project changes. We can make this the defualt behavior when we hit "Ctrl+Shift+B" by configuring the build task with a 'tasks.json' file.    
    Under the hood it runs the 'tsc' compiler and we get '.js' and '.js.map' files. Now just execute the entry point with node.
    ```bash
    $ node main.js
    ```  
    We can see that TS is a good option to write modular ES code. Also since TS is a strict superset of ES, we can mix and match these as needed in our project (judiciously).  

8) **Webpack**  
    We have seen how to easily use ES6 and TS module formats on the server side with Node.js. But how can we use these with browser applications? Just like using 'Browserify' for CommonJS format, there are other module bundlers that we can use for ES6 format. The most popular one at the moment is 'Webpack'. In fact it can handle CommonJS, AMD and ES6 formats.  
    Like Browserify, Webpack too traverses the dependency tree for JS, identifies the modules and bundles them together. However Webpack can do a lot more. 
    - Webpack has a _plugin architecture_ for handlers that can operate on the files during the bundling process
    - This enables different types of loaders for not just JS, but other assets such as CSS, Sass, Less, CoffeScript, images etc.
    - We can do _code-split_ to chunk our bundles. This is helpful if we have say 2 apps which use a shared set of libraries. Webpack can build it into 3 bundles - app1, app2, and shared-lib. Browserify does not support this  
    
    At the time of writing (Dec 2018) the latest version of Webpack is 4, and like all tools it there are significant changes with this major version release. We shall cover Webpack 4.

    - **Install Webpack**  

    The first step is to install Webpack, and for this we use NPM. Go to our project dirctory, initialize NPM, and install the required Webpack tools. We need 2 packages in order to use Webpack from the command line -
        - webpack
        - webpack-cli
    ```bash
    $ npm init -y

    $ npm i -D webpack webpack-cli
    ```
    This should initalize npm for us and install the 2 webpack packages as development dependencies, our _package.json_ should now have -
    ```json
    "devDependencies": {
        "webpack": "^4.26.1",
        "webpack-cli": "^3.1.2"
    }
    ```
    - **NPM scripts to run Webpack**  
    
    In order to execute Webpack commands we have to configure them to be excuted through _npm scripts_. We can modify the _scripts_ section in our _package.json_ -
    ```json
    "scripts": {
        "build": "webpack"
    }
    ```
    Now if we run NPM build we get -
    ```
    > ERROR in Entry module not found: Error: Can't resolve './src' in ...
    ```  
    Webpack cannot find an _entry point_ to traverse for the dependency tree. In previous versions of Webpack the _entry point_ had to be explicitly specified with a webpack config file, from version 4 onwards however this defaults to "__./src/index.js__". Similarly the output file(bundle) is defaulted to "__./dist/main.js__".  
    Normally we should follow this convention as it is a common standard and gives a good source code structure. However  in our case we shall just use a __webpack.config.js__ file and modify the defaults in order to re-use the source structure we setup in the other examples!  
    But before that we configure the NPM scripts with a little bit more detail -
    ```json
    "scripts": {
        "dev": "webpack --mode development",
        "build": "webpack --mode production"
    },
    ```
    The _production_ mode enables all sorts of optimizations such as minimization, tree-shaking hoisting etc.  
    If we wished to we could specify the _entry point_ and _output_ here as arguments to the _dev_ and _build_ commands!
    ```json
    "scripts": {
        "dev": "webpack --mode development ./main.js --output ./bundle.js",
        "build": "webpack --mode production ./main.js --output ./bundle.js"
    },
    // we won't use this approach!
    ```
    But if we decide to override default configuration then I prefer to have all related configuration in the same place. So we shall do that in the sections below and NOT use this approach!

    - **Setup source code**  

    Next we copy over all our files from our ES6 example _(and rename the *.mjs extensions to *.js)_. Some __bash__ can help us do this -
    ```bash
    $ cp -r es6-modules/. webpack-modules/
    $ cd webpack-modules/ && ls

    $ for f in *.mjs; do
    >  mv "$f" "$(basename "$f" .mjs).js"
    > done
    ```
    Next we copy over our _index.html_ from our Browserify example, and we should have all the files we need now to make some minimal configuration setup. We need to make some minor changes to our _display.js_ to modify HTML isntead of logging to console -
    ```javascript
    // ES6 module syntax
    // default export
    export default function display_value(elem, value){
        // set the elements inner HTML
        elem.innerHTML = `The RMS value is ${value}`;
    }
    ```  
    and corresponding change in _main.js_ to pass in the HTML anchor element -
    ```javascript
    ...
    const elem = document.getElementById('value');
    display(elem, rms);
    ...
    ``` 

    - **Install Transpiler (_Babel_)**  

    Since the browser does not understand ES6 we need to transpile it down to ES5 and the most popular trnspiler for ES6 is _Babel_. Again we have to install this via NPM. The actual dependencies are -   
        - babel core  
        - babel loader (webpack loader for babel)  
        - babel preset env(compiling ES6 to ES5)
    ```bash
    $ npm i -D @babel/core @babel/preset-env babel-loader
    >
    + @babel/core@7.1.6
    + babel-loader@8.0.4
    + @babel/preset-env@7.1.6
    ```  
    To configure Babel to execute and transpile our code we have to specify some minimal configuration by creating a _.babelrc_ configuration file -
    ```json
    {
        "presets":[
            "@babel/preset-env"
        ]
    }
    ```
    - **Configure _Webpack_ to use _Babel_**  

    We have to specify to Webpack to load and run Babel for JS files. We can do this using a _webpack.config.js_ file -
    ```javascript
    // export a configuration object
    module.exports = {
        // specify entry-point
        entry: './main.js',
        // specify output object
        output: {
            filename: 'bundle.js',
            path: __dirname // project directory
        },
        /*
        NOTE: If we use the default setting of ./src & ./dist
        folder structure we would not need the above.
        In actual projects stick to the defualt standard convention!
        */
        // specify modules to use
        module: {
            // an array of rules
            rules: [
                {
                    // test for JS files
                    test: /\.js$/, // regex pattern
                    // exclude some folders
                    exclude: /node_modules/,
                    use: {
                        // specify the loader
                        loader: 'babel-loader'
                    }
                }
            ]
        }
    };
    ```
    Note that the _Webpack configuration_ file itself is a JS file and uses CommonJS format!  
    ___Alternate Option___  
    From Webpack 4 there is an option to circumvent having to create _webpack.config.js_ by specifying the loader as a command line argument using _--module-bind_ switch. So if needed we can have it in the NPM scripts section in _package.json_ -
    ```json
    scripts{
        "dev": "webpack --mode development --module-bind js=babel-loader",
        "build": "webpack --mode production --module-bind js=babel-loader"
    }
    // we will NOT use this option
    ```  
    But throwing everything into the scripts makes it complicated and deviates from seperation of concerns! So we will stick with the _webpack.config.js_ file.  

    - **Execute Webpack build**  

    Now we are ready to build our project using Webpack. To do that simply execute the NPM script for _development_ or _production_ as needed.
    ```bash
    $ npm run dev
    ```  
    OR
    ```bash
    $ npm run build
    ```  
    This should create a _bundle.js_ file which is referenced in the HTML script and if we open _index.html_ we should see our page.  
    
    So there we have it, we have managed to write modular JS using ES6 format and get it working in a browser by transpiling it using _Babel_ and orchestrating the bundling using _Webpack_.

    - ***There is more*** 

    We have just scratched the surface of what Webpack is useful (and capable) of. One very common configuration is to setup a _webpack-dev-server_. This is a development time embedded server that can run our application in a browser. If we specify the _--watch_ option this will automatically refresh the application in the browser as we make changes to the source code.  
    To do this we would have to install -
    ```bash
    $ npm i -D webpack-dev-server
    ```  
    and modify the _scripts_ section in _package.json_ to start it -
    ```json
    "scripts": {
        "start": "webpack-dev-server --mode development --watch",
        "build": "webpack --mode production"
    }
    ```  
    We can also specify loaders and transpilers to work with CSS, HTML, ReactJS etc.

