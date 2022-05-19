const dayjs = require('dayjs');
const sendEmailWithAttachment = require('./sendEmailWithAttachment');

/**
 *
 * @param {[SourceData]} datas
 * @returns {String} 富文本
 */
function genEmailContent(data) {
  return `
  <p>Dear guest:</p>
  <p style="line-height: 1.7;">
 KS Headquarters Day Parking Pass has been confirmed as below:
  </br>
  </br>
  <label style="width: 250px;display:inline-block;">Date :</label>${dayjs(data.visitDate).format(
    'YYYY/MM/DD'
  )}
  </br>
  <label style="width: 250px;display:inline-block;">Time (Est.) :</label>${data.timeEst}
  </br>
  <label style="width: 250px;display:inline-block;">Location :</label>LG, WF, Phase 1, Newport Center, 116 Ma Tau Kok Road, TKW.
  </br>
  <label style="width: 250px;display:inline-block;">Car License Plate :</label>${data.licenceNumber}
  </br>
  <label style="width: 250px;display:inline-block;">Contact Person :</label>${data.contactPerson}
  </br>
   </br>
    Please download the attachment to obtain a QR code and scan the QR code when entry or leave car park.
   </br>
   </br>
    The QR code is valid only for the day of your visit and is not transferrable. 
   </br>
   </br>
    Should you encounter any difficulties on the day of your visit, please call [contact No. TBC]
   </br>
   </br>
   Kum Shing Group reserves the right to amend the requirements without notice and to refuse any person from entering the office area.
  </p>
  <p style="line-height: 1.7;">
      Thank you.
      </br>
      Vehicle Management Team
      </br>
     ${dayjs().format('DD MMM YYYY')}
  </p>
  `;
}

function sendVisitorEmail(datas, attachments) {
  // datas.forEach(item => {
  //   console.log(genEmailContent(item.content));
  // });
  sendEmailWithAttachment(datas, attachments, genEmailContent);
}

module.exports = sendVisitorEmail;
