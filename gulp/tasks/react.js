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

module.exports = function (gulp) {

  gulp.task('react', function (cb) {
    return gulp.src(paths.jsxTemplates)
      .pipe(react())
      .pipe(gulp.dest('troposphere/assets/js'))
      .pipe(notify({ message: 'Converted React templates to JS syntax', onLast: true }));
  });

};
