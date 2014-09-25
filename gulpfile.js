var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    resources = require('./index');

gulp.task('resources', function () {
    return gulp.src('./test/cases/**/*.html')
        .pipe(resources({ cwd: 'test/cases' }))
        .pipe(gulp.dest('./test/tmp'));
});

gulp.task('test', function () {
    return gulp.src('./test/*.js')
        .pipe(mocha());
});

gulp.task('default', ['resources']);