'use strict';

var contextNeo4j = require("../database/neo4j")();


module.exports = function(app){

    var repositoryProduct = {
        add : add,
        get : get
    }   

   function add(product) {
        return new Promise(function (resolve, reject) {
            contextNeo4j.insertNode(product, ['Product'], function (err, node) {
                if (err) reject(err);
                resolve(node);
            });
        });
    }

    function get(product){
        return new Promise(function (resolve,reject){
            contextNeo4j.readNodesWithLabelsAndProperties('Product',product,function(err, node){
                if(err) reject(err);
                resolve(node);
            })
        });
    }

    return repositoryProduct;
} 