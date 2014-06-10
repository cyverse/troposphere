/**
 * Transform SASS files to CSS and copy result to destination directory.
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
var sass = require('gulp-sass');
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('sass_noUser', function (done) {
    var dest = (gutil.env.type === 'production' ? '.tmp/css' : 'troposphere/assets/css');

    return gulp.src(paths.rootSassFileForNoUser)
      .pipe(sass({
        sourceMap: 'sass',
        sourceComments: 'map'
      }))
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Transformed SCSS to CSS and copied files to: ' + dest, onLast: true }))
  });

};
