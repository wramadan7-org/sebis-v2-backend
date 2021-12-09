const catchAsync = require('../utils/catchAsync');
const migrateService = require('../services/migrationService');
const httpStatus = require('http-status');
const fs = require('fs');

const listUser = catchAsync(async (req, res) => {
    const user = await migrateService.listUser();

    if (user.length <= 0) {
        return res.sendWraped('Data empty', httpStatus.NOT_FOUND);
    };

    fs.writeFileSync('./public/files/userJson.json', JSON.stringify(user));

    res.sendWrapped(user, httpStatus.CREATED);
})

module.exports = {
    listUser,
};
