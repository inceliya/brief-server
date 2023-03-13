const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authConstants } = require('../constants')

const adminSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }],
});

adminSchema.statics.findOneByCredentials = async (login, password) => {
    const admin = await Admin.findOne({ login });

    if (!admin) {
        throw new Error('Incorrect login');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return admin;
};

adminSchema.methods.generateTokens = async function () {
    const admin = this;
    const token = jwt.sign({ _id: admin._id.toString() }, authConstants.signatureAccess, {
        expiresIn: `${authConstants.accessToeknAge}s`
    });
    const refreshToken = jwt.sign({ _id: admin._id.toString() }, authConstants.signatureRefresh, {
        expiresIn: `${authConstants.refreshTokenAge}s`
    });
    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    return { token, refreshToken };
}

adminSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;