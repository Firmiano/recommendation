'use strict';

var Joi = require('Joi');

module.exports = function(app) {

    var user = app.model.user;
    var product = app.model.product;
    var rated = app.model.rated;


    var validateRecommendation = {
        add: add,
        get: get
    }

    function add(body) {
        return new Promise(function(resolve, reject) {
            var errs = [];
            var result = {
                user: null,
                product: null,
                rated: null
            }

            if (!body.user || body.user === null) {
                errs.push({ code: 101, message: "User can not be null or empty" });

            } else {
                var validateUser = Joi.validate(body.user, user);

                if (validateUser.error !== null) {
                    errs.push({ code: 102, message: validateUser.error.message });
                } else {
                    result.user = validateUser.value;
                }
            }

            if (!body.product || body.product === null) {
                errs.push({ code: 103, message: "Product can not be null or empty" });
            } else {
                var validateProduct = Joi.validate(body.product, product);

                if (validateProduct.error !== null) {
                    errs.push({ code: 104, message: validateProduct.error.message });
                } else {
                    result.product = validateProduct.value;
                }
            }

            if (!body.rated || body.rated === null) {
                errs.push({ code: 105, message: "Rated can not be null or empty" });
            } else {
                var validateRated = Joi.validate(body.rated, rated);

                if (validateRated.error !== null) {
                    errs.push({ code: 106, message: validateRated.error.message });
                } else {
                    result.rated = validateRated.value;
                }
            }

            if (errs.length > 0)
                reject(errs);

            resolve(result);
        });
    }

    function get() {
        return true;
    }

    return validateRecommendation;
}