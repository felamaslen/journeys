import express from 'express';
import path from 'path';
import history from 'connect-history-api-fallback';

import { getConfig } from '~/config';
import { getLogger } from '~/modules/logger';
import { getDatabase } from '~/modules/db';

require('dotenv').config();

function setupMiddleware(app) {
  app.set('etag', 'strong');
}

function setupClient(app, config) {
  const production = !config.__DEV__ || process.env.SKIP_CLIENT === 'true';

  const privateSPA = (req, res, next) => {
    req.url = '/index.html';

    next();
  };

  app.get('/', privateSPA);

  app.get('/index.html', (req, res, next) => {
    if (req.originalUrl === req.url) {
      res.redirect('/');
    } else {
      next();
    }
  });

  if (production) {
    app.use(express.static(path.resolve(__dirname, '../dist/public')));
  } else {
    // eslint-disable-next-line global-require
    const webpackConfig = require('../webpack.config.babel').default(config);

    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const compiler = require('webpack')(webpackConfig);

    const serverOptions = {
      quiet: true,
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      hot: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      port: config.port,
    };

    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);

    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, serverOptions);

    app.use(history());

    app.use(webpackDevMiddleware);
    app.use(webpackHotMiddleware);
  }

  app.get('/*', privateSPA);
}

async function run() {
  const config = getConfig();
  const logger = getLogger(config);
  const db = await getDatabase(config, logger);

  const app = express();

  setupMiddleware(app, config, logger, db);

  setupClient(app, config);

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  app.listen(config.app.port, () => {
    logger.info('App listening on port %s', config.app.port);
  });
}

run();
