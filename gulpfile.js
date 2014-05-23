var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Styles
require('./gulp/tasks/sass')(gulp);

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

//
// Gulp Configurations
//

gulp.task('default', function () {

  runSequence(
    'clean',
    ['sass', 'scripts', 'bower_components', 'react', 'images']
  );

});

gulp.task('prod', function () {
  gutil.env.type = 'production';

  runSequence(
    'clean',
    ['sass', 'scripts', 'bower_components', 'react', 'images'],
    'rjs:dev'
  );

});
