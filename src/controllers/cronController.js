const httpStatus = require('http-status');
const moment = require('moment');
const { Op, Transaction } = require('sequelize');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const { Schedule } = require('../models/Schedule');
const { TutoringTransaction } = require('../models/TutoringTransaction');
const { TutoringTransactionDetail } = require('../models/TutoringTransactionDetail');

const scheduleService = require('../services/scheduleService');
const userService = require('../services/userService');

const {
  PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, PROCESS, DONE,
} = process.env;

const cronJobCartPendingTwoHoursBeforeLes = async () => {
  const twoHoursBeforeLes = moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:00');

  const cartItem = await CartItem.findAll(
    {
      where: {
        cartItemStatus: PENDING,
        startTime: twoHoursBeforeLes,
      },
    },
  );

  if (cartItem || cartItem.length > 0) {
    const itemId = cartItem.map((o) => o.id);

    await CartItem.update(
      {
        cartItemStatus: EXPIRE,
      },
      {
        where: {
          id: {
            [Op.in]: itemId,
          },
        },
      },
    );
  }
};

const cronJobExpireScheduleLes = async (req, res) => {
  const twoHoursBeforeLes = moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:00');
  const aDayBeforeNow = moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:00');

  // proses kadaluarsa 2jam sebelum les dimulai status masih pending
  const schedulePending = await Schedule.findAll(
    {
      where: {
        [Op.or]: [
          {
            dateSchedule: twoHoursBeforeLes,
            statusSchedule: PENDING,
          },
          {
            createdAt: aDayBeforeNow,
            statusSchedule: PENDING,
          },
        ],
      },
      include: [
        {
          model: TutoringTransactionDetail,
        },
      ],
    },
  );

  let arrayData = [];
  let values = [];

  if (schedulePending || schedulePending.length > 0) {
    // update saldo murid
    for (const loopSchedule of schedulePending) {
      const data = {
        userId: loopSchedule.studentId,
        price: loopSchedule.tutoringTransactionDetails.length ? loopSchedule.tutoringTransactionDetails[0].price : 0,
      };

      arrayData.push(data);
    }

    const map = new Map(arrayData.map(({ userId, price }) => [userId, { userId, price: [] }]));
    for (let { userId, price } of arrayData) map.get(userId).price.push(...[price].flat());
    const result = [...map.values()];
    values.push(...result);

    for (const loopValues of values) {
      const checkPoint = await userService.getUserById(loopValues.userId);
      const sum = loopValues.price.reduce((paritalSum, a) => paritalSum + a, 0);
      const data = {
        userId: loopValues.userId,
        total: sum + checkPoint.point,
      };
      // await userService.updateUserById(loopValues.userId, { point: data.total });
    }

    const mapScheduleId = schedulePending.map((o) => o.id);
    await Schedule.update(
      {
        statusSchedule: EXPIRE,
      },
      {
        where: {
          id: {
            [Op.in]: mapScheduleId,
          },
        },
      },
    );
  }
};

module.exports = {
  cronJobCartPendingTwoHoursBeforeLes,
  cronJobExpireScheduleLes,
};
