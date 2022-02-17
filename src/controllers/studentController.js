const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
// const cartService = require('../services/cartService');
const {
  getUserById,
  updateUserById,
  getUserByIds,
  updateProfile,
} = require('../services/userService');
const multering = require('../utils/multer');
const resizing = require('../utils/resizeImage');

const getCurrentStudentProfile = catchAsync(async (req, res) => {
  const { id } = req.user;

  const student = await getUserByIds(id);
  res.sendWrapped(student, httpStatus.OK);
});

const updateCurrentStudentProfie = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { body } = req;
  await updateUserById(id, body);
  const student = await getUserByIds(id);
  res.sendWrapped(student, httpStatus.OK);
});

const createdFilesProfile = catchAsync(async (req, res) => {
  const studentId = req.user.id;
  const destination = 'images/profile';

  multering.options('./', studentId).single('fileProfile')(
    req,
    res,
    async (err) => {
      if (err) {
        res.sendWrapped(err);
      } else {
        if (!req.file.filename) {
          return res.sendWrapped(
            'Please insert file/photo!',
            httpStatus.BAD_REQUEST,
          );
        }

        const profile = await updateProfile(
          studentId,
          `static/${destination}/${req.file.filename}`,
        );

        await resizing(
          req.file.path,
          200,
          200,
          90,
          `./public/${destination}/${req.file.filename}`,
        );

        res.sendWrapped(profile, httpStatus.OK);
      }
    },
  );
});

module.exports = {
  //   viewCart,
  getCurrentStudentProfile,
  updateCurrentStudentProfie,
  createdFilesProfile,
};
