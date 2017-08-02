/**
 * Webpack config for the project
 *
 * This file tells webpack how to build your project, and includes instructions for both development and production
 * environments. For an understanding of what each setting is for, see the official webpack documentation:
 *
 * https://webpack.js.org/configuration/
 *
 * If you're new to webpack, you may find this video series by Kent Dodds helpful for getting up to speed quickly:
 * https://egghead.io/courses/using-webpack-for-production-javascript-applications
 **/

var pkg = require('./package.json');
var path = require('path');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var { getIfUtils, removeEmpty, propIf } = require('webpack-config-utils');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BundleTracker = require('webpack-bundle-tracker');
var fs = require('fs');

// Theme Images
var themeImagesPath = require('./themeImagesPath');

module.exports = function(ENV) {
  var { ifProduction } = getIfUtils(ENV);

  // Preface the webpack-dev-server command with CSS_IN_JS=true for CSS hot
  // reloading.
  //
  // By default we extract CSS from the larger bundle into a separate asset
  // that is parsed/loaded before any js, this ensures that the content of our
  // html will be styled the first time it is shown. However, CSS hot
  // reloading only works if the CSS is shipped in the JS.
  var extractCSS = ifProduction(true, !process.env.CSS_IN_JS);

  var PATHS = {
    output: path.join(__dirname, "/troposphere/assets/bundles"),
    context: path.join(__dirname, "/troposphere/static/js/"),
    css: path.join(__dirname, "/troposphere/static/css/"),
    images: path.join(__dirname, "/troposphere/static/images/"),
    theme: path.join(__dirname, "/troposphere/static/theme/"),
    themeImages: themeImagesPath,
    public: "/assets/bundles/"
};

  return {
    devtool: ifProduction('source-map', 'eval'),
    entry: removeEmpty({
      vendor: Object.keys(pkg.dependencies),
      app: "./main",
      analytics: "./analytics",
      public: "./public_site/main"
    }),
    output: {
      filename: ifProduction(
        'bundle.[name].[chunkhash].js',
        'bundle.[name].js'
      ),
      path: PATHS.output,
      pathinfo: ifProduction(false, true),
      publicPath: PATHS.public
    },
    context: PATHS.context,
    resolve: {
      alias: {
        react: path.resolve(__dirname, 'node_modules/react'),
        highcharts: "highcharts-commonjs",
        css: PATHS.css,
        images: PATHS.images,
        theme: PATHS.theme,
        themeImages: PATHS.themeImages
      },
      modules: [
        PATHS.context,
        "node_modules"
      ],
      extensions: [".js", ".jsx", ".scss", ".sass"]
    },
    module: {
      rules: [
        {
          test: /bootstrap-sass/,
          use: [
            "imports-loader?jQuery=jquery"
          ]
        },
        {
          test: /modernizr-latest\.js/,
          use: [
            "imports-loader?this=>window,html5=>window.html5",
            "exports-loader?window.Modernizr"
          ]
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          // exclude: /node_modules/
          exclude: /(node_modules|troposphere\/static\/js\/lib)/
        },
        {
          test: /\.jsx$/,
          use: 'babel-loader',
          // exclude: /node_modules/
          exclude: /(node_modules|troposphere\/static\/js\/lib)/
        },
        {
          test: /\.css/,
          use: propIf(extractCSS, ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              'postcss-loader'
            ]
          }), [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ])
        },
        {
          test: /\.less$/,
          use: propIf(extractCSS, ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              'postcss-loader',
              'less-loader'
            ]
          }), [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader',
            'less-loader'
          ])
        },
        {
          test: /\.scss$/,
          use: propIf(extractCSS, ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              'postcss-loader',
              'sass-loader'
            ]
          }), [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader',
            'sass-loader'
          ])
        },
        {
          test: /\.(png|jpg|jpeg|gif|tif|tiff|bmp|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              // limit: 10000,
              limit: 10,
              name: ifProduction(
                'assets/images/[name].[hash:8].[ext]',
                'assets/images/[name].[ext]'
              )
            }
          }
        },
        {
          test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: ifProduction(
                'assets/fonts/[name].[hash:8].[ext]',
                'assets/fonts/[name].[ext]'
              )
            }
          }
        },
        {
          test: /\.json/,
          use: 'json-loader'
        }
      ]
    },
    plugins: removeEmpty([
      new BundleTracker({
          filename: './webpack-stats.json'
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(ENV)
        }
      }),
      new ProgressBarPlugin(),
      new ExtractTextPlugin(ifProduction(
        'styles.[name].[chunkhash].css',
        'styles.[name].css'
      )),
      new webpack.optimize.CommonsChunkPlugin({
        names: [
          'vendor',
          'manifest'
        ],
        minChunks: Infinity
      }),
      new CopyWebpackPlugin([
        {
          from: PATHS.themeImages,
          to: "theme/images"
        },
        {
          from: PATHS.theme + "/login.css",
          to: "theme/login.css"
        }
      ])
    ]),
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
    }
  };
};
