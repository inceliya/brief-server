const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const { authConstants } = require('../constants')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace("Bearer ", "");
    const decoded = jwt.verify(token, authConstants.signatureAccess);
    const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!admin) {
      throw new Error()
    }
    req.admin = admin;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
}

module.exports = auth;