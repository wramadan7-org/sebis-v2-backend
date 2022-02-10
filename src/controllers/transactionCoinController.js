const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const transactionCoinService = require('../services/transactionCoinService');

/*
const transactionCoin = catchAsync(async (req, res) => {
  let transactioBody = {
    item_details: [
      {
        id: '1111111',
        price: 20000,
        quantity: 1,
        name: 'coin ',
        category: 'global',
        merchant_name: 'SEBIS',
      },
      {
        id: '2222212',
        price: 20000,
        quantity: 1,
        name: 'coin ',
        category: 'global',
        merchant_name: 'SEBIS',
      },
    ],
    transaction_details: {
      order_id: '12120022222',
      gross_amount: 40000,
    },
    credit_card: {
      secure: true,
    },
    custom_expiry: {
      order_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      expiry_duration: 10,
      unit: 'minute',
    },
    customer_details: {
      first_name: 'Wahyu',
      last_name: 'Ramadan',
      email: 'wramadan1203@gmail.com',
      phone: 82257022921,
    },
  };

   const transaction = await transactionCoinService.transactionCoin(transactioBody);

   res.sendWrapped(transaction, httpStatus.OK);
 });
*/

const paymentNotif = catchAsync(async (req, res) => {
  const { body } = req;
  await transactionCoinService.notificationSuccessTransaction(body);
});

const actionTransaction = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  let { type } = req.query;

  type.toLowerCase();

  const value = ['approve', 'deny', 'cancel', 'expire', 'refund'];

  if (!value.some((string) => string.includes(type))) {
    return res.sendWrapped('Parameter query anda salah', httpStatus.BAD_REQUEST);
  }

  const approve = await transactionCoinService.actionTransaction(orderId, type);

  const data = {
    bank: approve.bank ? approve.bank : null,
    eci: approve.eci ? approve.eci : null,
    transaction_id: approve.transaction_id ? approve.transaction_id : null,
    masked_card: approve.masked_card ? approve.masked_card : null,
    order_id: approve.order_id ? approve.order_id : null,
    merchant_id: approve.merchant_id ? approve.merchant_id : null,
    payment_type: approve.payment_type ? approve.payment_type : null,
    transaction_time: approve.transaction_time ? moment(approve.transaction_time).format('YYYY-MM-DD HH:mm:ss') : null,
    transaction_status: approve.transaction_status ? approve.transaction_status : null,
    fraud_status: approve.fraud_status ? approve.fraud_status : null,
    gross_amount: approve.gross_amount ? parseInt(approve.gross_amount) : null,
    currency: approve.currency ? approve.currency : null,
    approval_code: approve.approval_code ? parseInt(approve.approval_code) : null,
  };

  const response = {
    status: approve.status_code ? parseInt(approve.status_code) : null,
    message: approve.status_message ? approve.status_message : null,
    data,
  };

  res.send(response);
});

module.exports = {
  // transactionCoin,
  paymentNotif,
  actionTransaction,
};
