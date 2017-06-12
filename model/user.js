'use strict';

var Joi = require('joi');

module.exports = Joi.object().keys({
    userId: Joi.number().integer().min(1).empty().required()
});