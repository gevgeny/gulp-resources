var cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    glob = require('glob');

var expandResources = function (resourcePath, opts, contentDir) {
    var paths = [], resources = undefined,
        dirs = [contentDir];

    if (typeof opts.base === 'string') {
        dirs.push(path.resolve(opts.base));
    } else if (Array.isArray(opts.base)) {
        dirs.forEach(function (dir) { dirs.push(path.resolve(dir)); });
    } else if (opts.base === undefined) {

    } else {
        throw new gutil.PluginError('gulp-resources', 'Unknown type of "base".');
    }

    _.forEach(dirs, function (dir) {
        resources = glob.sync(resourcePath, { cwd : dir });
        if (resources.length) {
            resources = resources.map(function (resource) { return path.join(dir, resource) });
            return false;
        }
    });

    if (!resources.length && !opts.skipNotExistingFiles) {
        throw new gutil.PluginError('gulp-resources', 'File ' + resourcePath + ' does not exist.');
    }

    return resources;
};

module.exports = function (content, opts, contentDir) {
    var $ = cheerio.load(content), resources = [];

    $('script,link').each(function (i, element) {
        var $element = $(element);

        if ($element.is('script') && $element.attr('src')) {
            resources = resources.concat(expandResources($element.attr('src'), opts, contentDir));
        }
        if ($element.is('link') && $element.attr('href')) {
            resources = resources.concat(expandResources($element.attr('href'), opts, contentDir));
        }
    });

    return resources;
};