import joi from 'joi';

export const postDeparture = joi.object()
  .keys({
    routeId: joi.string().required(),
    departure: joi.date().iso(),
  })
  .unknown(false);

export const postArrival = joi.object()
  .keys({
    arrival: joi.date().iso(),
  })
  .unknown(false);
