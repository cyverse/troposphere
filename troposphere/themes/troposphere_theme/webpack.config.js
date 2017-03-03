const webpack = require('webpack');
const validate = require('webpack-validator');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
    dist: __dirname + "/dist",
}

module.exports = {
    entry: [ "./src/js/theme.js", "./src/scss/theme.scss"],
    output: {
        filename: "theme.js",
        path: PATHS.dist
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: RegExp(__dirname + "/src"),
                loaders:["babel-loader"]
            },
            { 
                test: /\.(scss|sass)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                }),  
            },
            {
                test: /\.svg$/,
                loader: "file-loader?mimetype=image/svg+xml"
            },
            {
                test: /\.(jpe?g|png|gif|ico)$/, 
                loader: "file-loader?name=images/[name].[ext]"
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin({filename: "theme.css", allChunks: true }),
        new CopyWebpackPlugin([{ from: './src/images', to: './images' }]),
        new CleanPlugin(PATHS.dist)
    ]
};

