const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const path = require('path');
const imageFunction = require('image-thumbnail');
const formdataParse = require('express-form-data');
const Threshold = 1024 * 500; //大于500k都要生成缩略图
/**@type {imageFunction.Options} */
const thumbOptions = { width: 300 };

const saveThumb = function (buffer, originalPath) {
  const pushIn = pathName => err => {
    if (err) {
      //todo log err
      pathName = pathName.replace(/thumbnail/, 'original');
    }
  };

  let pathName = originalPath.replace(/original/, 'thumbnail');
  fs.writeFile(pathName, buffer, pushIn(pathName));
  return pathName;
};

const fileHandler = formdataParse.parse({ uploadDir: 'uploads/images/original/' });

/**
 *
 * @param {import('express').Request} req
 * @param {*} res
 */
module.exports = function (req, res) {
  fileHandler(req, res, async function (err) {
    let { uploadFile } = req.files;

    let { fileSuffix } = req.body;
    let originalPath = uploadFile.path;
    if (fileSuffix) {
      originalPath = `${uploadFile.path}.${fileSuffix}`;
      fs.renameSync(uploadFile.path, originalPath);
    }

    let thumbPath = '';
    try {
      let p = path.resolve(__dirname, '..', originalPath);
      const buffer = await imageThumbnail(p, thumbOptions);
      thumbPath = saveThumb(buffer, originalPath);
    } catch (error) {
      if (!thumbPath) {
        thumbPath = originalPath;
      }
    }
    let h = 'http';
    if (req.headers['x-forwarded-proto'] === 'https') {
      h = 'https';
    }

    res.json({
      code: 0,
      data: {
        original: `${h}://${req.get('host')}/${originalPath.replace(/\\/g, '/')}`,
        thumb: `${h}://${req.get('host')}/${thumbPath.replace(/\\/g, '/')}`,
      },
    });
  });
};
