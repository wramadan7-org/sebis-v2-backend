const fs = require('fs');
const moment = require('moment');
const logger = require('../config/logger');

const writeError = (filePath, data) => {
  const currentDate = moment().format('YYYY-MM-DD HH:mm');
  fs.appendFile(filePath, `\n========== ${currentDate} ==========\n${data}`, (error) => {
    if (error) throw error;
    logger.error(`Crash reported on ${currentDate}`);
  });
};

module.exports = {
  writeError,
};

