import { Router } from 'express';
import { catchAsyncErrors } from '~/modules/error-handling';

function routeGetOrigins(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    const results = await db.distinct('origin')
      .from('routes')
      .orderBy('origin');

    const resultsArray = results.map(({ origin }) => origin);

    res.json(resultsArray);
  });
}

function routeGetDestinations(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    const results = await db.select('id', 'destination')
      .from('routes')
      .where({ origin: req.params.origin });

    res.json(results);
  });
}

export function routeSwitcher(config, logger, db) {
  const router = new Router();

  router.get('/', routeGetOrigins(config, logger, db));

  router.get('/:origin/routes', routeGetDestinations(config, logger, db));

  return router;
}
