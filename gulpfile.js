var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

// Styles
require('./gulp/tasks/styles')(gulp);
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

gulp.task('default', ['clean'], function () {
  gulp.start('sass', 'copyScriptsToAssets', 'copyBowerComponentsToAssets', 'react', 'images');
});

gulp.task('prod', ['clean'], function () {
  gulp.start('sass', 'scripts', 'bower_components', 'react', 'images');
});