const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { getUserByEmail, createUser } = require('../services/userService');

const { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } = process.env;

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  await getUserByEmail(email, (err, user) => {
    done(err, user);
  });
});

const passportSetup = function () {
  return function (req, res, next) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: `${req.protocol}://${req.headers.host}/v1/auth/google/callback`,
          passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {
          try {
            const user = await getUserByEmail(profile.email, {
              include: 'role',
            });
            if (!user) {
              const userGoogle = await createUser({
                email: profile.email,
                firstName: profile.given_name,
                lastName: profile.family_name,
                roleId: '437e0221-eb3d-477f-a3b3-799256fbcab6',
              });
              const userCreated = await getUserByEmail(userGoogle.email, {
                include: 'role',
              });
              return done(null, userCreated);
            }
            return done(null, user);
          } catch (error) {
            console.log(error);
          }
        },
      ),
    );
    next();
  };
};

module.exports = {
  passportSetup,
};
