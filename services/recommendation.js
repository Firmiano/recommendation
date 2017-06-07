'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function (app) {

    var repRated = app.repository.rated;
    var repProduct = app.repository.product;
    var repUser = app.repository.user;

    var serviceRecommendation = {
        add: add,
        get: get,
        getRelationship : getRelationship
    }

    function add(recommendation) {
        return new Promise(function (resolve, reject) {
            userGetOrAdd(recommendation.user)
                .then(function (node_user) {
                    productGetOrAdd(recommendation.product)
                        .then(function (node_product) {
                            repRated.add(node_user, node_product, recommendation.rated)
                                .then(function (rated) {
                                    resolve(rated);
                                }, function (err) {
                                    reject(err);
                                });
                        }, function (err) {
                            reject(err);
                        });
                }, function (err) {
                    reject(err);
                });
        });
    }

    function get(user) {
        return repUser.get(user);
    }

    function getRelationship(node_id_user,node_id_product){
        return repRated.get(node_id_user,node_id_product);
    }

    function userGetOrAdd(user) {
        return new Promise(function (resolve, reject) {
            repUser.get(user)
                .then(function (node) {
                    if (node[0]) {
                        resolve(node[0]._id);
                    } else {
                        repUser.add(user)
                            .then(function (node) {
                                resolve(node._id);
                            }, function (err) {
                                reject(err);
                            });
                    }
                }, function (err) {
                    reject(err);
                });
        });
    }

    function productGetOrAdd(product) {
        return new Promise(function (resolve, reject) {
            repProduct.get(product)
                .then(function (node) {
                    if (node[0]) {
                        resolve(node[0]._id);
                    } else {
                        repProduct.add(product)
                            .then(function (node) {
                                resolve(node._id);
                            }, function (err) {
                                reject(err);
                            });
                    }
                }, function (err) {
                    reject(err);
                });
        });
    }

    return serviceRecommendation;
} 