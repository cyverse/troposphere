/**
 * Delete specified directories and all files in them.
 *
 * ---------------------------------------------------------------
 *
 */

var clean = require('gulp-clean');

module.exports = function (gulp) {

  gulp.task('clean', function () {
    return gulp.src(['troposphere/assets', '.tmp'], {read: false})
      .pipe(clean({force: true}));
  });

};
