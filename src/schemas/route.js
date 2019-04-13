import joiBase from 'joi';
import joiNoChange from 'joi-nochange';

const joi = joiNoChange(joiBase);

const keys = {
  origin: joi.string().required(),
  destination: joi.string().required(),
  points: joi.array().items(joi.number()).required(),
};

export const add = joi.object()
  .keys(keys)
  .unknown(false);

export const patch = oldItem => joi.object()
  .keys({
    id: joi.string().noChange(oldItem),
    midPoint: joi.array().items(joi.number()).length(2).required(),
    length: joi.number().required(),
    bearing: joi.number().required(),
    ...keys,
  })
  .unknown(false);
