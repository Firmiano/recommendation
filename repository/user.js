'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function (app) {

    var repositoryUser = {
        add: add,
        get: get
    }

    function add(user) {
        return new Promise(function (resolve, reject) {
            contextNeo4j.insertNode(user, ['User'], function (err, node) {
                if (err) reject(err);
                resolve(node);
            });
        });
    }

    function get(user){
        return new Promise(function (resolve,reject){
            contextNeo4j.readNodesWithLabelsAndProperties('User',user,function(err, node){
                if(err) reject(err);
                resolve(node);
            })
        });
    }

    return repositoryUser;
}