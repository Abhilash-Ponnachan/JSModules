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

