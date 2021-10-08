const express = require('express');
const authRoute = require('./authRoute');
const profileRoute = require('./profileRoute');
const schoolRoute = require('./schoolRoute');
const studentRoute = require('./studentRoute');

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
