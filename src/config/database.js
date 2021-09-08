const { Sequelize } = require('sequelize');
const logger = require('./logger');
const { database } = require('./config');

const {
  host, port, db, user, password,
} = database;

const sequelize = new Sequelize(`mariadb://${user}:${password}@${host}:${port}/${db}`);

const connectDb = sequelize.authenticate().then(() => {
  logger.info('Connection has been established successfully.');
  return Promise.resolve(true);
}).catch((error) => {
  logger.error(`Unable to connect to the database: ${error}`);
  return Promise.reject(error);
});

module.exports = {
  connectDb,
  sequelize,
};
