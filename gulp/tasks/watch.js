/**
 * Delete specified directories and all files in them.
 *
 * ---------------------------------------------------------------
 *
 */

var clean = require('gulp-clean');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var paths = require('../paths');
var scripts = require('./scripts');

module.exports = function (gulp) {

  scripts(gulp);

  gulp.task('watch', function () {
    gulp.watch(paths.css, ['sass']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.jsxTemplates, ['react']);
  });

};
