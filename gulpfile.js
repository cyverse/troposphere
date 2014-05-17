var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
//autoprefixer = require('gulp-autoprefixer'),
//minifycss = require('gulp-minify-css'),
//jshint = require('gulp-jshint'),
//uglify = require('gulp-uglify'),
//imagemin = require('gulp-imagemin'),
//rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  rjs = require('requirejs'),
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

//gulp.task('styles', function(){
//  return gulp.src(paths.css)
//    //.pipe(concat('styles.min.css'))
//    //.pipe(minifycss())
//    .pipe(gulp.dest('troposphere/assets/css'))
//    .pipe(notify({ message: 'Styles task complete', onLast: true }));
//});

// Scripts
gulp.task('copyScriptsToAssets', function () {
  return gulp.src(paths.scripts)
    .pipe(gulp.dest('troposphere/assets/js'))
    .pipe(notify({ message: 'Copied scripts to troposphere/assets', onLast: true  }));
});

gulp.task('scripts', ['copyScriptsToAssets']);
//gulp.task('scripts', ['copyScriptsToAssets'], function () {
//  return gulp.src(['troposphere/static/js/analytics.js'])
//    //.pipe(uglify())
//    .pipe(gulp.dest('troposphere/assets/js'))
//    .pipe(notify({ message: 'Scripts task complete' }));
//});

// RequireJS
gulp.task('requirejsBuild', function (cb) {
  rjs.optimize({
    appDir: 'troposphere/static/js',
    baseUrl: './',
    mainConfigFile: "troposphere/static/js/main.js",
    dir: "troposphere/assets/js",
    removeCombined: true,
    optimize: 'none',
    modules: [
      {
        name: "main"
      }
    ]
  }, function(buildResponse){
    cb();
  }, cb);
});

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