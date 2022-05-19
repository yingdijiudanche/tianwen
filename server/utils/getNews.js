const axios = require('axios');
const xml2js = require('xml2js');
async function parseXML(xml) {
  const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: true,
  });
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

//parse xml form url

async function parseXMLFromURL(url) {
  const res = await axios.get(url);
  const xml = res.data;
  const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: true,
  });
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// parseXMLFromURL('https://www.td.gov.hk/en/special_news/trafficnews.xml').then(res => {
//   console.log(res);
// });
// parseXMLFromURL(
//   'https://www.td.gov.hk/datagovhk_tis/traffic-notices/Special_Traffic_and_Transport_Arrangement.xml'
// ).then(res => {
//   console.log(res);
// });
parseXMLFromURL(
  ' https://www.td.gov.hk/datagovhk_tis/traffic-notices/Notices_on_Temporary_Road_Closure.xml'
).then(res => {
  // console.log(res.List.Notice);
  let notices = res.List.Notice;
  for (let i = 0; i < notices.length; i++) {
    let notice = notices[i];
    console.log(notice.TNID);
    console.log(notice.TrafficNoticesTypeID);
  }
});

var xml = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <ToUserName><![CDATA[gh_d3e07d51b513]]></ToUserName>
    <FromUserName><![CDATA[oR5Gjjl_eiZoUpGozMo7dbBJ362A]]></FromUserName>
    <CreateTime
        >1545019925</CreateTime>
    <MsgType><![CDATA[event]]></MsgType>
    <Event><![CDATA[subscribe]]></Event>
    <EventKey><![CDATA[]]></EventKey>
</xml>`;

// parseXML('xml').then(data => {
//   console.log(data);
// });
