'use strict';

var neo4j = require('neo4j-driver').v1;

var single_connection;

module.exports = function () {

    if (!single_connection) {
        var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "firmiano"));
        single_connection = driver.session();

        return single_connection;

    } else {
        return single_connection;
    }
};

