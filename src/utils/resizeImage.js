const sharp = require('sharp');
const fs = require('fs');

const resizing = async (path, width, height, quality, destination) => {
  await sharp(path)
    .resize(width, height)
    .jpeg({ quality })
    .png()
    .toFile(destination);

  fs.unlinkSync(path);

  return true;
};

module.exports = resizing;
