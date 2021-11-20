const cluster = require('cluster');
const scanner = require('sonarqube-scanner');
const numCpus = require('os').cpus().length;
const app = require('./app');
const config = require('./config/config');
const { connectDb } = require('./config/database');
const logger = require('./config/logger');
const setupSequelizeAssociations = require('./models');
const { initializeQueue } = require('./queues');
const { writeError } = require('./utils/common');

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

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  writeError('./public/crash.log', error);
  // exitHandler();
};

const initializeServer = () => {
  connectDb
    .then(() => {
      setupSequelizeAssociations()
        .then(() => {
          initializeQueue();
          if (config.enableCluster && cluster.isPrimary) {
            logger.info(`Primary ${process.pid} is running`);

            // Fork workers.
            for (let i = 0; i < numCpus; i += 1) {
              cluster.fork();
            }

            cluster.on('exit', (worker) => {
              logger.info(`Worker ${worker.process.pid} died`);
              logger.info(`Remaining workers: ${Object.keys(cluster.workers).length}`);
              logger.info('Starting new worker');
              cluster.fork();
              logger.info(`Current workers: ${Object.keys(cluster.workers).length}`);
            });
          } else {
            server = app.listen(config.port, () => {
              logger.info(`Listening to port ${config.port}`);
            });
          }
        });
    })
    .catch(() => exitHandler());
};

initializeServer();

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) server.close();
});
