// src/middleware/validation.js
const Joi = require('joi');

/**
 * @param {Joi.Schema} schema - a Joi schema to run
 * @param {'body'|'params'} property - where to validate (req.body or req.params)
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      // collect all messages into one string
      const msg = error.details.map(d => d.message).join('; ');
      return res.status(400).json({ error: msg });
    }
    req[property] = value;
    next();
  };
}

module.exports = validate;
