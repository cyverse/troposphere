"use strict";
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var plugins = [
    new webpack.ProvidePlugin({
      "jQuery": "jquery"
    }),
    new ExtractTextPlugin("app.css", { allChunks: true})
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        "process.env": JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: "./main",
  context: path.join(__dirname, "/troposphere/static/js"),
  output: {
    path: path.join(__dirname, "/troposphere/assets"),
    publicPath: "/assets/",
   filename: "app.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel", exclude: /node_modules/ },
      { test: /\.(scss|sass)$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") },
      { test: /\.woff$/ , loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2$/, loader: "url?limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf$/  , loader: "file?mimetype=application/vnd.ms-fontobject" },
      { test: /\.eot$/  , loader: "file?mimetype=application/x-font-ttf" },
      { test: /\.svg$/  , loader: "file?mimetype=image/svg+xml" }
    ]
  },
  plugins: plugins,
  resolve: {
    alias: {
      bootstrap: "bootstrap-sass",
      css: path.join(__dirname, "/troposphere/static/css/app"),
      highcharts: "highcharts-commonjs"
    },
    root: [
      path.join(__dirname, "/troposphere/static/js"),
      path.join(__dirname, "/troposphere/static/css/app")
    ],
    extensions: ["", ".js", ".scss", ".sass"]
  }
};
