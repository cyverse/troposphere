/**
 * Delete specified directories and all files in them.
 *
 * ---------------------------------------------------------------
 *
 * # default task config
 * Delete the assets and .tmp directories.
 *
 */

var clean = require('gulp-clean');
var notify = require('gulp-notify');

module.exports = function (gulp) {

  gulp.task('clean', function (done) {

    return gulp.src(['troposphere/assets', '.tmp'], {read: false})
      .pipe(clean({force: true}))
      .pipe(notify({ message: 'Cleaned out the .tmp/ and troposphere/assets directories', onLast: true }));
  });

};
