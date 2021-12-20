const httpStatus = require('http-status');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const migrateService = require('../services/migrationService');

const listUser = catchAsync(async (req, res) => {
    const user = await migrateService.listUser();

    // if (user.length <= 0) {
    //     return res.sendWraped('Data empty', httpStatus.NOT_FOUND);
    // };

    // fs.writeFileSync('./public/files/userJson.json', JSON.stringify(user));

    res.sendWrapped(user, httpStatus.OK);
});

const addUser = catchAsync(async (req, res) => {
    const user = await migrateService.addUser();
    // fs.writeFileSync('./public/files/userFix.csv', JSON.stringify(user));

    res.sendWrapped(user, httpStatus.CREATED);
});

const addUserDetail = catchAsync(async (req, res) => {
    const userDetail = await migrateService.addUserDetail();

    // fs.writeFileSync('./public/files/userDetailFix.json', JSON.stringify(userDetail));

    res.sendWrapped(userDetail, httpStatus.CREATED);
});

const addTeachingExperiences = catchAsync(async (req, res) => {
    const teachingExperience = await migrateService.addTeachingExperience();

    res.sendWrapped(teachingExperience, httpStatus.CREATED);
});

const addEducationBackground = catchAsync(async (req, res) => {
    const educationBakground = await migrateService.addEducationBackground();

    res.sendWrapped(educationBakground, httpStatus.CREATED);
});

const addBank = catchAsync(async (req, res) => {
    const bank = await migrateService.addBank();

    res.sendWrapped(bank, httpStatus.CREATED);
});

module.exports = {
    listUser,
    addUser,
    addUserDetail,
    addTeachingExperiences,
    addEducationBackground,
    addBank,
};
