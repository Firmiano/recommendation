var contextNeo4j = require("../database/neo4j")();

initDataBaseConfig();

function initDataBaseConfig() {
    createUnique('User', 'userId');
    createUnique('Product', 'productId');
}

function createUnique(label, prop) {
    contextNeo4j.run(`CREATE INDEX ON :${label}(${prop})`);
}

