// update with your config

module.exports = {

  development: {
    client: 'pg',
    debug: true,
    connection: {
      database: 'api_data'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/development/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/production/seeds'
    }
  }
};
