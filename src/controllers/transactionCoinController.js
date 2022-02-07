// const httpStatus = require('http-status');
// const moment = require('moment');
// const ApiError = require('../utils/ApiError');
// const catchAsync = require('../utils/catchAsync');

// const transactionCoinService = require('../services/transactionCoinService');

// const transactionCoin = catchAsync(async (req, res) => {
//   let transactioBody = {
//     item_details: [
//       {
//         id: '1111111',
//         price: 20000,
//         quantity: 1,
//         name: 'coin ',
//         category: 'global',
//         merchant_name: 'SEBIS',
//       },
//       {
//         id: '2222212',
//         price: 20000,
//         quantity: 1,
//         name: 'coin ',
//         category: 'global',
//         merchant_name: 'SEBIS',
//       },
//     ],
//     transaction_details: {
//       order_id: '12120022222',
//       gross_amount: 40000,
//     },
//     credit_card: {
//       secure: true,
//     },
//     custom_expiry: {
//       order_time: moment().format('YYYY-MM-DD HH:mm:ss'),
//       expiry_duration: 10,
//       unit: 'minute',
//     },
//     customer_details: {
//       first_name: 'Wahyu',
//       last_name: 'Ramadan',
//       email: 'wramadan1203@gmail.com',
//       phone: 82257022921,
//     },
//   };

//   const transaction = await transactionCoinService.transactionCoin(transactioBody);

//   res.sendWrapped(transaction, httpStatus.OK);
// });

// const paymentNotif = catchAsync(async (req, res) => {
//   const { body } = req;
//   await transactionCoinService.notificationSuccessTransaction(body);
// });

// module.exports = {
//   transactionCoin,
//   paymentNotif,
// };
