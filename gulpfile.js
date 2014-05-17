var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
//autoprefixer = require('gulp-autoprefixer'),
//minifycss = require('gulp-minify-css'),
//jshint = require('gulp-jshint'),
//uglify = require('gulp-uglify'),
//rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify');
//cache = require('gulp-cache'),
//livereload = require('gulp-livereload');

var paths = {
  css: 'troposphere/static/css/**',
  scripts: ['troposphere/static/js/**'],
  images: ['troposphere/static/images/**']
};

require('gulp/tasks/styles')(gulp);
require('gulp/tasks/copyScriptsToAssets')(gulp);
require('gulp/tasks/rjs')(gulp);
require('gulp/tasks/images')(gulp);
require('gulp/tasks/clean')(gulp);

// Watch
gulp.task('watch', function () {
  gulp.watch('troposphere/static/css/**', ['styles']);
  gulp.watch('troposphere/static/js/**', ['scripts']);
  gulp.watch('troposphere/static/images/**', ['images']);
});

gulp.task('default', ['clean'], function () {
  gulp.start('styles', 'copyScriptsToAssets', 'images');
});
