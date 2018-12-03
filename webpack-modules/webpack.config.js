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