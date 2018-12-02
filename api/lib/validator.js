const Joi = require('joi');

exports.validateVisit = (visit) => {
  return Joi.validate(visit, Joi.object().keys({
    host: Joi.string().required(),
    ip: Joi.string().required(),
    date: Joi.date().iso().required(),
    userAgent: Joi.string().required(),
    isMobile: Joi.boolean().required(),
    isoCountryCode: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    siteId: Joi.string().required()
  }));
};

exports.validateUserCreation = (user) => {
  return Joi.validate(user, Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
    sites: Joi.array().items(Joi.string().required())
  }));
};

exports.validateUserLogin = (user) => {
  return Joi.validate(user, Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required().error(() => 'Email invalide'),
    password: Joi.string().required().error(() => 'Mot de passe invalide')
  }));
};