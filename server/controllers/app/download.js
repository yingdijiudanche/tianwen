const Version = require('../../models/version');
const path = require('path');
const { VersionTypeEnum } = require('../../enums');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  'get /:versionId': async function (req, res, next) {
    let entityById = await Version.findById(req.params.versionId);
    let { platform, version, type } = entityById;
    if (type === VersionTypeEnum.release) {
      version = 'release';
    }
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    let apkPath = path.resolve(__dirname, `../../pkg/${platform}/${version}.apk`);

    res.download(apkPath, 'K-Smart.apk', function (err) {
      //console.log(err);
    });
  },
};
