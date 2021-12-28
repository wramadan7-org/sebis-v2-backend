const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Bank } = require('../models/Bank');

const getBankAll = async () => {
  const banks = await Bank.findAll();

  return banks;
};

const getBankById = async (id) => {
  const bank = await Bank.findOne(
    {
      where: {
        id,
      },
    },
  );

  if (!bank && bank == undefined) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');

  return bank;
};

const getOwnBank = async (id, userId) => {
  const bank = await Bank.findOne(
    {
      where: {
        id,
        userId,
      },
    },
  );

  if (!bank && bank == undefined) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');

  return bank;
};

const createOrUpdate = async (userId, bodyBank) => {
  const checkBank = await Bank.findOne(
    {
      where: {
        userId,
      },
    },
  );

  if (checkBank) {
    Object.assign(checkBank, bodyBank);
    checkBank.save();

    return checkBank;
  }

  const data = {
    userId,
    ...bodyBank,
  };
  const insertBank = await Bank.create(data);

  return insertBank;
};

const deleteBank = async (id) => {
  const bank = await getBankById(id);

  if (!bank) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found.');

  await bank.destroy();

  return bank;
};

const deleteOwnBank = async (id, userId) => {
  const bank = await getOwnBank(id, userId);

  if (!bank) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found.');

  await bank.destroy();

  return bank;
};

module.exports = {
  getBankAll,
  getBankById,
  getOwnBank,
  createOrUpdate,
  deleteBank,
  deleteOwnBank,
};
