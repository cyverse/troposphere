var notify = require('gulp-notify');
var paths = require('../paths');

module.exports = function (gulp) {

  gulp.task('copyBowerComponentsToAssets', function () {
  return gulp.src(paths.bowerComponents)
    .pipe(gulp.dest('troposphere/assets/bower_components'))
    .pipe(notify({ message: 'Copied bower_components to troposphere/assets', onLast: true  }));
});

};
