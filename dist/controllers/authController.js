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
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');
const signup = userId => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const userWithSameEmail = yield User.findOne({ email });
        if (userWithSameEmail) {
            res.status(409);
        }
        const newUser = yield User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
        const token = signup(newUser._id);
        res.status(200)
            .json({
            user: {
                id: newUser._id,
                name: newUser.name,
                token: token
            }
        })
            .send();
    }
    catch (err) {
        return res.status(500)
            .json({
            message: err
        });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: 'Email and password must be provided'
            });
            return;
        }
        const user = yield User.findOne({ email }).select('+password');
        if (!user || !(yield user.isPasswordCorrect(password, user.password))) {
            res.status(401).json({
                message: 'Incorrect email or password'
            });
            return;
        }
        const token = signup(user._id);
        res.status(200)
            .json({
            user: {
                id: user._id,
                name: user.name,
                token: token
            }
        })
            .send();
    }
    catch (err) {
        res.status(400)
            .json({
            message: err
        });
    }
});
exports.authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        res.status(401).json({
            message: 'You are not logged in'
        });
        return;
    }
    try {
        const decodedPayload = yield promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = yield User.findById(decodedPayload.id);
        if (!user) {
            res.status(401).json({
                message: 'The token is invalid'
            });
            return;
        }
        if (user.changePasswordAfter(decodedPayload.iat)) {
            res.status(401).json({
                message: 'Your password has been changed recently, please login again'
            });
            return;
        }
        next();
    }
    catch (err) {
        res.status(401)
            .json({
            message: 'Invalid token'
        }).send();
    }
});
//# sourceMappingURL=authController.js.map