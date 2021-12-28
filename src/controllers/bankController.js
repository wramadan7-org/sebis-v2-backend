const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const bankServices = require('../services/bankService');

const getAllBank = catchAsync(async (req, res) => {
  const banks = await bankServices.getBankAll();

  if (!banks && banks.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'You don\'t have bank account.');

  res.sendWrapped(banks, httpStatus.FOUND);
});

const getBankById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const bank = await bankServices.getBankById(id);

  res.sendWrapped(bank, httpStatus.FOUND);
});

const getOwnBank = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const bank = await bankServices.getOwnBank(id, userId);

  res.sendWrapped(bank, httpStatus.FOUND);
});

const createOrUpdateBank = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const bodyBank = req.body;

  const bank = await bankServices.createOrUpdate(userId, bodyBank);

  res.sendWrapped(bank, httpStatus.CREATED);
});

const deleteBank = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deleted = await bankServices.deleteBank(id);

  res.sendWrapped(deleted, httpStatus.OK);
});

const deleteOwnBank = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const bank = await bankServices.deleteOwnBank(id, userId);

  res.sendWrapped(bank, httpStatus.OK);
});

module.exports = {
  getAllBank,
  getBankById,
  getOwnBank,
  createOrUpdateBank,
  deleteBank,
  deleteOwnBank,
};
