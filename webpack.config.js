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
var { getIfUtils, removeEmpty } = require('webpack-config-utils');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BundleTracker = require('webpack-bundle-tracker');
var fs = require('fs');

// Theme Images
var themeImagesPath = require('./themeImagesPath');

module.exports = function(env) {
  var ENV = env.webpack || env;
  var HOST = env.host || 'localhost';
  var PORT = env.port || 8080;
  var PROTOCOL = env.https ? 'https' : 'http';
  var SSL_KEY = env.sslKey || null;
  var SSL_CERT = env.sslCert || null;

  var { ifProduction, ifNotProduction } = getIfUtils(ENV);

  var PATHS = {
    output: path.join(__dirname, "/troposphere/assets/bundles"),
    context: path.join(__dirname, "/troposphere/static/js/"),
    css: path.join(__dirname, "/troposphere/static/css/"),
    images: path.join(__dirname, "/troposphere/static/images/"),
    theme: path.join(__dirname, "/troposphere/static/theme/"),
    themeImages: themeImagesPath,
    public: ifProduction(
      "/assets/bundles/",
      `${PROTOCOL}://${HOST}:${PORT}/assets/bundles/`
    )
  };

  return {
    devtool: ifProduction('source-map', 'eval'),
    entry: removeEmpty({
      vendor: Object.keys(pkg.dependencies),
      app: "./main",
      analytics: "./analytics",
      public: ifProduction("./public_site/main", "./public_site/main")
    }),
    output: {
      filename: ifProduction(
        'bundle.[name].[chunkhash].js',
        'bundle.[name].js'
      ),
      path: PATHS.output,
      pathinfo: ifNotProduction(),
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
          use: ifProduction(ExtractTextPlugin.extract({
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
          use: ifProduction(ExtractTextPlugin.extract({
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
          use: ifProduction(ExtractTextPlugin.extract({
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
      port: PORT,
      host: env.https ? '0.0.0.0' : HOST,
      https: env.https ? {
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT)
      } : false,
      disableHostCheck: !!env.https
    }
  };
};
