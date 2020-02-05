const {
  DB_HOST: host,
  // Just in case the port changes we can use an env variable
  DB_PORT: port = 3306,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_DATABASE: database,
  NODE_ENV
} = process.env;

const configs = {
  production: {
    logging: false,
    entities: ['build/entity/**/*.js'],
    migrations: ['build/migration/**/*.js'],
    subscribers: ['build/subscriber/**/*.js']
  },
  development: {
    logging: true,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts']
  }
};

module.exports = Object.assign(
  // Load config for environment or development by default
  { ...(configs[NODE_ENV] || configs.development) },
  {
    host,
    port,
    username,
    password,
    database,
    type: 'mysql',
    synchronize: true,
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
  }
);
