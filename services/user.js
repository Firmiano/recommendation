'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function (app) {

    var userServices = {
        add: add,
        get: get,
        getOrAdd : getOrAdd
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

    function getOrAdd(user){
        return new Promise(function(resolve,reject){
            get(user)
            .then(function(node){
                if(node[0]){
                    resolve(node[0]._id);
                }else{
                    add(user)
                        .then(function(node){
                            resolve(node[0]._id);
                        },function(err){
                            reject(err);
                        });
                }
            },function(err){
                reject(err);
            });
        });
    }

    return userServices;
}