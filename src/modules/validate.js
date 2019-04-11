import joi from 'joi';

import { clientError } from '~/modules/error-handling';

export function validate(schema) {
  return (req, res, next) => {
    if (!req.body) {
      throw clientError('Must provide body in JSON format');
    }

    if (!(Object.keys(req.body).length)) {
      throw clientError('Must provide data');
    }

    const { error, value } = joi.validate(req.body, schema);

    if (error) {
      throw clientError(error.message);
    }

    req.validBody = value;

    next();
  };
}
