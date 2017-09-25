'use strict';

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  babel = require("gulp-babel"),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  rename = require("gulp-rename"),
  autoprefixer = require('gulp-autoprefixer');

const autoprefixerOptions = {
  browsers: ['last 2 versions'],
  cascade: false
};

gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('./style/'))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./style/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("babel", function () {
  return gulp.src("./scriptES6/index.js")
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest("./script/"))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest("./script/"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('project:watch', function () {

  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./scriptES6/index.js', ['babel']);
  gulp.watch(["*.html", "./sass/**/*.scss", "./scriptES6/index.js"]).on('change', browserSync.reload);
});