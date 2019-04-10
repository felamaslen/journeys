import path from 'path';
import url from 'url';
import knex from 'knex';

export async function getDatabase(config, logger) {
  const {
    hostname: host = '127.0.0.1',
    auth = 'user:password',
    pathname = '/journeys',
    port = 5432,
  } = url.parse(config.postgres.url);

  const database = pathname.substring(1);

  const [user, password] = auth.split(':');

  const db = knex({
    client: 'pg',
    connection: {
      host,
      user,
      password,
      port,
      database,
    },
  });

  await db.migrate.latest({
    directory: path.resolve(__dirname, '../migrations'),
  });

  logger.verbose('Ran database migrations');

  return db;
}
