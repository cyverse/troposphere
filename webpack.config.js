var webpack = require("webpack");
var path = require("path");

var extensions = ["", ".jsx", ".js", ".scss", ".sass"];
var excluded = /(node_modules|bower_components)/;

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

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
  plugins: [
    new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery"
    })
  ],
  // HACK: Workaround for the fs module being loaded
  node: {
    fs: "empty",
    child_process: "empty"
  },
  resolve: {
    root: [
      path.join(__dirname, "/troposphere/static/js")
    ],
    extensions: extensions
  }
};
