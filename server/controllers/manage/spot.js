const Spot = require('../../models/spot');

/**@type {import('..').NormalApi} */
module.exports = {
  'get /all': async function (req, res, next) {
    const spots = await Spot.find();
    res.json({ code: 0, data: spots });
  },
};
