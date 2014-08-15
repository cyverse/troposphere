var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Styles
require('./gulp/tasks/sass')(gulp);
require('./gulp/tasks/sass_noUser')(gulp);

// Scripts
require('./gulp/tasks/scripts')(gulp);
require('./gulp/tasks/bower_components')(gulp);
require('./gulp/tasks/rjs')(gulp);
require('./gulp/tasks/react')(gulp);

// Images
require('./gulp/tasks/images')(gulp);

// Misc
require('./gulp/tasks/clean')(gulp);
require('./gulp/tasks/watch')(gulp);

// Copy old Arturo/CF2 UI into assets directory
require('./gulp/tasks/cf2')(gulp);

//
// Gulp Configurations
//

gulp.task('default', function () {

  runSequence(
    'clean',
    ['sass', 'sass_noUser', 'scripts', 'bower_components', 'react', 'images', 'cf2']
  );

});

gulp.task('prod', function () {
  gutil.env.type = 'production';

  runSequence(
    'clean',
    ['sass', 'sass_noUser', 'scripts', 'bower_components', 'react', 'images', 'cf2'],
    'rjs:prod'
  );

});
