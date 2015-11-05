var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer');

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});
