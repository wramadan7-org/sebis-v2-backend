const express = require('express');
const authRoute = require('./authRoute');
const schoolRoute = require('./schoolRoute');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/school',
    route: schoolRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
