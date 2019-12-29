/*
 *
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Development environment (default)
environments.staging = {
    httpPort: 80,
    httpsPort: 3001,
    envName: "staging",
    dbName: "ivendor",
    dbUrl: "mongodb://ivendor:pofquv-serxut-3kahDi@ds155825.mlab.com:55825/heroku_pw56xcdr"
};

// production environment
environments.prod = {
    httpPort: 80,
    httpsPort: 5001,
    envName: "prod",
    dbName: "ivendor",
    dbUrl: "mongodb://ivendor:pofquv-serxut-3kahDi@ds155825.mlab.com:55825/heroku_pw56xcdr"
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