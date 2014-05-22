var notify = require('gulp-notify');
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('bower_components', function () {
    var dest = (gutil.env.type === 'production' ? '.tmp/bower_components' : 'troposphere/assets/bower_components');

    return gulp.src(paths.bowerComponents)
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Copied bower_components to: ' + dest, onLast: true  }));
  });

};
