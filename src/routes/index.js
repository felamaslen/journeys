import { Router } from 'express';

import { routeCycleRoutes } from '~/routes/cycle-routes';

export function apiRoutes(config, logger, db) {
  const router = new Router();

  router.use('/routes', routeCycleRoutes(config, logger, db));

  return router;
}
