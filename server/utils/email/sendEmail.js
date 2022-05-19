const config = require('../../config');
const nodemailer = require('nodemailer');

/**
 * @param {(data)=>string} genContent
 * @param {import('nodemailer').Transporter} transporter
 */
function customSend(genContent, transporter) {
  /** @param {EmailParam} param */
  return function ({ receivers, subTitle, content }) {
    transporter.sendMail({
      from: `"RPD system notification" ${config.emailConfig.auth.user}`,
      to: receivers.filter(v => v).join(','),
      subject: subTitle,
      html: genContent(content), // html body
    });
  };
}

/** @param {import('nodemailer').Transporter} transporter */
function directlySend(transporter) {
  /**  @param {EmailParam} param */
  return function ({ receivers, subTitle, content }) {
    transporter.sendMail({
      from: `"RPD system notification" ${config.emailConfig.auth.user}`,
      to: receivers.filter(v => v).join(','),
      subject: subTitle,
      html: content, // html body
    });
  };
}

/**
 *
 * @param {EmailParam[]} datas
 * @param {(data)=>string} [genContent]
 */
function sendEmail(datas, genContent) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(config.emailConfig);
  // send mail with defined transport object
  const sender = genContent ? customSend(genContent, transporter) : directlySend(transporter);

  datas.forEach(sender);
}

module.exports = sendEmail;
/**
 * @typedef {object} EmailParam
 * @property {string[]} receivers
 * @property {string} subTitle
 * @property {any|string} content
 */
