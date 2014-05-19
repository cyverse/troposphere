/**
 * Move all images to specified directory
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copy the images to destination directory
 *
 * # prod task config
 * Minify the images, then copy to destination directory.
 *
 */

var paths = require('../paths');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');

module.exports = function (gulp) {

  var destDirectory = 'troposphere/assets/images';

  gulp.task('images', function () {
    return gulp.src(paths.images)
      .pipe(gulp.dest(destDirectory))
      .pipe(notify({ message: 'Images build task complete', onLast: true }));
  });

  gulp.task('images:prod', function () {
    return gulp.src(paths.images)
      .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
      .pipe(gulp.dest(destDirectory))
      .pipe(notify({ message: 'Images build task complete', onLast: true }));
  });

};
