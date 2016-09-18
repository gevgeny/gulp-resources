var cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    glob = require('glob');

var expandResources = function (resourcePath, opts, contentDir) {
    var resources = undefined,
        dirs = [contentDir],
        queryIdx = resourcePath.indexOf('?'),
        query = "";

    if (queryIdx > -1) {
       query = resourcePath.substr(queryIdx);
       resourcePath = resourcePath.substring(0, queryIdx);
    }

    if (typeof opts.cwd === 'string') {
        dirs.push(path.resolve(opts.cwd));
    } else if (Array.isArray(opts.cwd)) {
        opts.cwd.forEach(function (dir) { dirs.push(path.resolve(dir)); });
    } else if (opts.cwd === undefined) {

    } else {
        throw new gutil.PluginError('gulp-resources', 'Unknown type of "cwd".');
    }

    // Strip slash from beginning of the path if exists
    resourcePath = resourcePath.indexOf("/") === 0 ? resourcePath.slice(1) : resourcePath;
    
    _.forEach(dirs, function (dir) {
        resources = glob.sync(resourcePath, { cwd : dir });
        if (resources.length) {
            resources = resources.map(function (resource) { return path.join(dir, resource) + query });
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

        if (opts.js && $element.is('script') && $element.attr('src')) {
            resources = resources.concat(expandResources($element.attr('src'), opts, contentDir));
        }
        if (opts.css && $element.is('link') && ($element.attr('href') || '').indexOf(".css") >= 0) {
            resources = resources.concat(expandResources($element.attr('href'), opts, contentDir));
        }
        if (opts.less && $element.is('link') && ($element.attr('href') || '').indexOf(".less") >= 0) {
            resources = resources.concat(expandResources($element.attr('href'), opts, contentDir));
        }
        if (opts.favicon && $element.is('link') && ($element.attr('rel') || '') === "icon") {
            resources = resources.concat(expandResources($element.attr('href'), opts, contentDir));
        }
    });

    return resources;
};
