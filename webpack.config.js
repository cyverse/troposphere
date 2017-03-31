"use strict";
var path = require('path');
var webpack = require('webpack');

// Theme Images
var themeImagesPath = require('./themeImagesPath');

// for PostCSS
var precss = require('precss');
var autoprefixer = require('autoprefixer')

// Plugin imports:
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var BundleTracker = require('webpack-bundle-tracker');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var PATHS = {
    output: path.join(__dirname, "/troposphere/assets/bundles"),
    context: path.join(__dirname, "/troposphere/static/js"),
    style: path.join(__dirname, "/troposphere/static/css"),
    theme: path.join(__dirname, "/troposphere/static/theme"),
    themeImages: themeImagesPath,
}
var plugins = [
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
        minChunks: Infinity
    }),
    new Clean([PATHS.output]),
    new CopyWebpackPlugin([
        {
            from: PATHS.themeImages,
            to: "./theme/images",
        },
        {
            from: PATHS.theme + "/login.css",
            to: "./theme/login.css",
        },

    ])
];

var outputCfg = {}

var pkg = require('./package.json');

if (process.env.NODE_ENV === "production") {
  outputCfg = {
    path: PATHS.output,
    publicPath: "/assets/bundles/",
    filename: "[name]-[chunkhash].js",
    chunkFilename: '[chunkhash].js'
  };

  plugins.push(
    new ExtractTextPlugin("[name]-[hash].css", { allChunks: true }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.jsx?$|\.css$/,
            threshold: 10240,
            minRatio: 0.8
    })
  );
} else {
  plugins.push(
    new ExtractTextPlugin("[name].css", { allChunks: true })
  );

  outputCfg = {
    path: PATHS.output,
    publicPath: "/assets/bundles/",
    filename: "[name].js"
  };
}

module.exports = {
  entry: {
    vendor: Object.keys(pkg.dependencies),
    app: "./main",
    analytics: "./analytics",
    public: "./public_site/main"
  },
  context: PATHS.context,
  output: outputCfg,
  module: {
    loaders: [
      { test: /bootstrap-sass/, loader: "imports?jQuery=jquery" },
      { test: /modernizr-latest\.js/,
        loader: "imports?this=>window,html5=>window.html5!exports?window.Modernizr" },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      { test: /\.jsx?$/,
        loader: "babel-loader",
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
    fallback: [path.join(__dirname, "/node_modules")],
    alias: {
      highcharts: "highcharts-commonjs",
      css: path.join(__dirname, "/troposphere/static/css/"),
      images: path.join(__dirname, "/troposphere/static/images/"),
      theme: path.join(__dirname, "/troposphere/static/theme/"),
      themeImages: PATHS.themeImages,
    },
    root: [
      PATHS.context,
    ],
    extensions: ["", ".js", ".jsx", ".scss", ".sass"]
  },
  resolveLoader: {
      root: path.join(__dirname, 'node_modules')
  },
  // defined the PostCSS plugins to be used
  postcss: function() {
    return [precss, autoprefixer({ browsers: ['last 2 versions'] })]
  }
};
