const webpack = require('webpack');
const validate = require('webpack-validator');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
    dist: __dirname + "/dist",
}

module.exports = {
    entry: { 
        THEME: "./src/js/theme.js",
    },
    output: {
        filename: "theme.js",
        path: PATHS.dist,
        // export itself to a global var
        libraryTarget: "assign",
        // name of the global var: "Foo"
        library: "THEME"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: RegExp(__dirname + "/src"),
                loaders:["babel-loader"]
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
                { from: './src/images', to: './images' },
                { from: './src/css', to: './' }
        ]),
        new CleanPlugin(PATHS.dist)
    ]
};

