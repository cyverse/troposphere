var notify = require('gulp-notify');
var paths = require('../paths');

module.exports = function (gulp) {

  gulp.task('styles', function () {
    return gulp.src(paths.css)
      //.pipe(concat('styles.min.css'))
      //.pipe(minifycss())
      .pipe(gulp.dest('troposphere/assets/css'))
      .pipe(notify({ message: 'Styles task complete', onLast: true }));
  });

};
