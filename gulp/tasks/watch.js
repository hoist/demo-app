'use strict';
var gulp = require('gulp');
var globs = require('../globs');
var runSequence = require('run-sequence');
var loadPlugins = require('gulp-load-plugins');
var plugins = loadPlugins();

gulp.task('watch', function (callback) {
  var spawn = require('child_process').spawn;
  var bunyan;
  var watching = false;
  runSequence('mocha-server-continue', function () {
    if (!watching) {
      console.log('running watch');
      gulp.watch(globs.js.Gulpfile, ['eslint']);
      gulp.watch(globs.specs.concat(globs.js.lib), ['eslint', 'mocha-server-continue']);
      console.log('running nodemon');
      plugins.nodemon({
        script: '.bin/www',
        ext: 'js hbs',
        watch: ['lib/**/*.js*', 'lib/**/*.hbs*'],
        ignore: ['**/assets/**/*'],
        env: {
          'NODE_HEAPDUMP_OPTIONS': 'nosignal',
          'NODE_ENV': 'development'
        },
        stdout: false
      }).on('restart', function () {
        setTimeout(plugins.livereload.reload, 1000);
      }).on('readable', function () {
        // free memory
        if (bunyan) {
          bunyan.kill();
        }
        var level = 'info';
        if (process.env.DEBUG) {
          level = 'debug';
        }
        bunyan = spawn('./node_modules/.bin/bunyan', [
          '--output', 'short',
          '--color',
          '-l', level
        ]);
        bunyan.stdout.pipe(process.stdout).on('error', function (err) {
          console.log(4, err);
        });
        bunyan.stderr.pipe(process.stderr).on('error', function (err) {
          console.log(3, err);
        });
        this.stdout.pipe(bunyan.stdin).on('error', function (err) {
          console.log(1, err);
        });
        this.stderr.pipe(bunyan.stdin).on('error', function (err) {
          console.log(2, err);
        });
      }).on('error', function (err) {
        console.log(err);
      });
      callback();
    }
  });
});
