/**
 * Transform React JSX templates into standard JavaScript and copy
 * files destination directory.
 *
 * ---------------------------------------------------------------
 *
 * # default task config
 * Transform and copy files directly to the assets directory for easier development.
 *
 * # production task config
 * Transform and copy files to .tmp directory where r.js will take over.
 *
 */

var react = require('gulp-react');
var notify = require('gulp-notify');
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('react', function (done) {
    var dest = (gutil.env.type === 'production' ? '.tmp/js' : 'troposphere/assets/js');

    return gulp.src(paths.jsxTemplates)
      .pipe(react())
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Transformed React JSX templates and copied to: ' + dest, onLast: true }));
  });

};
