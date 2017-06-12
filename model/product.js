'use strict';

var Joi = require('joi');

module.exports = Joi.object().keys({
    productId: Joi.number().integer().min(1).empty().required()
});