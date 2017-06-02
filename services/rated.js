'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function(app){

    var serviceRated = {
        add : add
    }   

    function add(node_id_user,node_id_product,rated){
        return new Promise(function(resolve, reject){
            contextNeo4j.insertRelationship(node_id_user,node_id_product,"Rated",rated,function(err, node){
                console.log("aqui",node);
                if(err) reject(err);
                    resolve(node);
            });
        });
    }

    return serviceRated;
} 