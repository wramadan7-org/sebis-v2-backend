const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { TutoringTransaction } = require('../models/TutoringTransaction');

const createTransactionLes = async (id, transactionBody) => {
  const data = {
    studentId: id,
    ...transactionBody,
  };

  const transaction = await TutoringTransaction.create(data);

  return transaction;
};

module.exports = {
  createTransactionLes,
};
