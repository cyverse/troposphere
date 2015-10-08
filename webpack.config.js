"use strict";
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
    new ExtractTextPlugin("[name].css", { allChunks: true })
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
  entry: {
    app: "./main",
    no_user: "./no_user",
    analytics: "./analytics"
  },
  context: path.join(__dirname, "/troposphere/static/js"),
  output: {
    path: path.join(__dirname, "/troposphere/assets"),
    publicPath: "/assets/",
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /bootstrap-sass/, loader: "imports?jQuery=jquery" },
      { test: /modernizr-latest\.js/, loader: "imports?this=>window,html5=>window.html5!exports?window.Modernizr" },
      { test: /\.json$/, loader: 'json-loader', include: path.join(__dirname, 'node_modules/moment-timezone')},
      { test: /\.js$/, loader: "babel", exclude: /node_modules/ },
      { test: /\.(scss|sass)$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader?browsers=last 2 versions!sass-loader") },
      { test: /\.woff$/ , loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2$/, loader: "url?limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf$/  , loader: "file?mimetype=application/vnd.ms-fontobject" },
      { test: /\.eot$/  , loader: "file?mimetype=application/x-font-ttf" },
      { test: /\.svg$/  , loader: "file?mimetype=image/svg+xml" },
      { test: /\.(jpe?g|png|gif)$/, loader: "file?name=images/[name].[ext]" }
    ]
  },

  plugins: plugins,
  resolve: {
    alias: {
      bootstrap: "bootstrap-sass",
      css: path.join(__dirname, "/troposphere/static/css/"),
      images: path.join(__dirname, "/troposphere/static/images/"),
      highcharts: "highcharts-commonjs" 
    },
    root: [
      path.join(__dirname, "/troposphere/static/js"),
    ],
    extensions: ["", ".js", ".scss", ".sass"]
  }
};
