'use strict';

var gulp = require('gulp');
var karma = require('karma');
var shell = require('gulp-shell');

gulp.task('test:unit', function (cb) {
    var karmaServer = new karma.Server({
        configFile: __dirname + '/../karma.conf.js',
        singleRun: true
    });
    karmaServer.start();
});


gulp.task('test:backend', shell.task('mocha test'));

gulp.task('web-driver:update', shell.task('webdriver-manager update'));

gulp.task('test:e2e', [ 'web-driver:update' ], function(cb) {
    return gulp.src(__dirname + '/../test/e2e/**/*.js', {read:false})
        .pipe(shell(['protractor']));
});

gulp.task('test', ['test:unit', 'test:backend', 'test:e2e']);


