/*
 *
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Development environment (default)
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging",
    dbName: "ivendor_dev",
    dbUrl: "mongodb://port--27017.wun--usmsc01.port.ww-field-eng-qa-s01-fdb-doc-layer.pie-fdb.pie-fdb-prod.sdr.apple:27017"
};

// production environment
environments.prod = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "prod",
    dbName: "ivendor",
    dbUrl: "mongodb://port--27017.wun--usmsc01.port.ww-field-eng-qa-s01-fdb-doc-layer.pie-fdb.pie-fdb-prod.sdr.apple:27017"
};

// production environment
environments.local = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "local",
    dbName: "ivendor",
    dbUrl: "mongodb://localhost:27017"
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