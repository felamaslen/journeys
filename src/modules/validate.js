import joi from 'joi';

import { clientError } from '~/modules/error-handling';

export function validate(schema) {
  return (req, res, next) => {
    if (!req.body) {
      throw clientError('Must provide body in JSON format');
    }

    const { error, value } = joi.validate(req.body, schema);

    if (error) {
      throw clientError(error.message);
    }

    req.validBody = value;

    next();
  };
}
