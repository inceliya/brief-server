const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const { authConstants } = require('../constants')

const refresh = async (req, res, next) => {
  //console.log(req);
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(refreshToken, authConstants.signatureRefresh);
    req.admin = await Admin.findOne({ _id: decoded._id });
  } catch (err) {
    return res.sendStatus(401);
  }
  return next();
};


module.exports = refresh;