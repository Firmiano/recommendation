'use strict';

var Joi = require('joi');

module.exports = Joi.object().keys({
    cpf: Joi.string().required()
});