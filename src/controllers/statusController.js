const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const cartService = require('../services/cartService');
const scheduleService = require('../services/scheduleService');
const userService = require('../services/userService');
const { Schedule } = require('../models/Schedule');
const { TutoringTransactionDetail } = require('../models/TutoringTransactionDetail');
const { CartItem } = require('../models/CartItem');

const {
  PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, PROCESS, DONE,
} = process.env;

const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { model, status } = req.body;

  status = status.toLowerCase();
  model = model.toLowerCase();

  const validStatus = [PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, PROCESS, DONE];

  if (validStatus.some((valid) => status.includes(valid))) {
    if (model == 'cart') {
      const cart = await CartItem.update(
        {
          cartItemStatus: status,
        },
        {
          where: {
            id,
          },
        },
      );

      if (!cart) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengganti status.');

      return res.sendWrapped(cart, httpStatus.OK);
    } if (model == 'schedule') {
      const schedule = await scheduleService.getScheduleById(id, { include: TutoringTransactionDetail });

      if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Jadwal les tidak ditemukan.');

      const user = await userService.getUserById(schedule.studentId);

      if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User tidak ditemukan');

      const validStatusUpdateReducePoint = [REJECT, CANCEL, EXPIRE];
      const validStatusUpdateUnreducePoint = [PENDING, ACCEPT, PROCESS, DONE];

      if (validStatusUpdateReducePoint.some((o) => status.includes(o))) {
        const total = schedule.tutoringTransactionDetails[0].price + user.coin;

        const reducePoint = await userService.updateUserById(user.id, { coin: total });

        if (!reducePoint) throw new ApiError(httpStatus.CONFLICT, 'Gagal melakukan pengembalian point');

        const updateSchedule = await Schedule.update(
          {
            statusSchedule: status,
          },
          {
            where: {
              id,
            },
          },
        );

        if (!updateSchedule) throw new ApiError(httpStatus.CONFLICT, 'Gagal merubah status jadwal les.');

        const data = {
          status,
          pengembalianPoint: schedule.tutoringTransactionDetails[0].price,
          pointSemula: user.coin,
          totalPoint: total,
        };

        return res.sendWrapped(data, httpStatus.OK);
      } if (validStatusUpdateUnreducePoint.some((o) => status.includes(o))) {
        const updateStatusSchedule = await Schedule.update(
          {
            statusSchedule: status,
          },
          {
            where: {
              id,
            },
          },
        );

        return res.sendWrapped(updateStatusSchedule, httpStatus.OK);
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Masukkan kategory antara cart dan schedule');
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Harap masukkan status dengan benar.');
  }
});

module.exports = {
  updateStatus,
};
