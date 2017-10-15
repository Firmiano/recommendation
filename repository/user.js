'use strict';

var contextNeo4j = require("../database/neo4j")();

module.exports = function (app) {

    var repositoryUser = {
        add: add,
        get: get,
        getRecommendation: getRecommendation
    }

    function add(user) {
        return contextNeo4j.run(`CREATE (u:User {userId: ${user.userId}}) RETURN ID(u)`);
    }

    function get(user) {
        return contextNeo4j.run(`MATCH (u:User) WHERE u.userId = ${user.userId} RETURN ID(u)`);
    }

    function getRecommendation(user) {
        return contextNeo4j.run(`MATCH (u1:User{userId : ${user.userId} })-[r:Rated]->(p:Product) WITH  u1, avg(r.valor) -1 AS u1_mean MATCH (u1)-[r1:Rated]->(p:Product)<-[r2:Rated]-(u2) WITH u1, u1_mean, u2, COLLECT({r1: r1, r2: r2}) AS ratings WHERE size(ratings) > 0 MATCH (u2)-[r:Rated]->(p:Product) WITH u1, u1_mean, u2, avg(r.valor) -1 AS u2_mean, ratings UNWIND ratings AS r WITH sum( (r.r1.valor - u1_mean) * (r.r2.valor - u2_mean) ) AS nom,   sqrt( sum( (r.r1.valor - u1_mean)^2) * sum( (r.r2.valor - u2_mean) ^2)) AS denom,   u1, u2 WHERE denom <> 0 WITH u1, u2, nom/denom AS pearson ORDER BY pearson DESC LIMIT 10 MATCH (u2)-[r:Rated]->(p:Product) WHERE NOT EXISTS( (u1)-[:Rated]->(p)) RETURN p, SUM( pearson * r.valor) AS score ORDER BY score DESC LIMIT 10`);
    }

    return repositoryUser;
}