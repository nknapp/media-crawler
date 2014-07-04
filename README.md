Image-Crawler
=============
This is a simple file crawler that uses exiftool to read metadata from all files in a subtree and post it to a rest-service.
The rest-service is not included...

The rest-service
----------------
The rest-service is not included. The crawler is intended for a personal image gallery project that I'm attempting 
to implement with the software of the company I'm working at: [k-infinity](http://www.k-infinity.de/) (the page is german only)

The rest-service should accept the output of "exiftool -G -j file ..." as body of a POST-Request 
(see [this json created of the example data](example/exiftool.json)). 
It must return a similar json with tags to be stored into each file (using "exiftool -G -j=-" ). See
[this json of an example response](example/response.json)).

Usage
-----
    # Tested with Ubuntu 14.04
    sudo apt-get install libimage-exiftool-perl

    npm install
    node src/main.js conf/crawler.yml

