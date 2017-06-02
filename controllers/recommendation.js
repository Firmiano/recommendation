'use strict';

module.exports = function (app) {
    var userService = app.services.user;
    var productService = app.services.product;
    var ratedService = app.services.rated;

    var recommendationController = {
        add: add,
        get: get
    }

    function add(req, res) {

        var recommendation = {
            user: req.body.user,
            rated: req.body.rated,
            product: req.body.product
        }

        userService.getOrAdd(recommendation.user)
            .then(function(node_user){
                console.log("node_user",node_user);
                productService.getOrAdd(recommendation.product)
                    .then(function(node_product){
                        console.log("node_product",node_product);
                        ratedService.add(node_user,node_product,recommendation.rated)
                            .then(function(rated){
                                res.status(201).json(rated);
                            })
                    });
            });
    }


    function get(req, res) {
        userService.get({ cpf: req.query.document })
            .then(function (node) {
                res.status(200).json(node);
            }, function (err) {
                res.status(500).json({});
            });
    }

    return recommendationController;
}