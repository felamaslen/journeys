import express from 'express';

import { getConfig } from '~/config';
import { getLogger } from '~/modules/logger';
import { getDatabase } from '~/modules/db';

function setupMiddleware(app) {
  app.set('etag', 'strong');
}

async function run() {
  const config = getConfig();
  const logger = getLogger(config);
  const db = await getDatabase(config, logger);

  const app = express();

  setupMiddleware(app, config, logger, db);

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  app.listen(config.app.port, () => {
    logger.info('App listening on port %s', config.app.port);
  });
}

run();
