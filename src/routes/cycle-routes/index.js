import { Router } from 'express';

import { catchAsyncErrors } from '~/modules/error-handling';
import { validate } from '~/modules/validate';
import { add } from '~/schemas/route';

function routeAdd(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    const {
      origin,
      destination,
      points,
      midPoint: [midLon, midLat],
      length,
      bearing,
    } = req.validBody;

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

    res.json(addedRoute);
  });
}

export function routeCycleRoutes(config, logger, db) {
  const router = new Router();

  router.post('/', validate(add), routeAdd(config, logger, db));

  return router;
}
