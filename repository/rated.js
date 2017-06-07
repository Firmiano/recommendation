'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function(app){

    var repositoryRated = {
        add : add,
        get : get
    }   

    function add(node_id_user,node_id_product,rated){
        return new Promise(function(resolve, reject){
            contextNeo4j.insertRelationship(node_id_user,node_id_product,"Rated",rated,function(err, node){
                if(err) reject(err);
                    resolve(node);
            });
        });
    }

    function get(node_id_user,node_id_product){
        return new Promise(function(resolve, reject){
            var query = "MATCH p=(u:User)-[r:Rated]->(pd:Product) WHERE id(u)= "+node_id_user+" and id(pd)= " + node_id_product + " RETURN u,r,pd LIMIT 1"
            contextNeo4j.cypherQuery(query,function(err, node){
                if(err) reject(err);
                    resolve(node);
            });
        });
    }

    return repositoryRated;
} 