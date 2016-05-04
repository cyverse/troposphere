"use strict";
var path = require("path");
var webpack = require("webpack");
//var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var OUTPUT_PATH = path.join(__dirname, "/troposphere/assets");
var CONTEXT_PATH = path.join(__dirname, "/troposphere/static/js");

var plugins = [
    new ExtractTextPlugin("[name].css", { allChunks: true })
//    new Clean(['.'], OUTPUT_PATH)
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
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
    analytics: "./analytics",
    public: "./public_site/main"
  },
  context: CONTEXT_PATH,
  output: {
    path: OUTPUT_PATH,
    publicPath: "/assets/",
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /bootstrap-sass/, loader: "imports?jQuery=jquery" },
      { test: /modernizr-latest\.js/, loader: "imports?this=>window,html5=>window.html5!exports?window.Modernizr" },
      { test: /\.json$/, loader: 'json-loader', include: path.join(__dirname, 'node_modules/moment-timezone')},
      { test: /\.js$/,
        loader: "babel",
        query: { cacheDirectory: '/tmp/' },
        exclude: /(node_modules|troposphere\/static\/js\/lib)/ },
      { test: /\.(scss|sass)$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader?browsers=last 2 versions!sass-loader") },
      { test: /\.woff$/ , loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2$/, loader: "url?limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf$/  , loader: "file?mimetype=application/vnd.ms-fontobject" },
      { test: /\.eot$/  , loader: "file?mimetype=application/x-font-ttf" },
      { test: /\.svg$/  , loader: "file?mimetype=image/svg+xml" },
      { test: /\.(jpe?g|png|gif|ico)$/, loader: "file?name=images/[name].[ext]" }
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
      CONTEXT_PATH,
    ],
    extensions: ["", ".js", ".scss", ".sass"]
  }
};
