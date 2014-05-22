var notify = require('gulp-notify');
var sass = require('gulp-ruby-sass');
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('sass', function () {
    var dest = (gutil.env.type === 'production' ? '.tmp/css/app' : 'troposphere/assets/css/app');
    return gulp.src(paths.rootSassFileForApp)
      .pipe(sass({sourcemap: true}))
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Sass task complete, copied files to: ' + dest, onLast: true }));
  });

};
