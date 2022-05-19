const dayjs = require('dayjs');
const QRCode = require('qrcode');
const mongoose = require('mongoose');
const Visitor = require('../../models/visitor');
const Permit = require('../../models/permit');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');
const sendVisitorEmail = require('../../utils/email/sendVisitorEmail');
const { PermitStatus, PermitType } = require('../../enums');

function base64ToArrayBuffer(base64) {
  let binary_string = window.atob(base64);
  let len = binary_string.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**@type {import('..').NormalApi} */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    let { status, ...rest } = condition;
    if (status) {
      const permits = await Permit.find({ status });
      rest._id = { $in: permits.map(b => b.visitorId) };
    }

    const permission =
      res.locals.isAdmin || res.locals.roleName.includes('Fleet')
        ? {}
        : {
            adminId: res.locals.userId,
          };
    const result = await getPageData(
      Visitor,
      {
        ...rest,
        ...permission,
        sort: { addTime: -1 },
      },
      {
        populate: 'permit applicant deptName',
      }
    );

    res.json(result);
  },
  'post ': async function (req, res, next) {
    let emailData = ({ fullName, visitDate, timeEst, contactPerson } = req.body);
    const visitorCount = (await Permit.countDocuments({ type: PermitType.Visitor })) + 1;
    const refNo = Number(`${dayjs().year()}00000`) + visitorCount;

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let err = null;

      const visitorAction = new Visitor({ ...req.body, applicantId: res.locals.userId, refNo });
      visitorAction.$session(session);
      const visitor = await visitorAction.save().catch(e => (err = e));
      if (err) throw err;

      const permitAction = new Permit({
        adminId: res.locals.userId,
        visitorId: visitor._id,
        type: PermitType.Visitor,
        //可提前30分钟取车
        activeFrom: dayjs(req.body.visitDate).add(-30, 'minute'),
        activeTo: dayjs(req.body.visitDate).add(1, 'day'),
        status: PermitStatus.Waiting,
      });
      permitAction.$session(session);
      const permitEntity = await permitAction.save().catch(e => (err = e));
      if (err) throw err;
      emailData.qrCode = await QRCode.toDataURL(permitEntity._id.toString(), '', {
        width: 500,
      });
    });

    sendVisitorEmail(
      req.body.carPlateNos.map((v, i) => {
        return {
          receivers: [v.email],
          subTitle: `Day Parking Pass - Entry to the KS Headquarters (ref. no: ${refNo}-${i + 1})`,
          content: {
            ...emailData,
            licenceNumber: v.licenceNumber,
            timeEst: emailData.timeEst.map(time => dayjs(time).format('HH:mm')).join(' - '),
          },
        };
      }),
      [
        {
          filename: 'QR code.png',
          content: emailData.qrCode.split('base64,')[1],
          encoding: 'base64',
        },
      ]
    );
    res.sendStatus(200);
  },
  'put /:id': async function (req, res, next) {
    let { ...body } = req.body;
    let emailData = ({ fullName, visitDate, timeEst, contactPerson } = req.body);
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let err = null;
      let visitorAction = await Visitor.findByIdAndUpdate(req.params.id, { ...body })
        .session(session)
        .catch(e => (err = e));
      if (err) throw err;
      emailData.refNo = visitorAction.refNo;
      let permitAction = await Permit.findOneAndUpdate(
        { visitorId: req.params.id },
        {
          activeFrom: dayjs(body.visitDate).add(-30, 'minute'),
          activeTo: dayjs(body.visitDate).add(1, 'day'),
        }
      )
        .session(session)
        .catch(e => (err = e));
      if (err) throw err;

      emailData.qrCode = await QRCode.toDataURL(permitAction.id.toString(), '', {
        width: 500,
      });
    });

    sendVisitorEmail(
      req.body.carPlateNos.map((v, i) => {
        return {
          receivers: [v.email],
          subTitle: `Day Parking Pass - Entry to the KS Headquarters (ref. no: ${emailData.refNo}-${
            i + 1
          })`,
          content: {
            ...emailData,
            licenceNumber: v.licenceNumber,
            timeEst: emailData.timeEst.map(time => dayjs(time).format('HH:mm')).join(' - '),
          },
        };
      }),
      [
        {
          filename: 'QR code.png',
          content: emailData.qrCode.split('base64,')[1],
          encoding: 'base64',
        },
      ]
    );
    res.sendStatus(200);
  },
  'delete /:id': async function (req, res, next) {
    await Visitor.findByIdAndUpdate(req.params.id, { deleFlag: Date.now() });
    res.sendStatus(200);
  },
};
