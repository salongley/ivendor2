/*
 * Request Handlers for Country
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
 * Country Handlers
 */

handlers.countries = function (data, callback) {
    var acceptableMethods = ["POST", "GET", "PUT", "DELETE"];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._countries[data.method](data, callback);
    } else {
        callback(405); // method not allowed error
    }
};

//Container for country sub methods
handlers._countries = {};

//Country POST methods
handlers._countries.POST = function (data, callback) {};

//Country GET methods
handlers._countries.GET = function (data, callback) {
    // check the path of the countries method to see if we need to get all the countries or a specific one

    if (data.trimmedPath == "/countries") {
        // ALL the countries
        MongoClient.connect(
            config.dbUrl, {
                useNewUrlParser: true
            },
            function (err, db) {
                if (err) throw err;
                var dbo = db.db(config.dbName);
                dbo
                    .collection("countries")
                    .find({})
                    .toArray(function (err, result) {
                        if (err) throw err;
                        callback(200, result);
                        db.close();
                    });
            }
        );
    } else {
        var country = data.params[0];
        MongoClient.connect(
            config.dbUrl, {
                useNewUrlParser: true
            },
            function (err, db) {
                if (err) throw err;
                var dbo = db.db(config.dbName);
                var myquery = {
                    country: country
                };

                dbo
                    .collection("countries")
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

//Country PUT
handlers._countries.PUT = function (data, callback) {};

//Country DELETE
handlers._countries.DELETE = function (data, callback) {};



// export module
module.exports = handlers;