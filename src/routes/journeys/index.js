import { Router } from 'express';

import { catchAsyncErrors, clientError } from '~/modules/error-handling';
import { validate } from '~/modules/validate';
import { postDeparture, postArrival } from '~/schemas/journey';

function routePostDeparture(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    const {
      routeId,
      departure = new Date().toISOString(),
    } = req.validBody;

    const [route] = await db.select('origin', 'destination')
      .from('routes')
      .where({ id: routeId });

    if (!route) {
      throw clientError('Route not found', 404);
    }

    const { origin, destination } = route;

    const [journeyId] = await db.insert({
      route_id: routeId,
      departure,
      arrival: null,
    })
      .returning('id')
      .into('journeys');

    res.status(202).json({
      journeyId,
      origin,
      destination,
    });
  });
}

function routePostArrival(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    const {
      arrival = new Date().toISOString(),
    } = req.validBody;

    await db('journeys')
      .where({ id: req.params.journeyId })
      .update({ arrival });

    res.status(204).end();
  });
}

export function routeJourneys(config, logger, db) {
  const router = new Router();

  router.post(
    '/departure',
    validate(postDeparture),
    routePostDeparture(config, logger, db)
  );

  router.post(
    '/:journeyId/arrival',
    validate(postArrival),
    routePostArrival(config, logger, db)
  );

  return router;
}
