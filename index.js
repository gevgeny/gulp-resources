var through = require('through2'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),

    resources = require('./libs/resources');

module.exports = function (opts) {
    var defineOpt = function (optName, defaultValue) {
        opts[optName] = optName in opts ? opts[optName] : defaultValue;
    };

    opts = opts || {};
    defineOpt('js', true);
    defineOpt('css', true);
    defineOpt('less', true);
    defineOpt('favicon', false);
    defineOpt('src', true);
    defineOpt('skipNotExistingFiles', false);
    defineOpt('appendQueryToPath', false);

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
                var queryIdx = resource.indexOf('?'),
                    query = "";

                if (queryIdx > -1) {
                    query = resource.substr(queryIdx);
                    resource = resource.substring(0, queryIdx);
                }
                that.push(new gutil.File({
                    base: file.base,
                    cwd: file.cwd,
                    stat: file.stat,
                    path: resource + (opts.appendQueryToPath ? query : ""),
                    contents: fs.readFileSync(resource)
                }));
            });
        }
        if (opts.src) {
            this.push(file);
        }
        cb();
    });
};
