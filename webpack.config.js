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

var plugins = [
  new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
  })
];

module.exports = {
  entry: "./main",
  context: path.join(__dirname, "/troposphere/static/js"),
  output: {
    path: path.join(__dirname, "/troposphere/assets"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel", exclude: /node_modules/ },
      { test: /\.(scss|sass)/, loader: ExtractTextPlugin.extract("style", "css!sass") }
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
