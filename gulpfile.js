'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  autoprefixer = require('gulp-autoprefixer');

var autoprefixerOptions = {
  browsers: ['last 2 versions'],
  cascade: false
};

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass:watch', function () {

  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch("*.html").on('change', browserSync.reload);
  
});