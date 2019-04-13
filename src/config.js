const __DEV__ = process.env.NODE_ENV === 'development';
const __PROD__ = process.env.NODE_ENV === 'production';
const __TEST__ = process.env.NODE_ENV === 'test';

export const getConfig = () => ({
  postgres: {
    url: process.env.POSTGRES_URL || 'postgres://root:password@localhost:5432/journeys',
  },
  app: {
    port: Number(process.env.PORT) || 3000,
  },
  __DEV__,
  __PROD__,
  __TEST__,
});
