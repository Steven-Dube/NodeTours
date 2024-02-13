"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("validator");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user needs a name']
    },
    email: {
        type: String,
        required: [true, 'A user needs an email'],
        unique: true,
        lowercase: true,
        validate: [validator_1.isEmail, 'Provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Provide a password'],
        minLength: 6
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Provide a confirm password'],
        validate: {
            validator: function (pwdConfirm) {
                return pwdConfirm === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: Date
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = yield bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    });
});
userSchema.methods.isPasswordCorrect = function (enteredPassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(enteredPassword, userPassword);
    });
};
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(String(this.passwordChangedAt.getTime() / 1000), 10);
        return JWTTimestamp < passwordChangedTimestamp;
    }
    return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
//# sourceMappingURL=userModel.js.map