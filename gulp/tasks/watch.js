/**
 * Delete specified directories and all files in them.
 *
 * ---------------------------------------------------------------
 *
 */

var paths = require('../paths');

module.exports = function (gulp) {

  gulp.task('watch', function () {
    gulp.watch(paths.css, ['sass']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.cf2, ['cf2']);
    gulp.watch(paths.jsxTemplates, ['react']);
    gulp.watch(paths.tests, ['tests']);
  });

};
