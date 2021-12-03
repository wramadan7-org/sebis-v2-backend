const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const axios = require('axios');
const fs = require('fs');
const userService = require('./userService');
const { User } = require('../models/User');

const listUser = async () => {
    const user = await axios.get('http://localhost:3000/migrate/user')

    const userMaping = await Promise.all(user.data.data.map(async o => {
        let userType;
        let gender;

        if (o.userIdentity &&  o.userIdentity.userType == 'pteacher') {
            userType = '4992fe1d-ba37-4b86-a132-a479aa62891d';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'teacher') {
            userType = '437e0221-eb3d-477f-a3b3-799256fbcab6';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'rteacher') {
            userType = '0799588b-6b94-4a80-90ad-2a80e908c389';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'student') {
            userType = 'a0a76676-e446-49d2-ab7a-ae622783d7b8';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'public') {
            userType = '1034f7bb-5ec6-447a-80b5-44a0bad040a1';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'verifikator') {
            userType = '07348839-b192-450c-b9a2-8416389eacaa';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'finance') {
            userType = 'c5168f64-b5fa-4ebb-94b5-337d7540fedc';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'admin') {
            userType = 'd33f5a01-7128-4fe0-9af5-af2359a204a2';
        };

        if (o.userDetail && o.userDetail.gender) {
            gender = o.userDetail.gender;
        }

        const dataUser = {
            temporaryPeopleId: (o.user && o.user._id) ? o.user._id : '',
            temporaryIdentityId: (o.userIdentity && o.userIdentity._id) ? o.userIdentity._id : '',
            email: o.user.email,
            firstName: o.user.name.split(' ').length > 1 ? o.user.name.split(' ')[0] : o.user.name,
            lastName: o.user.name.split(' ').length > 1 ? o.user.name.split(' ').shift() : '',
            phoneNumber: o.user.phone,
            password: o.user.password,
            gender: gender ? gender : 'male',
            roleId: userType ? userType : '1034f7bb-5ec6-447a-80b5-44a0bad040a1'
        }

        // const inserting = await User.create(dataUser)
        // console.log(inserting)
        // const dataUserDetail = {

        // }

        return dataUser;
    }));

    console.log('user', listUser.length)
    return userMaping;
}

module.exports = {
    listUser,
};
