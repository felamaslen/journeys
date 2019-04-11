import { Router } from 'express';

import { catchAsyncErrors, clientError } from '~/modules/error-handling';
import { validate } from '~/modules/validate';
import { add } from '~/schemas/route';

function processRouteResponse(item) {
  const { mid_lon: midLon, mid_lat: midLat, ...route } = item;

  return {
    ...route,
    midPoint: [midLon, midLat],
  };
}

function routeCreate(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    const {
      origin,
      destination,
      points,
      midPoint: [midLon, midLat],
      length,
      bearing,
    } = req.validBody;

    const uniqueExists = await db.select()
      .from('routes')
      .where({ origin, destination });

    if (uniqueExists.length) {
      throw clientError('A duplicate route exists with the same origin and destination');
    }

    const [id] = await db.insert({
      origin,
      destination,
      points: JSON.stringify(points),
      mid_lon: midLon,
      mid_lat: midLat,
      length: Math.round(length),
      bearing,
    })
      .returning('id')
      .into('routes');

    const addedRoute = await db.select()
      .from('routes')
      .where({ id });

    res.json(processRouteResponse(addedRoute));
  });
}

function routeRead(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    if (!req.params.id) {
      const cycleRoutes = await db.select()
        .from('routes');

      return res.json(cycleRoutes.map(processRouteResponse));
    }

    const [cycleRoute] = await db.select()
      .from('routes')
      .where({ id: req.params.id });

    if (!cycleRoute) {
      throw clientError('Route not found', 404);
    }

    return res.json(processRouteResponse(cycleRoute));
  });
}

export function routeCycleRoutes(config, logger, db) {
  const router = new Router();

  router.get('/:id?', routeRead(config, logger, db));

  router.post('/', validate(add), routeCreate(config, logger, db));

  return router;
}
