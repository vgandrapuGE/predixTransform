var gulp = require('gulp');

//var jshint = require('gulp-jshint');

var ngdocs = require('gulp-ngdocs');
var stylish = require('jshint-stylish');

var paths = {
    app: {
        basePath:       'public/',
        scripts: ['public/app.js',
            'public/app-controller.js',
            'public/modules/**/*.js',
            '!public/**/*.spec.js']
    },
    build: {
        dist:           'dist/',
        docs:           'docs/'
    }
};

// gulp.task('jshint', function(cb){
//     return gulp.src(paths.app.scripts)
//         .pipe(jshint('.jshintrc'))
//         .pipe(jshint.reporter('jshint-stylish'));
// });


gulp.task('docs', function(cb){
    return gulp.src(paths.app.scripts)
        .pipe(ngdocs.process({
            html5Mode: false,
            startPage: '/api'
        }))
        .pipe(gulp.dest(paths.build.docs));
});


gulp.task('scripts:watch', function(){
    gulp.watch(paths.app.scripts, [/*'jshint', */ 'docs']);

});