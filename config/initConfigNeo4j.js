var contextNeo4j = require("../database/neo4j")();

initDataBaseConfig();

function initDataBaseConfig() {
    createUnique('User', 'cpf');
    createUnique('Product', 'productId');
}

function createUnique(label, prop) {
    contextNeo4j.createUniquenessContstraint(label, prop, function (err, node) {
        if (!err) {
            console.log(node);
        } else {
            console.log(err);
        }
    });
}

