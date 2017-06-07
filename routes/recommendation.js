"use script";

module.exports = function(app) {
    var recommendationController = app.controllers.recommendation;

    app.route('/api/recommendation')
        .post(recommendationController.add)
        .get(recommendationController.get);
    
    app.route('/api/relationship')
        .get(recommendationController.getRelationship);
};