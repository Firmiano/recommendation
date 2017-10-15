'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function (app) {

    var repositoryRated = {
        add: add,
        get: get,
        update: update
    }

    function add(node_id_user, node_id_product, rated) {
        return contextNeo4j.run(`MATCH (u:User),(p:Product) WHERE ID(u) = ${node_id_user} AND ID(p) = ${node_id_product} CREATE (u)-[r:Rated { valor: ${rated.valor}, userSaldo: ${rated.userSaldo}, productValor: ${rated.productValor} }]->(p) RETURN ID(r)`);
    }

    function get(node_id_user, node_id_product) {
        return contextNeo4j.run(`MATCH p=(u:User)-[r:Rated]->(pd:Product) WHERE id(u)= ${node_id_user} and id(pd)= ${node_id_product} RETURN ID(r), r.valor LIMIT 1`);
    }

    function update(node_id_rated, rated) {
        return contextNeo4j.run(`MATCH (u:User)-[r:Rated]-(p:Product) WHERE ID(r) = ${node_id_rated} SET r.valor = ${rated.valor}, r.userSaldo = ${rated.userSaldo}, r.productValor = ${rated.productValor}`);
    }

    return repositoryRated;
} 