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
      jquery: '../bower_components/jquery/dist/jquery',
      backbone: '../bower_components/backbone/backbone',
      marionette: '../bower_components/backbone.marionette/lib/core/backbone.marionette',
      'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
      'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
      underscore: '../bower_components/underscore/underscore',
      bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
      moment: '../bower_components/moment/moment',
      react: '../bower_components/react/react-with-addons',
      chosen: '../bower_components/chosen/chosen.jquery',
      toastr: '../bower_components/toastr/toastr',
      q: '../bower_components/q/q',
      highchartsBase: '../bower_components/highcharts-release/highcharts',
      highcharts: '../bower_components/highcharts-release/highcharts-more',
      crypto: 'lib/md5',
      sinon: '../bower_components/sinon/lib/sinon'
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
