'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');

var paths = {
    app: {
        basePath:       'public/',
        styles:         ['public/styles/**/*.scss','public/modules/**/*.scss']
    }
};

gulp.task('sass', function(cb){
    return gulp.src(paths.app.styles)
        .pipe(sass({includePaths: ['./public/bower_components/']}).on('error', sass.logError))
        .pipe(gulp.dest(paths.app.basePath + 'styles'));
});

gulp.task('sass:watch', function(){
    gulp.watch(paths.app.styles, ['sass']);
});