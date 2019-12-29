/*
 * Server related functions
 *
 */

// Import require packages

var http = require("http");
var https = require("https");
var url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var fs = require("fs");
var path = require("path");


// import the handlers
var default_handler = require("./default_handler");
// var country_handler = require("./country_handler");
//var resourceTypes_handlers = require("./resourcetypes_handler");
//var vendors_handlers = require("./vendors_handler");
//var jobs_handlers = require("./jobs_handler");
//var invoices_handlers = require("./invoices_handler");

// create http server

var server = {};
//Instatiate http server
server.httpServer = http.createServer(function (req, res) {

    server.unifiedServer(req, res);

});

server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
}
// Instantiate https server
//server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {

  //  server.unifiedServer(req, res);

//});
server.unifiedServer = function (req, res) {
    //Get the URL and Parse it

    // Parse the url
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the paramaters from the url by stripping the first part of the path and turning it into
    //an array. So the URL /countries/UK/London will become ['UK','London']

    var params = trimmedPath.substr(trimmedPath.indexOf("/", 1) + 1);
    params = params.split("/");

    //Update trimmedPath to just show the first path. So /countries/UK becomes /countries
    trimmedPath = "/" + params[0];


    //Get HTTP method
    var method = req.method.toUpperCase();

    // Get headers as an object
    var headers = req.headers;

    //Get payload, if any
    var decoder = new StringDecoder("utf-8");
    var buffer = "";
    req.on("data", function (data) {
        buffer += decoder.write(data);
    });

    req.on("end", function () {
        buffer += decoder.end();
    });

    //Get query string as an object
    var queryStringObject = parsedUrl.query;

    // send the response

    var chosenHandler = typeof (server.router[trimmedPath]) !== "undefined" ? server.router[trimmedPath] : default_handler.notFound;

    // construct data object to send to handlers
    var data = {
        trimmedPath: trimmedPath,
        params: params,
        queryStringObject: queryStringObject,
        method: method,
        headers: headers,
        payload: buffer
    };

    // Route the request handler specified in the router

    chosenHandler(data, function (statusCode, payload, contentType) {
        // use the statusCode called back by the handler, or default to 200
        statusCode = typeof statusCode == "number" ? statusCode : 200;
        // use the payload called back by the handler or default to an empty queryStringObject
        // Determine the type of response (fallback to JSON)
        contentType = typeof contentType == "string" ? contentType : "json";

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof statusCode == "number" ? statusCode : 200;

        // Return the response parts that are content-type specific
        var payloadString = "";
        if (contentType == "json") {
            res.setHeader("Content-Type", "application/json");
            payload = typeof payload == "object" ? payload : {};
            payloadString = JSON.stringify(payload);
        }

        if (contentType == "html") {
            res.setHeader("Content-Type", "text/html");
            payloadString = typeof (payload) == "string" ? payload : "";
        }

        if (contentType == "favicon") {
            res.setHeader("Content-Type", "image/x-icon");
            payloadString = typeof (payload) !== "undefined" ? payload : "";
        }

        if (contentType == "plain") {
            res.setHeader("Content-Type", "text/plain");
            payloadString = typeof (payload) !== "undefined" ? payload : "";
        }

        if (contentType == "css") {
            res.setHeader("Content-Type", "text/css");
            payloadString = typeof (payload) !== "undefined" ? payload : "";
        }

        if (contentType == "png") {
            res.setHeader("Content-Type", "image/png");
            payloadString = typeof (payload) !== "undefined" ? payload : "";
        }

        if (contentType == "jpg") {
            res.setHeader("Content-Type", "image/jpeg");
            payloadString = typeof (payload) !== "undefined" ? payload : "";
        }

        payload = typeof (payload) == "object" ? payload : {};



        // Return the response

        res.writeHead(statusCode);
        res.end(payloadString);

        console.log("Returning this response: ", statusCode, payloadString);
    });


};

// Define request router
server.router = {
    "/": default_handler.index,
    "/_health": default_handler._health,
    "/countries": country_handler.countries,
    //"/resourceTypes": resourcetypes_handler.resourceTypes,
    // "/vendors": vendors_handler.vendors,
    // "/jobs": jobs_handler.jobs,
    // "/invoices": invoices_handler.invoices
};



server.init = function () {
    //start the http server
    server.httpServer.listen(config.httpPort, function () {
        console.log(
            "Node server listening on port " + config.httpPort + " in " + config.envName
        );
    });

    //start the https server
    server.httpsServer.listen(config.httpsPort, function () {
        console.log(
            "Node https server listening on port " + config.httpsPort + " in " + config.envName
        );
    });
};
// Export module

module.exports = server;