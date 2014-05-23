/**
 * Copy images to the destination directory
 *
 * ---------------------------------------------------------------
 *
 * # default task config
 * Copy files directly to the assets directory for easier development.
 *
 * # prod task config
 * Minify the images, then copy them to the .tmp directory where r.js will take over.
 *
 */

var paths = require('../paths');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('images', function (done) {
    var dest = (gutil.env.type === 'production' ? '.tmp/images' : 'troposphere/assets/images');

    return gulp.src(paths.images)
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Copied images to: ' + dest, onLast: true }));
  });

//  gulp.task('images:prod', function () {
//    return gulp.src(paths.images)
//      .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
//      .pipe(gulp.dest(destDirectory))
//      .pipe(notify({ message: 'Images build task complete', onLast: true }));
//  });

};
