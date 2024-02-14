import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');

const signup = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

exports.signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const userWithSameEmail = await User.findOne({ email });

    if(userWithSameEmail) {
      res.status(409).send();
      return;
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
    const token: String = signup(newUser._id);

  res.status(200)
    .cookie('jwt', token, {
      expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
      httpOnly: false,
      secure: true
    })
      .json({
        user: {
          id: newUser._id,
          name: newUser.name
        }
      })
      .send();
  } catch(err) {
    res.status(500)
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
      .cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        secure: true,
        httpOnly: false
    })
      .json({
        user: {
          id: user._id,
          name: user.name
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

exports.logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt;

  if(!token) {
    res.status(401).json({
      message: 'You are not logged in'
    })
    return;
  }

  try {
    res.cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: false,
      secure: true
    })
      .status(200)
      .json({
        message: 'Logged out'
      });
  } catch(err) {
    res.status(500).json({
      message: 'An error occured on the server side'
    }).send();
  }
}

exports.authorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt;

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