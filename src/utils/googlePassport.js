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

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/v1/auth/google/callback',
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

          return userGoogle;
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    },
  ),
);
