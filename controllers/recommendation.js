module.exports = function(app) {
    var recommendationService = app.services.recommendation;
    var validation = app.validation.recommendation;

    var recommendationController = {
        add: add,
        get: get,
        getRelationship: getRelationship
    }

    function add(req, res) {

        validation.add(req.body)
            .then(function(result) {
                recommendationService.add(result)
                    .then(function(rated) {
                        res.status(201).json(rated);
                    }, function(err) {
                        res.status(500).json({});
                    });

            }, function(errs) {
                res.status(400).json(errs);
            });
    }


    function get(req, res) {

        var user = {
            cpf: req.query.document
        }

        recommendationService.get(user)
            .then(function(node) {
                res.status(200).json(node);
            }, function(err) {
                res.status(500).json({});
            });
    }

    function getRelationship(req, res) {
        var node_id_user = req.query.userId;
        var node_id_product = req.query.productId;

        recommendationService.getRelationship(node_id_user, node_id_product)
            .then(function(node) {
                res.status(200).json(node);
            }, function(err) {
                res.status(500).json({ err: err });
            });

    }

    return recommendationController;
}