/**
 * Compile React jsx templates into standard JavaScript syntax
 *
 * ---------------------------------------------------------------
 *
 * # task config
 * Combines files in appDir and copies the result to dir (leaving out
 * the files that were combined)
 *
 */

var react = require('gulp-react');
var notify = require('gulp-notify');
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('react', function (cb) {
    var dest = (gutil.env.type === 'production' ? '.tmp/js' : 'troposphere/assets/js');

    return gulp.src(paths.jsxTemplates)
      .pipe(react())
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Transformed React JSX templates and copied to: ' + dest, onLast: true }));
  });

};
