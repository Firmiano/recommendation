'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function (app) {

    var repRated = app.repository.rated;
    var repProduct = app.repository.product;
    var repUser = app.repository.user;

    var serviceRecommendation = {
        add: add,
        get: get
    }

    function add(recommendation) {
        return new Promise(function (resolve, reject) {
            userGetOrAdd(recommendation.user)
                .then(function (node_user) {
                    productGetOrAdd(recommendation.product)
                        .then(function (node_product) {
                            ratedAddOrUpdate(node_user, node_product, recommendation.rated)
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
        return repUser.getRecommendation(user);
    }

    function ratedAddOrUpdate(node_id_user, node_id_product, rated) {
        return new Promise(function (resolve, reject) {
            repRated.get(node_id_user, node_id_product)
                .then(function (node) {
                    if (node && node.data.length > 0) {

                        if(rated.valor + 1 < node.data[0][1].valor){
                            resolve(true);
                            return
                        }

                        if (rated.valor === 3 && node.data[0][1].valor === 5) {
                            resolve(true);
                            return;
                        }
                        if (rated.valor === 6 && node.data[0][1].valor === 8) {
                            resolve(true);
                            return;
                        }
                        if (rated.valor < 6 && node.data[0][1].valor < 5) {
                            node.data[0][1].valor++;
                            rated.valor = node.data[0][1].valor;
                        } else if (rated.valor < 9 && node.data[0][1].valor >= 6 && node.data[0][1].valor < 8) {
                            node.data[0][1].valor++;
                            rated.valor = node.data[0][1].valor;
                        }

                        repRated.update(node.data[0][1]._id, rated)
                            .then(function (node) {
                                resolve(node);
                            }, function (err) {
                                reject(err);
                            });

                    } else {
                        repRated.add(node_id_user, node_id_product, rated)
                            .then(function (node) {
                                resolve(true);
                            }, function (err) {
                                reject(err);
                            });
                    }
                }, function (err) {
                    reject(err);
                });
        });
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