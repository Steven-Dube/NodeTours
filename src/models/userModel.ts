import { isEmail } from 'validator';
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
    validate: [isEmail, 'Provide a valid email']
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
      validator: function(pwdConfirm) {
        return pwdConfirm === this.password
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next): Promise<void> {
  if(!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.isPasswordCorrect = async function(enteredPassword: String, userPassword: String): Promise<Boolean> {
  return await bcrypt.compare(enteredPassword, userPassword);
}

userSchema.methods.changePasswordAfter = function(JWTTimestamp): Boolean {
  if(this.passwordChangedAt) {
    const passwordChangedTimestamp: Number = parseInt(String(this.passwordChangedAt.getTime() / 1000), 10);
    return JWTTimestamp < passwordChangedTimestamp
  }

  return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;