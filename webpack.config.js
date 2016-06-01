"use strict";
var path = require('path');
var webpack = require('webpack');

// for PostCSS
var precss = require('precss');
var autoprefixer = require('autoprefixer')

// Plugin imports:
//  var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var BundleTracker = require('webpack-bundle-tracker');

var PATHS = {
    output: path.join(__dirname, "/troposphere/assets/bundles"),
    context: path.join(__dirname, "/troposphere/static/js"),
    style: path.join(__dirname, "/troposphere/static/css")
}

var plugins = [
    new ExtractTextPlugin("[name]-[hash].css", { allChunks: true }),
    new BundleTracker({filename: './webpack-stats.json'})
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
  context: PATHS.context,
  output: {
    path: PATHS.output,
    publicPath: "/assets/bundles/",
    filename: "[name]-[hash].js"
  },
  module: {
    loaders: [
      { test: /bootstrap-sass/, loader: "imports?jQuery=jquery" },
      { test: /modernizr-latest\.js/,
        loader: "imports?this=>window,html5=>window.html5!exports?window.Modernizr" },
      { test: /\.json$/,
        loader: 'json-loader',
        include: path.join(__dirname, 'node_modules/moment-timezone') },
      { test: /\.js$/,
        loader: "babel",
        query: { cacheDirectory: '/tmp/' },
        exclude: /(node_modules|troposphere\/static\/js\/lib)/ },
      { test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract("style-loader",
            "css-loader!postcss-loader!sass-loader"),
        include: PATHS.style },
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
    postcss: function() {
        return [precss, autoprefixer]
    },
    root: [
      PATHS.context,
    ],
    extensions: ["", ".js", ".scss", ".sass"]
  }
};
