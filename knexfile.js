/**
 * Currently This file is only for the migrations we will be generating
 * We are using knexjs to generate all the database migrations
 */
const env = require('dotenv');
env.config();

module.exports = {
  client: 'mysql2',
  connection: {
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USERNAME
  },
  migrations: {
    directory: './src/database/migrations',
    tableName: 'migrations'
  },
  seeds: {
    directory: './src/database/seeders'
  }
};
