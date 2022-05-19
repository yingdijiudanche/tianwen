const axios = require('axios');

/**
 * 通過 google api 發送手機通知
 * @param {string} token
 * @param {string} title
 * @param {string} body
 * @param {{msgId?:string,dutyId?:string}} data 如果有dutyId app默認跳轉到duty 詳細
 */
async function send2One(token, title, body, data) {
  const message = {
    notification: {
      title,
      body,
    },
    data,
    to: token,
  };

  return axios.post('https://fcm.googleapis.com/fcm/send', message, {
    headers: {
      Authorization:
        'key=AAAATl95sXs:APA91bGeGSdspRA_ojNk0lUVn0zhLK1_DHB2rv1qcekriicAR4g_ue87T_0nDSAKWdfhArCoP5r0yXt7mPOI_Xq8HHmm2hV2L6Rs6i_vyslJx2KcBqnWq2Fq7VG5-eD9C8MpGReLBiUe',
      Sender: 'id=336609259899',
    },
  });
}

module.exports = { send2One };
