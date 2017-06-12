'use strict';

module.exports = function (app) {
    var recommendationService = app.services.recommendation;

    var recommendationController = {
        add: add,
        get: get
    }

    function add(req, res) {

        var reco = {
            user: req.body.user,
            rated: req.body.rated,
            product: req.body.product
        }

        recommendationService.add(reco)
            .then(function (rated) {
                res.status(201).json(rated);
            }, function (err) {
                res.status(500).json({});
            });
    }


    function get(req, res) {

        var user = {
            cpf: req.query.cpf
        }

        recommendationService.get(user)
            .then(function (node) {
                res.status(200).json(node);
            }, function (err) {
                res.status(500).json({});
            });
    }

    return recommendationController;
}