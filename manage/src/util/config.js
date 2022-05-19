const domain = `${window.location.origin.split(":")[1]}:31015/api/manage`; //测试服
// const domain = `https://metamedia.kumshing.com.hk:40443/api/manage`; //正式服

export default {
  footerText: 'Copyright Company Name © 2018',
  ApiDomain: `${domain}`,
  baseName: '/manage',
  /**图片上传接口 */
  uploadUrl: `${domain}/api/upload`, //NeedSync /upload
  /**最多可添加规格数量，目前允许三个 */
  maxSpecifyNum: 3,
}
