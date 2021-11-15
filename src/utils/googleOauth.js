const { OAuth2Client } = require('google-auth-library');
const { getUserByEmail, createUser } = require('../services/userService');

const { GOOGLE_CLIENT_ID } = process.env;

const googleAuth = async (idToken) => {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const tiket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = tiket.getPayload();
  let { email, given_name, family_name } = payload;

  const checkUser = await getUserByEmail(email, {
    include: 'role',
  });

  if (!checkUser) {
    const user = await createUser({
      email,
      firstName: given_name,
      lastName: family_name,
      roleId: '437e0221-eb3d-477f-a3b3-799256fbcab6',
      password: '$2b$10$WXit0D6QlUKJZkwwCT7.qu1u3g.u6ivDMp7Fs0qZ3tqYJh/dZXfZO', // 12345678
    });
    const createdUser = await getUserByEmail(user.email, {
      include: 'role',
    });
    return createdUser;
  }
  return checkUser;
};

module.exports = {
  googleAuth,
};
