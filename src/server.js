const app = require('./app');
const config = require('./config/config');
const { connectDb } = require('./config/database');
const logger = require('./config/logger');
const setupSequelizeAssociations = require('./models');
const { initializeQueue } = require('./queues');

let server;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

connectDb
  .then(() => {
    setupSequelizeAssociations().then(() => {
      initializeQueue();
      server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
      });
    });
  })
  .catch(() => exitHandler());

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) server.close();
});
