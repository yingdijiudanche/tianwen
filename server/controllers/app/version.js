const Version = require('../../models/version');
const AdminVersion = require('../../models/admin_version');
const path = require('path');
const { VersionTypeEnum } = require('../../enums');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  'get /latest': async function (req, res, next) {
    let { platform, buildNumber } = req.query;

    const { userId } = res.locals;

    await AdminVersion.findOneAndUpdate({ adminId: userId }, { buildNumber }).catch(e => {
      //console.log(e);
    });

    let latest = await findLatestVersion(userId, buildNumber, platform);
    console.log(userId, buildNumber, platform + ' latest:', latest);
    if (latest) return res.json({ code: 0, data: latest });

    res.json({ code: 1 });
  },
};

async function findLatestVersion(userId, buildNumber, platform) {
  let arr = await Version.find({
    buildNumber: { $gt: buildNumber },
    platform,
  }).sort({
    buildNumber: -1,
  });
  if (!arr.length) return null;

  //尝试搜索适合TA的测试版
  let testVersion = arr.find(v => v.memberIds.map(id => id.toString()).includes(userId));
  if (testVersion) return testVersion;

  let latestVer = arr.find(v => v.type === VersionTypeEnum.release);
  if (latestVer) {
    // if any forceUpdate version exists, force update to latest
    if (arr.find(v => v.type === VersionTypeEnum.release && v.forceUpdate)) {
      latestVer = { ...latestVer.toObject(), forceUpdate: true };
    }
  }
  return latestVer;
}
