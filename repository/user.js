'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function (app) {

    var repositoryUser = {
        add: add,
        get: get,
        getRecommendation : getRecommendation
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

    function getRecommendation(user){
        return new Promise(function(resolve,reject){
            var query = 'MATCH (u1:User{cpf : '+user.cpf+ '})-[r:Rated]->(p:Product) WITH  u1, avg(r.valor) AS u1_mean MATCH (u1)-[r1:Rated]->(p:Product)<-[r2:Rated]-(u2) WITH u1, u1_mean, u2, COLLECT({r1: r1, r2: r2}) AS ratings WHERE size(ratings) > 1 MATCH (u2)-[r:Rated]->(p:Product) WITH u1, u1_mean, u2, avg(r.valor) AS u2_mean, ratings UNWIND ratings AS r WITH sum( (r.r1.valor - u1_mean) * (r.r2.valor - u2_mean) ) AS nom,   sqrt( sum( (r.r1.valor - u1_mean)^2) * sum( (r.r2.valor - u2_mean) ^2)) AS denom,   u1, u2 WHERE denom <> 0 WITH u1, u2, nom/denom AS pearson ORDER BY pearson DESC LIMIT 10 MATCH (u2)-[r:Rated]->(p:Product) WHERE NOT EXISTS( (u1)-[:Rated]->(p)) RETURN p, SUM( pearson * r.valor) AS score ORDER BY score DESC LIMIT 25';
            contextNeo4j.cypherQuery(query, function(err,node){
                if(err) reject(err);
                    resolve(node);
            });
        });
    }

    return repositoryUser;
}