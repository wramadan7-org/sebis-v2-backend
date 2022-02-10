const httpStatus = require('http-status');
const moment = require('moment');
const midtransClient = require('midtrans-client');
const ApiError = require('../utils/ApiError');
const { midtransEnvironment } = require('../config/midtrans');

const { User } = require('../models/User');
const { TransactionCoin } = require('../models/TransactionCoin');

const userService = require('./userService');
const topupService = require('./topupCoinService');

const {
  PENDING,
  ACCEPT,
  REJECT,
  CANCEL,
  EXPIRE,
  PROCESS,
  DONE,
  DELETE,
  MIDTRANS_ENVIRONMENT,
  MIDTRANS_SERVER_KEY_PROD,
  MIDTRANS_CLIENT_KEY_PROD,
  MIDTRANS_SERVER_KEY_DEV,
  MIDTRANS_CLIENT_KEY_DEV,
} = process.env;

let snap;
let midtransApiUrl;

switch (MIDTRANS_ENVIRONMENT) {
  case midtransEnvironment.PRODUCTION:
    snap = new midtransClient.Snap(
      {
        isProduction: true,
        serverKey: MIDTRANS_SERVER_KEY_PROD,
        clientKey: MIDTRANS_CLIENT_KEY_PROD,
      },
    );
    midtransApiUrl = 'https://api.midtrans.com/v2/token';
    break;

  case midtransEnvironment.DEVELOPMENT:
    snap = new midtransClient.Snap(
      {
        isProduction: false,
        serverKey: MIDTRANS_SERVER_KEY_DEV,
        clientKey: MIDTRANS_CLIENT_KEY_DEV,
      },
    );
    midtransApiUrl = 'https://api.sandbox.midtrans.com/v2/token';
    break;

  default:
    snap = new midtransClient.Snap(
      {
        isProduction: false,
        serverKey: MIDTRANS_SERVER_KEY_DEV,
        clientKey: MIDTRANS_CLIENT_KEY_DEV,
      },
    );
    midtransApiUrl = 'https://api.sandbox.midtrans.com/v2/token';
    break;
}

/**
 * Create request transaction in midtrans use snap
 * @param {object} parameter
 * @returns object
 */
const transactionCoin = async (parameter) => {
  const create = await snap.createTransaction(parameter);

  if (!create) throw new ApiError(httpStatus.CONFLICT, 'Pembelian koin gagal.');
  return create;
};

/**
 * Get notification callback from midtrans use snap
 * @param {object} body
 */
const notificationSuccessTransaction = async (body) => {
  const notification = await snap.transaction.notification(body);

  let orderId = notification.order_id;
  let transactionStatus = notification.transaction_status;
  let fraudStatus = notification.fraud_status;
  // console.log('ini notifikasi kartu kredit', notification);
  console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

  let dataTransaction = {
    id: notification.transaction_id,
    paymentType: notification.payment_type,
    status: transactionStatus,
    order_id: orderId,
    paymentAt: notification.settlement_time ? moment(notification.settlement_time).format('YYYY-MM-DD HH:mm:ss') : null,
  };

  // console.log('ini data transaksi', dataTransaction);

  // Ambil data topup untuk mengecek status topup
  const topup = await topupService.topupById(orderId, { include: User });

  if (!topup) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan data topup.');

  let transaction = await TransactionCoin.findOne(
    {
      where: {
        id: notification.transaction_id,
      },
    },
  );

  // Jika sudah ada data transaksi di DB, maka update, jika tidak ada maka buat data
  if (transaction) {
    // console.log('transaksiiiii', transaction);
    Object.assign(transaction, dataTransaction);
    transaction.save();
  } else {
    transaction = await TransactionCoin.create(dataTransaction);
  }

  // console.log('ini awal transaksi', transaction);

  if (transactionStatus == 'capture') {
    if (fraudStatus == 'challenge') {
      dataTransaction = {
        id: notification.transaction_id,
        paymentType: notification.payment_type,
        status: 'challenge',
        order_id: orderId,
        paymentAt: moment(notification.transaction_time).format('YYYY-MM-DD HH:mm:ss'),
      };

      Object.assign(transaction, dataTransaction);
      Object.assign(topup, { statusCoin: PROCESS });

      transaction.save();
      topup.save();
      // console.log('ini status ketika challenge', notification);
      console.log('challenge');
    } else if (fraudStatus == 'accept') {
      dataTransaction = {
        id: notification.transaction_id,
        paymentType: notification.payment_type,
        status: transactionStatus,
        order_id: orderId,
        paymentAt: moment(notification.transaction_time).format('YYYY-MM-DD HH:mm:ss'),
      };

      // console.log('ini transaction', transaction);
      if (topup.statusCoin == PROCESS) {
        const totalSaldo = parseInt(topup.coin) + parseInt(topup.user.coin);
        await userService.updateUserById(topup.userId, { coin: totalSaldo });
      }

      Object.assign(transaction, dataTransaction);
      Object.assign(topup, { statusCoin: DONE });

      transaction.save();
      topup.save();
      // console.log('ini status ketika berhasil/accept', notification);
      console.log('accept');
    }
  } else if (transactionStatus == 'settlement') {
    // const topup = await topupService.topupById(orderId, { include: User });

    // if (!topup) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan data topup.');

    if (topup.statusCoin == PENDING) {
      const totalSaldo = parseInt(topup.coin) + parseInt(topup.user.coin);

      await userService.updateUserById(topup.userId, { coin: totalSaldo });
    }

    Object.assign(topup, { statusCoin: DONE });

    topup.save();

    console.log('settlement');
  } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
    let defineStatus;

    if (transactionStatus == 'cancel') {
      defineStatus = CANCEL;
    } else if (transactionStatus == 'expire') {
      defineStatus = EXPIRE;
    } else {
      defineStatus = REJECT;
    }

    Object.assign(topup, { statusCoin: defineStatus });

    topup.save();

    console.log(`Transaction ${transactionStatus}`);
  } else if (transactionStatus == 'pending') {
    console.log('pending');
  }
};

module.exports = {
  transactionCoin,
  notificationSuccessTransaction,
};
