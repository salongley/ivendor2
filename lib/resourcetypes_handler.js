/*
 * Request Handlers for Resource Types
 *
 *
 */

// Dependencies
var http = require("http");
var url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var MongoClient = require("mongodb").MongoClient;

// define all the handlers

var handlers = {};

/*
 * resourceTypes Handlers
 */

handlers.resourceTypes = function (data, callback) {
    var acceptableMethods = ["POST", "GET", "PUT", "DELETE"];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers.resourceTypes[data.method](data, callback);
    } else {
        callback(405); // method not allowed error
    }
};

//Container for resourceTypes sub methods
handlers._resourceTypes = {};

//resourceTypes POST methods
handlers._resourceTypes.POST = function (data, callback) {};

//resourceTypes GET methods
handlers._resourceTypes.GET = function (data, callback) {
    // check the path of the countries method to see if we need to get all the resourceTypes or a specific one

    if (data.trimmedPath == "/resourceTypes") {
        // ALL the countries
        MongoClient.connect(
            config.dbUrl, {
                useNewUrlParser: true
            },
            function (err, db) {
                if (err) throw err;
                var dbo = db.db(config.dbName);
                dbo
                    .collection("resourceTypes")
                    .find({})
                    .toArray(function (err, result) {
                        if (err) throw err;
                        callback(200, result);
                        db.close();
                    });
            }
        );
    } else {
        var resourceTypes = data.params[0];
        MongoClient.connect(
            config.dbUrl, {
                useNewUrlParser: true
            },
            function (err, db) {
                if (err) throw err;
                var dbo = db.db(config.dbName);
                var myquery = {
                    resourceTypes: resourceTypes
                };

                dbo
                    .collection("resourceTypes")
                    .find(myquery)
                    .toArray(function (err, result) {
                        if (err) throw err;
                        callback(200, result[0]);
                        db.close();
                    });
            }
        );
    }
};

//resourceTypes PUT
handlers._resourceTypes.PUT = function (data, callback) {};

//resourceTypes DELETE
handlers._resourceTypes.DELETE = function (data, callback) {};

//Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Test handler used to show Node JS App is up and running
handlers.ping = function (data, callback) {
    callback(200);
};

// export module
module.exports = handlers;