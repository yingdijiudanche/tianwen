const config = require('../../config');
const nodemailer = require('nodemailer');

/**
 * @param {(data)=>Buffer[]} attachments
 * @param {import('nodemailer').Transporter} transporter
 * @param {(data)=>string} genContent
 */
function customSend(attachments, transporter, genContent) {
  /** @param {EmailParam} param */
  return function ({ receivers, subTitle, content }) {
    transporter.sendMail({
      from: `"RPD system notification" ${config.emailConfig.auth.user}`,
      to: receivers.filter(v => v).join(','),
      subject: subTitle,
      html: genContent(content), // html body
      attachments: attachments,
    });
  };
}

/**
 * @param {(data)=>Buffer[]} attachments
 * @param {import('nodemailer').Transporter} transporter
 */
function directlySend(attachments, transporter) {
  /**  @param {EmailParam} param */
  return function ({ receivers, subTitle, content }) {
    transporter.sendMail({
      from: `"RPD system notification" ${config.emailConfig.auth.user}`,
      to: receivers.filter(v => v).join(','),
      subject: subTitle,
      html: content, // html body
      attachments: attachments,
    });
  };
}

/**
 *
 * @param {EmailParam[]} datas
 * @param {(data)=>Buffer[]} [attachments]
 * @param {(data)=>string} [genContent]
 */
function sendEmailWithAttachment(datas, attachments, genContent) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(config.emailConfig);
  // send mail with defined transport object
  const sender = genContent
    ? customSend(attachments, transporter, genContent)
    : directlySend(attachments, transporter);

  datas.forEach(sender);
}

module.exports = sendEmailWithAttachment;
/**
 * @typedef {object} EmailParam
 * @property {string[]} receivers
 * @property {string} subTitle
 * @property {any|string} content
 */
