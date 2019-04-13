import { Router } from 'express';

import { routeCycleRoutes } from '~/routes/cycle-routes';
import { routeSwitcher } from '~/routes/switcher';

export function apiRoutes(config, logger, db) {
  const router = new Router();

  router.use('/routes', routeCycleRoutes(config, logger, db));

  router.use('/origin', routeSwitcher(config, logger, db));

  return router;
}
