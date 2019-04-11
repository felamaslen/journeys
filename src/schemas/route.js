import joi from 'joi';

export const add = joi.object()
  .keys({
    origin: joi.string().required(),
    destination: joi.string().required(),
    points: joi.array().items(joi.number()).required(),
    midPoint: joi.array().items(joi.number()).length(2).required(),
    length: joi.number().required(),
    bearing: joi.number().required(),
  })
  .unknown(false);
