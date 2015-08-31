'use strict';
var gulp = require('gulp');
var del = require('del');

gulp.task('clean-coverage', function () {
  return del('coverage/**/*');
});
gulp.task('clean-docs', function () {
  return del('docs/**/*');
});
