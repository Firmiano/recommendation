'use strict';

var Joi = require('joi');

module.exports = Joi.object().keys({
    valor: Joi.number().integer().equal(3).equal(6).equal(9).required(),
    userSaldo: Joi.number().integer().empty().required(),
    productValor: Joi.number().integer().empty().required()
});