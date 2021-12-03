const catchAsync = require('../utils/catchAsync');
const migrateService = require('../services/migrationService');
const httpStatus = require('http-status');

const listUser = catchAsync(async (req, res) => {
    const user = await migrateService.listUser();

    // if (user.data.length <= 0) {
    //     return res.sendWraped('Data empty', httpStatus.NOT_FOUND);
    // };

    // if (user.data.)

    res.sendWrapped(user, httpStatus.CREATED);
})

module.exports = {
    listUser,
};
