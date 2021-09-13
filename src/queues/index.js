const fcmQueue = require('./fcmQueue');

const initializeQueue = () => {
  fcmQueue.initializeFcmQueue();
};

module.exports = {
  initializeQueue,
};
