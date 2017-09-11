'use strict';

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  babel = require("gulp-babel"),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer');

const autoprefixerOptions = {
  browsers: ['last 2 versions'],
  cascade: false
};

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('./css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("babel", function () {
  return gulp.src("./script/index.js")
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest("./scriptES5/"));
});

gulp.task('sass:watch', function () {

  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./script/index.js', ['babel']);
  gulp.watch("*.html").on('change', browserSync.reload);

});