const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const topupService = require('../services/topupCoinService');
const userService = require('../services/userService');
const transactionCoinService = require('../services/transactionCoinService');

const {
  PENDING,
  ACCEPT,
  REJECT,
  CANCEL,
  EXPIRE,
  PROCESS,
  DONE,
  EXPIRE_TIME,
} = process.env;

const topupCoin = catchAsync(async (req, res) => {
  const topupBody = req.body;
  const { id } = req.user;

  const topupData = {
    userId: id,
    coin: topupBody.coin,
    price: topupBody.price,
    statusCoin: PENDING,
  };

  const topup = await topupService.topup(id, topupBody);

  if (!topup) throw new ApiError(httpStatus.CONFLICT, 'Gagal melakukan topup.');

  const user = await userService.getUserById(id);

  if (!user) throw new ApiError(httpStatus.CONFLICT, 'Tidak dapat menemukan user.');

  const dataTransaction = {
    item_details: {
      id: topup.id,
      quantity: 1,
      name: `${topup.coin} coin`,
      category: 'global',
      merchant_name: 'SEBIS',
      price: topup.price,
    },
    transaction_details: {
      order_id: topup.id,
      gross_amount: topup.price,
    },
    credit_card: {
      secure: true,
    },
    custom_expiry: {
      order_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      expiry_duration: EXPIRE_TIME,
      unit: 'minute',
    },
    customer_details: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
    },
  };

  const transaction = await transactionCoinService.transactionCoin(dataTransaction);

  if (!transaction) throw new ApiError(httpStatus.CONFLICT, 'Pembelian koin gagal.');

  res.sendWrapped(transaction, httpStatus.OK);
});

module.exports = {
  topupCoin,
};
