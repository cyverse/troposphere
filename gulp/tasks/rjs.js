/**
 * Combine and optionally minimize RequireJS dependencies.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Combines files in appDir and copies the result to dir (leaving out
 * the files that were combined)
 *
 * # prod task config
 * Combines and minimizes files in appDir and copies the result to
 * dir (leaving out the files that were combined)
 *
 */

var rjs = require('requirejs');
var _ = require('underscore');

module.exports = function (gulp) {

  var rjsConfig = {
    appDir: '.tmp/',
    baseUrl: './js',
    mainConfigFile: ".tmp/js/config.js",
    dir: "troposphere/assets/",
    removeCombined: true,
    modules: [
      {
        name: "main"
      },
      {
        name: "public_site/main"
      }
    ],
    paths: {
      jquery: "empty:",
      backbone: "empty:",
      marionette: "empty:",
      'backbone.wreqr': "empty:",
      'backbone.babysitter': "empty:",
      underscore: "empty:",
      bootstrap: "empty:",
      moment: "empty:",
      react: "empty:",
      'react-router': "empty:",
      chosen: "empty:",
      toastr: "empty:",
      q: "empty:",
      highchartsBase: "empty:",
      highcharts: "empty:",
      crypto: "empty:",
      sinon: "empty:",
      showdown: "empty:"
    }
  };

  gulp.task('rjs:dev', function (cb) {
    var devConfig = _.defaults({optimize: 'none'}, rjsConfig);

    rjs.optimize(devConfig, function (buildResponse) {
      cb();
    }, cb);
  });

  gulp.task('rjs:prod', function (cb) {
    rjs.optimize(rjsConfig, function (buildResponse) {
      cb();
    }, cb);
  });

};
