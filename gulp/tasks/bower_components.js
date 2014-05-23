/**
 * Copy bower_components files to the destination directory.
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
var paths = require('../paths');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  gulp.task('bower_components', function (done) {
    var dest = (gutil.env.type === 'production' ? '.tmp/bower_components' : 'troposphere/assets/bower_components');

    return gulp.src(paths.bowerComponents)
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Copied bower_components to: ' + dest, onLast: true  }));
  });

};
