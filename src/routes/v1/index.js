const express = require('express');
const authRoute = require('./authRoute');
const profileRoute = require('./profileRoute');
const schoolRoute = require('./schoolRoute');
const studentRoute = require('./studentRoute');
const teacherRoute = require('./teacherRoute');
const referralRoute = require('./referralRoute');
const availabilityHoursRoute = require('./availabilityHoursRoute');
const curriculumRoute = require('./curriculumRoute');
const referralHistoryRoute = require('./referralHistoryRoute');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/profile',
    route: profileRoute,
  },
  {
    path: '/school',
    route: schoolRoute,
  },
  {
    path: '/student',
    route: studentRoute,
  },
  {
    path: '/teacher',
    route: teacherRoute,
  },
  {
    path: '/referral',
    route: referralRoute,
  },
  {
    path: '/availability-hours',
    route: availabilityHoursRoute,
  },
  {
    path: '/curriculum',
    route: curriculumRoute,
  },
  {
    path: '/referral/history',
    route: referralHistoryRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
