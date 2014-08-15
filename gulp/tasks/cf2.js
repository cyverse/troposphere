/**
 * Copy cf2 files to the destination directory
 *
 * ---------------------------------------------------------------
 *
 * # default task config
 * Copy files directly to the assets directory, for both production
 * and development environments (no optimizations).
 *
 */

var paths = require('../paths');
var notify = require('gulp-notify');

module.exports = function (gulp) {

  gulp.task('cf2', function (done) {
    var dest = 'troposphere/assets/resources';

    return gulp.src(paths.cf2)
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Copied cf2 files to: ' + dest, onLast: true }));
  });

};
