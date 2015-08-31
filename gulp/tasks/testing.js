'use strict';
var gulp = require('gulp');
var path = require('path');
var loadPlugins = require('gulp-load-plugins');
var globs = require('../globs');
var helpers = require('../helpers');
var isparta = require('isparta');
var notifierReporter = require('mocha-notifier-reporter');

var plugins = loadPlugins();

function runMocha(options) {
  options = options || {};
  options.require = options.require || [];
  options.require = options.require.concat([path.resolve(__dirname, '../../tests/bootstrap.js')]);
  options.reporter = options.reporter || notifierReporter.decorate('spec');
  return gulp.src(globs.specs, {
      read: false
    })
    .pipe(plugins.plumber({
      errorHandler: options.errorHandler || helpers.errorHandler
    }))
    .pipe(plugins.mocha(options));
}

gulp.task('mocha-server', ['eslint', 'clean-coverage'], function (cb) {
  require("babel/register");
  try {
    gulp.src(globs.js.lib)
      .pipe(plugins.plumber({
        errorHandler: function (err) {
          cb(err);
        }
      }))
      .pipe(plugins.istanbul({
        instrumenter: isparta.Instrumenter
      }))
      .pipe(plugins.istanbul.hookRequire())
      .on('finish', function () {
        runMocha({
            errorHandler: function (err) {
              cb(err);
            }
          })
          .pipe(plugins.plumber.stop())
          .pipe(plugins.istanbul.writeReports())
          .pipe(plugins.istanbul.enforceThresholds({
            thresholds: {
              global: 70
            }
          }))
          .on('end', cb);
      });
  } catch (err) {
    cb(err);
  }
});
gulp.task('mocha-server-without-coverage', ['eslint'], function () {
  require("babel/register");
  return runMocha();
});
var withCoverage = false;
gulp.task('mocha-server-continue', ['eslint', 'clean-coverage'], function (cb) {
  require("babel/register")();
  var ended;
  if (!withCoverage) {
    runMocha({
      errorHandler: function (err) {
        console.log(err, err.stack);
        console.log('emitting end');
        this.emit('end');
      }
    }).on('end', function () {
      if (!ended) {
        console.log('ending test');
        ended = true;
        cb();
      }
    });
  } else {
    gulp.src(globs.js.lib)
      .pipe(plugins.plumber({
        errorHandler: helpers.errorHandler
      }))
      .pipe(plugins.istanbul({
        instrumenter: isparta.Instrumenter
      }))
      .pipe(plugins.istanbul.hookRequire())
      .on('finish', function () {
        require("babel/register")({
          optional: ['es7.objectRestSpread']
        });
        //ensure the task finishes after 2 minutes at the most
        var timeout = setTimeout(function () {
          if (!ended) {
            ended = true;
            cb();
          }
        }, 120000);
        runMocha({
            errorHandler: function () {
              console.log('emitting end');
              this.emit('end');
            }
          })
          .pipe(plugins.istanbul.writeReports())
          .on('end', function () {
            if (timeout) {
              clearTimeout(timeout);
              timeout = undefined;
            }
            if (!ended) {
              console.log('ending test');
              ended = true;
              cb();
            }
          });
      });
  }
});
