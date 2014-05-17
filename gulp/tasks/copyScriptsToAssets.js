var notify = require('gulp-notify');
var paths = require('../paths');

module.exports = function (gulp) {

  gulp.task('copyScriptsToAssets', function () {
  return gulp.src(paths.scripts)
    .pipe(gulp.dest('troposphere/assets/js'))
    .pipe(notify({ message: 'Copied scripts to troposphere/assets', onLast: true  }));
});

};
