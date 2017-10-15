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
                    if (node && node.records.length > 0) {

                        const id = node.records[0]._fields[0].low;
                        let valor = node.records[0]._fields[1].low;
                        
                        if (rated.valor + 1 < valor) {
                            resolve(true);
                            return;
                        }

                        if (rated.valor === 3 && valor === 5) {
                            resolve(true);
                            return;
                        }
                        if (rated.valor === 6 && valor === 8) {
                            resolve(true);
                            return;
                        }
                        if (rated.valor < 6 && valor < 5) {
                            valor++;
                            rated.valor = valor;
                        } else if (rated.valor < 9 && valor >= 6 && valor < 8) {
                            valor++;
                            rated.valor = valor;
                        }

                        repRated.update(id, rated)
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
                    if (node.records.length > 0) {
                        resolve(node.records[0]._fields[0].low);
                    } else {
                        repUser.add(user)
                            .then(function (node) {
                                resolve(node.records[0]._fields[0].low);
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
                    if (node.records.length > 0) {
                        resolve(node.records[0]._fields[0].low);
                    } else {
                        repProduct.add(product)
                            .then(function (node) {
                                resolve(node.records[0]._fields[0].low);
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