const fs = require('fs');
const moment = require('moment');
const logger = require('../config/logger');

const writeError = (filePath, data) => {
  fs.appendFile(filePath, data, (error) => {
    if (error) throw error;
    const currentDate = moment().format('YYYY-MM-DD HH:mm');
    logger.error(`Crash reported on ${currentDate}`);
  });
};

module.exports = {
  writeError,
};
