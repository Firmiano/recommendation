'use strict';

var neo4j = require('node-neo4j');

var single_connection;

module.exports = function () {

    if (!single_connection) {
        single_connection = new neo4j('http://neo4j:firmiano@10.11.4.54:7474');
        console.log('Neo4j conectado!');
        return single_connection;
    }
    return single_connection;
};

