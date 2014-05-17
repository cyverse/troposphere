var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
//autoprefixer = require('gulp-autoprefixer'),
//minifycss = require('gulp-minify-css'),
//jshint = require('gulp-jshint'),
//uglify = require('gulp-uglify'),
//imagemin = require('gulp-imagemin'),
//rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify');
//cache = require('gulp-cache'),
//livereload = require('gulp-livereload');

var paths = {
  css: 'troposphere/static/css/**',
  scripts: ['troposphere/static/js/**'],
  images: ['troposphere/static/images/**']
};

// Styles
require('gulp/tasks/styles')(gulp);

// Scripts
require('gulp/tasks/copyScriptsToAssets')(gulp);

//gulp.task('scripts', ['copyScriptsToAssets']);
require('gulp/tasks/rjs')(gulp);

// Images
gulp.task('images', function () {
  return gulp.src(paths.images)
    //.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('troposphere/assets/images'))
    .pipe(notify({ message: 'Images build task complete', onLast: true }));
});

// Clean
gulp.task('clean', function () {
  return gulp.src(['troposphere/assets'], {read: false})
    .pipe(clean({force: true}));
});

// Watch
gulp.task('watch', function () {
  gulp.watch('troposphere/static/css/**', ['styles']);
  gulp.watch('troposphere/static/js/**', ['scripts']);
  gulp.watch('troposphere/static/images/**', ['images']);
});



gulp.task('default', ['clean'], function () {
  //gulp.start('styles', 'scripts', 'images');
  gulp.start('requirejsBuild');
});

gulp.task('dev', ['clean'], function () {
  gulp.start('styles', 'scripts', 'images');
});

//gulp.task('default', ['clean', 'requirejsBuild']);