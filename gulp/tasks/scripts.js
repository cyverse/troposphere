var notify = require('gulp-notify');
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('scripts', function () {
    var dest = (gutil.env.type === 'production' ? '.tmp/js' : 'troposphere/assets/js');

    return gulp.src(paths.scripts)
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Copied scripts to: ' + dest, onLast: true  }));
  });

};
