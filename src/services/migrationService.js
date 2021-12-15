const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const axios = require('axios');
const fs = require('fs');
const userService = require('./userService');
const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const moment = require('moment');
const dataJson = require('../../public/files/userJson.json');

const listUser = async () => {
    const user = await axios.get('http://localhost:3000/migrate/user')

    const userMaping = await Promise.all(user.data.data.map(async o => {
        let userType;
        let gender;
        let province;
        let teacherStatus;
        let images;
        let teachExp;
        let eduBackground;

        if (o.userIdentity &&  o.userIdentity.userType == 'admin') {
            userType = 'd33f5a01-7128-4fe0-9af5-af2359a204a2';
        };
        if (o.userIdentity && o.userIdentity.userType == 'administrator') {
            userType = '07487e28-d781-42e7-9e50-a990565e2560';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'pteacher') {
            userType = '584c4a79-9dc5-4fae-9aa0-f49dc6b790f5';
            teacherStatus = 'pending';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'teacher') {
            userType = '437e0221-eb3d-477f-a3b3-799256fbcab6';
            teacherStatus = 'accepted';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'rteacher') {
            userType = 'd39b1062-dcf0-4cb1-b8df-2790af008c46';
            teacherStatus = 'rejected'
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'student') {
            userType = 'a0a76676-e446-49d2-ab7a-ae622783d7b8';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'verifikator') {
            userType = '07348839-b192-450c-b9a2-8416389eacaa';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'finance') {
            userType = 'c5168f64-b5fa-4ebb-94b5-337d7540fedc';
        };
        if (o.userIdentity &&  o.userIdentity.userType == 'public') {
            userType = '1034f7bb-5ec6-447a-80b5-44a0bad040a1';
        };

        if (o.userDetail && o.userDetail.gender) {
            gender = o.userDetail.gender;
        };

        if (o.userDetail && o.userDetail.province) {
            province = o.userDetail.province;
        };

        if (o.userImages && o.userImages.length > 0) {
            images = o.userImages.map(img => {

                const dataImages = {
                    temporaryImageId: (img && img._id) ? img._id : null,
                    temporaryIdentityId: (img && img.identitiesId) ? img.identitiesId : null,
                    userId: 'User id',
                    fileName: (img && img.image) ? img.image : null,
                    fileType: (img && img.type) ? img.type : null,
                };

                return dataImages;
            });
        };

        if (o.userTeachingExperiences && o.userTeachingExperiences.length > 0) {
            teachExp = o.userTeachingExperiences.map(teach => {
                const dataTeachingExperienceDetail = {
                    temporaryTeachingExperienceId: (teach && teach._id) ? teach._id : null,
                    gradeCode: (teach && teach.grade) ? teach.grade : null,
                    subject: (teach && teach.course) ? teach.course : null,
                };

                const dataTeachingExperience = {
                    temporaryTeachingExperienceId: (teach && teach._id) ? teach._id : null,
                    temporaryIdentityId: (teach && teach.identitiesId) ? teach.identitiesId : null,
                    teacherId: (teach && teach.identitiesId) ? teach.identitiesId : null,
                    universityName: (teach && teach.school) ? teach.school : null,
                    univeristyCity: (teach && teach.city) ? teach.city : null,
                    teachingStatus: (teach && teach.status) ? teach.status : null,
                    teachingFrom: (teach && teach.fromDate) ? teach.fromDate : null,
                    teachingTo: (teach && teach.toDate) ? teach.toDate : null,
                    teachingExperienceDetails: dataTeachingExperienceDetail
                };

                return dataTeachingExperience;
            });
        };

        if (o.userEducationBackgrounds && o.userEducationBackgrounds.length > 0) {
            eduBackground = o.userEducationBackgrounds.map(edu => {
                const dataEducationBackground = {
                    temporaryEducationBackground: (edu && edu._id) ? edu._id : null,
                    temporaryIdentityId: (edu && edu.identitiesId) ? edu.identitiesId : null,
                    educationMajor: (edu && edu.major) ? edu.major : null,
                    faculty: '',
                    city: '',
                    educationLevel: (edu && edu.strata) ? edu.strata : null,
                    universityName: (edu && edu.institution) ? edu.institution : null,
                    thesisTitle: (edu && edu.thesis) ? edu.thesis : null,
                    educationGpa: (edu && edu.score) ? edu.score : null,
                    educationFrom: (edu && edu.fromDate) ? edu.fromDate : null,
                    educationTo: (edu && edu.toDate) ? edu.toDate : null,
                    educationCertificate: '',
                    educationTranscript: '',
                };

                return dataEducationBackground;
            });
        };

        const dataUser = {
            temporaryPeopleId: (o.user && o.user._id) ? o.user._id : null,
            temporaryIdentityId: (o.userIdentity && o.userIdentity._id) ? o.userIdentity._id : null,
            email: (o.user && o.user.email) ? o.user.email : null,
            firstName: (o.user && o.user.name && o.user.name.split(' ').length > 1) ? o.user.name.split(' ')[0] : o.user.name,
            lastName: (o.user && o.user.name && o.user.name.split(' ').length > 1) ? o.user.name.split(' ').shift() : '',
            phoneNumber: (o.user && o.user.phone) ? o.user.phone : null,
            password: (o.user && o.user.password) ? o.user.password : null,
            gender: gender ? gender : 'male',
            roleId: userType ? userType : '1034f7bb-5ec6-447a-80b5-44a0bad040a1'
        };

        const dataUserDetail = {
            userId: 'data user id',
            temporaryPeopleId: (o.user && o.user._id) ? o.user._id : null,
            temporaryIdentityId: (o.userIdentity && o.userIdentity._id) ? o.userIdentity._id : null,
            birthPlace: (o.userDetail && o.userDetail.birthPlace) ? o.userDetail.birthPlace : null,
            birthDate: (o.userDetail && o.userDetail.birthDate) ? moment(o.userDetail.birthDate).format('YYYY-MM-DD') : null,
            religion: (o.userDetail && o.userDetail.religion) ? o.userDetail.religion : null,
            idCardType: (o.userDetail && o.userDetail.cardType) ? o.userDetail.cardType : null,
            idCardNumber: (o.userDetail && o.userDetail.cardId) ? o.userDetail.cardId : null,
            mailingAddress: (o.userDetail && o.userDetail.address) ? o.userDetail.address : null,
            city: (o.userDetail && o.userDetail.city) ? o.userDetail.city : null,
            region: province ? province : null,
            postalCode: (o.userDetail && o.userDetail.postalcode) ? parseInt(o.userDetail.postalcode) : null,
            aboutMe: (o.user && o.user.nameEng) ? o.user.nameEng : null,
            priceId: 'Harga',
            teacherStatus: teacherStatus ? teacherStatus : null,
        };

        const dataUserSchool = {
            temporaryPeopleId: (o.user && o.user._id) ? o.user._id : null,
            temporaryIdentityId: (o.userIdentity && o.userIdentity._id) ? o.userIdentity._id : null,
            schoolName: (o.userSchool && o.userSchool.name) ? o.userSchool.name : null,
            schoolAddress: (o.userSchool && o.userSchool.grade) ? o.userSchool.grade : null
        };

        const dataResponse = {
            user: dataUser ? dataUser : null,
            userDetail: dataUserDetail ? dataUserDetail : null,
            userSchool: dataUserSchool ? dataUserSchool : null,
            userImages: images ? images : null,
            userTeachingExperiences: teachExp ? teachExp : null,
            userEducationBackground: eduBackground ? eduBackground : null,
        };

        return dataResponse;
    }));
    // const data = fs.readFileSync('./public/files/userJson.json', 'utf-8');
    // const convertJson = JSON.parse(data);
    // const maping = convertJson.map(o => o);
    // const mapingUser = maping.map(o => o.user);
    // const mapingUserDetail = maping.map(o => o.userDetail);

    // const insertUser = await User.bulkCreate(mapingUser, {validate: false, ignoreDuplicates: true});
    // const insertUserDetail = await UserDetail.bulkCreate()
    // return {
    //     mapingUser,
    //     mapingUserDetail
    // };
    // return insertUser;
};

