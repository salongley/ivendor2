/*
 *
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Development environment (default)
environments.staging = {
    httpPort: 80,
    httpsPort: 443,
    envName: "staging",
    dbName: "ivendor",
    dbUrl: "mongodb://ivendor:pofquv-serxut-3kahDi@ds155825.mlab.com:55825/heroku_pw56xcdr"
};

// production environment
environments.prod = {
    httpPort: 80,
    httpsPort: 443,
    envName: "prod",
    dbName: "ivendor",
    dbUrl: "mongodb://ivendor:pofquv-serxut-3kahDi@ds155825.mlab.com:55825/heroku_pw56xcdr"
};

// local environment
environments.local = {
    httpPort: 8080,
    httpsPort: 8081,
    envName: "local",
    dbName: "ivendor",
    dbUrl: "mongodb://localhost:1337"
};



// Determine which environment is passed as a command line argument
var currentEnvironment =
    typeof process.env.NODE_ENV == "string" ?
    process.env.NODE_ENV.toLowerCase() :
    "";

// check the current environment is one of those above and if not default to dev
var environmentToExport =
    typeof environments[currentEnvironment] == "object" ?
    environments[currentEnvironment] :
    environments.local;

// export environment
module.exports = environmentToExport;