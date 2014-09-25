var through = require('through2'),
    gutil = require('gulp-util'),
    resources = require('./libs/resources'),
    path = require('path'),
    fs = require('fs');

module.exports = function (opts) {
    opts = opts || {};

    return through.obj(function (file, enc, cb) {
        var content,
            that = this,
            extraсtedResources;

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-resources', 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
            content = file.contents.toString('utf8');
            try {
                extraсtedResources = resources(content, opts, path.dirname(file.path));
            } catch (ex) {
                this.emit('error', ex);
                return cb();
            }

            extraсtedResources.forEach(function (resource) {
                that.push(new gutil.File({
                    base: file.base,
                    cwd: file.cwd,
                    path: resource,
                    contents: fs.readFileSync(resource)
                }));
            });
        }
        cb();
    });
};