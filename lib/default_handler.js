/*
 * Request Handlers for errors and ping
 *
 *
 */
var fs = require("fs");
var path = require("path");

// define all the handlers

var handlers = {};

//Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Test handler used to show Node JS App is up and running
handlers._health = function (data, callback) {
    callback(200);
};

handlers.index = function (data, callback) {
    var dir = path.join(__dirname, '/../dist/');
    fs.readFile(dir + 'index.html', 'utf8', function (err, str) {
        if (!err && str && str.length > 0) {
            callback(200, str, 'html');
        }
    });


};

// export module
module.exports = handlers;