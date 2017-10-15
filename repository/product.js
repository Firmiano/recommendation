'use strict';

var contextNeo4j = require("../database/neo4j")();


module.exports = function(app){

    var repositoryProduct = {
        add : add,
        get : get
    }   

    function add(product) {
        return contextNeo4j.run(`CREATE (p:Product {productId: ${product.productId}}) RETURN ID(p)`);
    }

    function get(product) {
        return contextNeo4j.run(`MATCH (p:Product) WHERE p.productId = ${product.productId} RETURN ID(p)`);
    }

    return repositoryProduct;
} 