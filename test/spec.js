var assert = require("assert"),
    gulp = require('gulp'),
    fs = require('fs'),
    through = require('through2'),
    resources = require('../');

var toArray = function (buffer) {
    return through.obj(function (file, enc, cb) {
        var queryIdx = file.path.indexOf('?');
        queryIdx = queryIdx < 0 ? file.path.length : queryIdx;
        buffer.push(fs.readFileSync(file.path.substring(0, queryIdx)).toString('utf8'));
        cb();
    });
};

var getExpected = function (caseName) {
    return JSON.parse(fs.readFileSync('./test/cases/' + caseName + '/expected.json').toString('utf8'));
};


describe('gulp-resources', function () {
    it('should extract js, css, less resources and return source file itself with default opts', function (cb) {
        var actual = [], expected = getExpected('case1');
        gulp.src('./test/cases/case1/content.html')
            .pipe(resources())
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should extract only resources when opts.src is false', function (cb) {
        var actual = [], expected = getExpected('case2');

        gulp.src('./test/cases/case2/content.html')
            .pipe(resources({ src: false }))
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should extract only js resources when opts.less and opts.css are false', function (cb) {
        var actual = [], expected = getExpected('case3');

        gulp.src('./test/cases/case3/content.html')
            .pipe(resources({ less: false, css: false, src: false }))
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should extract only css resources when opts.js and opts.less are false', function (cb) {
        var actual = [], expected = getExpected('case4');

        gulp.src('./test/cases/case4/content.html')
            .pipe(resources({ js: false, less: false, src: false }))
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should extract only less resources when opts.js and opts.css are false', function (cb) {
        var actual = [], expected = getExpected('case5');

        gulp.src('./test/cases/case5/content.html')
            .pipe(resources({ js: false, css: false, src: false }))
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should extract favicon when opts.favicon is true', function (cb) {
        var actual = [], expected = getExpected('case6');

        gulp.src('./test/cases/case6/content.html')
            .pipe(resources({ favicon: true, src: false, js: false, css: false, less: false}))
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should emit error when specified resource does not exist', function (cb) {
        gulp.src('./test/cases/case7/content.html')
            .pipe(resources())
            .on('error', function (args) {
                assert.deepEqual(args.message, 'File scripts2/not-existing-script.js does not exist.');
                cb();
            });
    });
    it('should not emit "File does not exist" error when opts.skipNotExistingFiles is true', function (cb) {
        var actual = [], expected = getExpected('case8');

        gulp.src('./test/cases/case8/content.html')
            .pipe(resources({ src: false, skipNotExistingFiles: true }))
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should search resources in opts.cwd directory as well', function (cb) {
        var actual = [], expected = getExpected('case9');

        gulp.src('./test/cases/case9/content.html')
            .pipe(resources({ src: false, cwd: './test/cases/case9/another-dir' }))
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should search resources in opts.cwd directories as well', function (cb) {
        var actual = [], expected = getExpected('case10');

        gulp.src('./test/cases/case10/content.html')
            .pipe(resources({ src: false, cwd: ['./test/cases/case10/another-dir1','./test/cases/case10/another-dir2'] }))
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
    it('should extract js, css, less resources and return source file itself with default opts', function (cb) {
        var actual = [], expected = getExpected('case11');
        gulp.src('./test/cases/case11/content.html')
            .pipe(resources())
            .pipe(toArray(actual))
            .on('finish', function () {
                assert.deepEqual(actual, expected);
                cb();
            });
    });
});