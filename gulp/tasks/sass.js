var notify = require('gulp-notify');
var sass = require('gulp-ruby-sass');
var paths = require('../paths');

module.exports = function (gulp) {

  gulp.task('sass', function () {
    return gulp.src(paths.rootSassFileForApp)
      .pipe(sass({sourcemap: true}))
      .pipe(gulp.dest('troposphere/assets/css/app'))
      .pipe(notify({ message: 'Sass task complete', onLast: true }));
  });

};
