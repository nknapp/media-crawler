var yaml = require('yamljs');
var crawler = require('./crawler');
var request = require('request');
var child = require('child_process');
var mime = require('mime');

// Load configuration
var config = yaml.load(process.argv[2]);
console.log(config);


crawler(config.root, function(data, callback) {
    // Child process to read exif data
    var exifRead = child.execFile("exiftool", ["-G","-j"].concat(data.files), {
        cwd: data.rootDir
    });
    // Http-Request to make a request to add the metadata to the database
    var addToGallery = request.post(config.postUrl);
    // Child process to write exif-data back to the file
    var exifWrite = child.execFile("exiftool", ["-G", "-j=-"].concat(data.files), {
        cwd: data.rootDir
    });
    console.log(data.files);
    var stream = exifRead.stdout.pipe(addToGallery);
    exifRead.on("exit", function() {
        stream.pipe(exifWrite.stdin);
    });
    exifWrite.on("exit", callback);
}, {
    filter: function(file) {
        return !file.match(/\.cache/) && mime.lookup(file).match(/^(video|image)\/.*/);
    }
});