const addUser = async () => {
    const data = fs.readFileSync('./public/files/userJson.json', 'utf-8');
    const convertJson = JSON.parse(data);
    let arrayResults = [];
    const maping = convertJson.map(o => o);

    for (const loop of maping) {
        const insertUser = await User.create(loop.user);
        arrayResults.push(insertUser);
    };

    return arrayResults;
};

const addUserDetail = async () => {
    const user = await User.findAll();
    const data = fs.readFileSync('./public/files/userJson.json', 'utf-8');
    const convertJson = JSON.parse(data);
    const maping = convertJson.map(o => o.userDetail);

    // set new map
    const map = new Map();
    // IDK
    user.forEach(item => map.set(item.temporaryIdentityId, item));
    maping.forEach(item => map.set(item.temporaryIdentityId, {...map.get(item.temporaryIdentityId), ...item}));
    //IDK
    const merging = Array.from(map.values());

    let arrayResults = [];
    let postalCode = '';

    for (const loop of merging) {
        let birthDate = '01-01-1999';

        if (loop.birthDate) {
            birthDate = moment(loop.birthDate).isValid() === true ? moment(loop.birthDate).format('YYYY-MM-DD') : moment('1999-01-01').format('YYYY-MM-DD');
        }

        if (loop.postalCode && loop.postalCode.length > 11) {
            postalCode = loop.postalCode.slice(0, 10)
        } else {
            postalCode = '111111'
        }

        const dataUserDetail = {
            userId: loop.dataValues.id,
            temporaryPeopleId: loop.dataValues.temporaryPeopleId,
            temporaryIdentityId: loop.dataValues.temporaryIdentityId,
            birthPlace: loop.birthPlace,
            birthDate: birthDate,
            religion: loop.religion,
            idCardType: loop.idCardType,
            idCardNumber: loop.idCardNumber,
            mailingAddress: loop.mailingAddress,
            city: loop.city,
            region: loop.region,
            postalCode: postalCode,
            aboutMe: loop.aboutMe,
            priceId: loop.priceId,
            teacherStatus: loop.teacherStatus,
        };

        const insertUserDetail = await UserDetail.create(dataUserDetail);
        arrayResults.push(insertUserDetail);
    }

    return arrayResults;
};

module.exports = {
    listUser,
    addUser,
    addUserDetail,
};
