var webpack = require("webpack");
var path = require("path");

var excluded = /(node_modules|bower_components)/;

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

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
      { test: /\.jsx?$/, loader: "babel", exclude: excluded }
    ]
  },
  plugins: plugins,
  resolve: {
    alias: {
      bootstrap: "bootstrap-sass",
      highcharts: "highcharts-commonjs"
    },
    root: [
      path.join(__dirname, "/troposphere/static/js")
    ],
    extensions: ["", ".js", ".scss", ".sass"]
  }
};
