import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');

const signup = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

exports.signup = async (req: Request, res: Response)  => {
  try {
    const { email } = req.body;
    const userWithSameEmail = await User.findOne({ email });

    if(userWithSameEmail) {
      res.status(409);
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
    const token: String = signup(newUser._id);

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Set-Cookie": `cookieHTTP=test;httponly;max-age=${60 * 60 * 24}`
    })
      .json({
        user: {
          id: newUser._id,
          name: newUser.name,
          token: token
        }
      })
      //.send();
  } catch(err) {
    return res.status(500)
      .json({
        message: err
      });
  }
}

exports.login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
     res.status(400).json({
        message: 'Email and password must be provided'
      });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if(!user || !await user.isPasswordCorrect(password, user.password)) {
      res.status(401).json({
        message: 'Incorrect email or password'
      })
      return;
    }

    const token: String = signup(user._id);
    res.status(200)
      .json({
        user: {
          id: user._id,
          name: user.name,
          token: token
        }
      })
      .send();
  } catch(err) {
    res.status(400)
      .json({
        message: err
      });
  }
}

exports.authorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: String;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token) {
    res.status(401).json({
      message: 'You are not logged in'
    })
    return;
  }

  try {
    const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedPayload.id);

    if(!user) {
      res.status(401).json({
        message: 'The token is invalid'
      })
      return;
    }

    if(user.changePasswordAfter(decodedPayload.iat)) {
      res.status(401).json({
        message: 'Your password has been changed recently, please login again'
      })
      return;
    }

    next();
   } catch(err) {
    res.status(401)
      .json({
      message: 'Invalid token'
    }).send()
  }
}