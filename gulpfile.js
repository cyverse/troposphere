var gulp = require('gulp'),
  sass = require('gulp-ruby-sass');

require('gulp/tasks/styles')(gulp);
require('gulp/tasks/copyScriptsToAssets')(gulp);
require('gulp/tasks/rjs')(gulp);
require('gulp/tasks/images')(gulp);
require('gulp/tasks/clean')(gulp);
require('gulp/tasks/watch')(gulp);

gulp.task('default', ['clean'], function () {
  gulp.start('styles', 'copyScriptsToAssets', 'images');
});
