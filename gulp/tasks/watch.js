/**
 * Delete specified directories and all files in them.
 *
 * ---------------------------------------------------------------
 *
 */

var clean = require('gulp-clean');
var paths = require('../paths');

module.exports = function (gulp) {

  gulp.task('watch', function () {
    gulp.watch(paths.css, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
  });

};
