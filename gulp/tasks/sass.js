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
var sass = require('gulp-ruby-sass');
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('sass', function (done) {
    var dest = (gutil.env.type === 'production' ? '.tmp/css/app' : 'troposphere/assets/css/app');

    return gulp.src(paths.rootSassFileForApp)
      .pipe(sass({sourcemap: true}))
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Transformed SCSS to CSS and copied files to: ' + dest, onLast: true }))
  });

};
