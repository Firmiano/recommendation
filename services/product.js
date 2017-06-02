'use strict';

var contextNeo4j = require("../database/neo4j")();


module.exports = function(app){

    var serviceProduct = {
        add : add,
        get : get,
        getOrAdd : getOrAdd
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

    
    function getOrAdd(product){
        return new Promise(function(resolve,reject){
            get(product)
            .then(function(node){
                if(node[0]){
                    resolve(node[0]._id);
                }else{
                    add(product)
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

    return serviceProduct;
} 