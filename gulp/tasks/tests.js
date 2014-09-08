/**
 * Copy all pure JavaScript files to destination directory.
 *
 * ---------------------------------------------------------------
 *
 * # default task config
 * Copy files directly to the assets directory for easier development.
 *
 * # production task config
 * Copy files to .tmp directory where r.js will take over.
 *
 */

var notify = require('gulp-notify');
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('tests', function () {
    var dest = (gutil.env.type === 'production' ? '.tmp/tests' : 'troposphere/assets/tests');

    return gulp.src(paths.tests)
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Copied tests to: ' + dest, onLast: true }));
  });

};
