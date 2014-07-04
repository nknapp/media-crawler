
var unravel = require('unravel');
var path = require('path');
var merge = require('merge');
var async = require('async');

/**
 * @param rootDir the directory to be scanned
 * @param callback a function that is called for "bulksize" number of files.
 *    It receives an object "{ rootDir: "...", files: [...] }"  as first parameter and a callback as second parameter.
 * @param options {Object} optional settings passed to the crawler
 * @param options.concurrency {Number} maximal number of parallel executions
 * @param options.bulkSize {Number} maximal number of files to send to callback at a time.
 * @param options.filter {Function} a function that is executed for each file. Receives the file as first parameter.
 *    It should return false, if the file should be ommitted and true otherwise.
 * @param options.error {Function} an error callback
 *
 */
function crawl(rootDir, callback, options) {

    // apply default options
    options = merge({
        concurrency: 4,
        bulkSize: 10,
        filter: function() { return true; },
        error: function (err) {
            console.log(err);
        }
    },options);

    // initialize queue to limit number of parallel executions
    var queue = async.queue(callback, options.concurrency);

    // file collector and flush-helper-function
    var files = [];
    function flush() {
        queue.push({
            rootDir: rootDir,
            files: files
        });
        files=[];
    }

    // absolute root directory
    var absRootDir = path.resolve(rootDir);
    unravel.dir(rootDir);

    // file traversed: Push to list and flush if needed
    unravel.on('file', function (file) {
        // Ignore filtered files
        if (!options.filter(file)) {
            return;
        }
        files.push(path.relative(absRootDir,path.resolve(file)));
        if (files.length > options.bulkSize) {
            flush();
        }
    });

    unravel.on('end', flush);
    unravel.on('error', options.error);


}

module.exports = crawl;

