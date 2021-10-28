const multer = require('multer');

/**
 * Multer disk storage
 * @param {String} path
 * @return {DiskStorage}
 */
const storage = (path) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    const uniqueSuffix = Date.now();
    cb(null, `${fileName}-${uniqueSuffix}`);
  },
});

/**
 * Multer upload image
 * @param {String} path
 * @param {Number} maxFileSize
 * @return {*|Multer}
 */
const uploadImage = (path, maxFileSize) => multer({
  storage: storage(path),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: maxFileSize * (1024 * 1024), // size in MB
  },
});

module.exports = {
  multer,
  uploadImage,
};
