const mongoose = require('mongoose');
const admin = require('../models/admin');
const menu = require('../models/menu');
const role = require('../models/role');
const Spot = require('../models/spot');
const Permit = require('../models/permit');
const Booking = require('../models/booking');
const Driver = require('../models/driver');
const { hashPassword } = require('../utils/login');

const { parkingSpaceState, chargeType, spotType } = require('../enums');

module.exports = async conn => {
  const [adminsLen, menusLen, rolesLen, spotLen] = await Promise.all([
    admin.countDocuments(),
    menu.countDocuments(),
    role.countDocuments(),
    Spot.countDocuments(),
  ]);

  const initAdmin = async roleId => {
    let password = await hashPassword('123');
    const data = {
      name: 'admin',
      account: 'admin',
      password,
      roleId,
    };
    const superAdmin = new admin(data);
    superAdmin.save();
  };

  // const driverAction = new Driver({
  //   nameEN: "Wayne",
  //   nameCH: "彭小哥",
  //   email: "wayne.peng@kumshing.com.hk",
  //   authDate: new Date(),
  //   type: 1,
  // })
  // const driver = await driverAction.save();

  // const permits = await Permit.find({ licenceNumber: { $ne: 'BB0006' } });
  // await Permit.deleteMany({ licenceNumber: { $ne: 'BB0006' }, type: 1 });
  // await Booking.deleteMany({ _id: { $in: permits.map(item => item.bookingId) } });

  //初始化停车位与车辆信息
  if (spotLen === 0) {
    let spots = [];
    let vehicles = [
      '620604320f29304cc0c99a72',
      '6206052f0f29304cc0c99a81',
      '620605490f29304cc0c99a8e',
      '620605dc0f29304cc0c99a93',
      '620605e70f29304cc0c99a98',
      '620606030f29304cc0c99a9d',
      '6206060e0f29304cc0c99aa2',
      '6206067d0f29304cc0c99aa7',
      '6206068e0f29304cc0c99aac',
      '620606a10f29304cc0c99ab4',
    ];
    let now = [48, 66];
    for (let index = 1; index < 70; index++) {
      let spot = {
        spotNo: index,
        status: 'Out',
        chargeType: chargeType.normal,
        spotType: spotType.normal,
      };
      if (
        index === 26 ||
        index === 27 ||
        index === 44 ||
        index === 45 ||
        index === 46 ||
        index === 47 ||
        index === 48 ||
        index === 65 ||
        index === 66
      )
        spot.spotType = spotType.super;
      if (
        index !== 49 ||
        index !== 52 ||
        index !== 55 ||
        index !== 58 ||
        index !== 61 ||
        index !== 63 ||
        index !== 66 ||
        index !== 68
      ) {
        spot.chargeType = chargeType.charge;
        spot.chargePower = '7KW';
        if (index === 4 || index === 5) {
          spot.chargeType = chargeType.superCharge;
          spot.chargePower = '30KW';
        }
        if (index > 0 && index < 9) {
          spot.status = 'In';
          spot.vehicleId = vehicles[index - 1];
          spot.licenceNumber = index === 10 ? 'BB0010' : `BB000${index}`;
          spot.returnTime = new Date();
        }
        if (index === 29 || index === 50) {
          spot.status = 'In';
          spot.vehicleId = vehicles[index === 29 ? 8 : 9];
          spot.returnTime = new Date();
          spot.licenceNumber = index === 29 ? 'BB0009' : 'BB0010';
        }
      }

      if (index > 27 && index < 44) {
        now[0] = now[0] + 1;
        spot.frontSpotNo = now[0];
      }
      if (index === 12 || index === 13 || index === 14) {
        now[1] = now[1] + 1;
        spot.frontSpotNo = now[1];
      }
      spots.push(spot);
    }
    Spot.insertMany(spots);
  }

  if (rolesLen === 0) {
    const roleEntity = new role({ name: 'Supper Admin' });
    const superRole = await roleEntity.save();
    if (adminsLen === 0) {
      initAdmin(superRole.id);
    }
  }
  if (menusLen === 0) {
    const baseMenus = [
      { sort: 1, path: '/dashboard', component: 'dashboard', name: '仪表盘', hidden: false },
      {
        sort: 2,
        path: '/backstage',
        component: '',
        name: '后台管理',
        hidden: false,
      },
    ];
    menu.insertMany(baseMenus, (err, docs) => {
      const backId = docs.find(f => f.name === '后台管理')._id;
      menu.insertMany([
        {
          pid: backId,
          sort: 1,
          path: '/admin/index',
          component: 'admin/index',
          name: '管理员列表',
          hidden: false,
        },
        {
          pid: backId,
          sort: 2,
          path: '/admin/modify',
          component: 'admin/modify',
          name: '编辑管理员',
          hidden: true,
        },
        {
          pid: backId,
          sort: 4,
          path: '/menu/index',
          component: 'menu/index',
          name: '路由管理',
          hidden: false,
        },
        {
          pid: backId,
          sort: 5,
          path: '/menu/modify',
          component: 'menu/modify',
          name: '编辑路由',
          hidden: true,
        },
        {
          pid: backId,
          sort: 6,
          path: '/role/index',
          component: 'role/index',
          name: '角色列表',
          hidden: false,
        },
        {
          pid: backId,
          sort: 7,
          path: '/role/modify',
          component: 'role/modify',
          name: '编辑角色',
          hidden: true,
        },
      ]);
    });
  }
};
