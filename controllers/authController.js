const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { sendOtpEmail, generateOtp } = require('../utils/mailerServics');

const reg = (req, res) => {
  res.render('pages/register', { user: req.user, title: 'Create Account' });
};

const regPost = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    req.flash('success', 'Account created successfully. You can login now.');
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    req.flash('error', 'Registration failed.');
    res.redirect('/register');
  }
};

const log = (req, res) => {
  res.render('pages/login', { user: req.user, title: 'Login' });
};

const logPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
});

const out = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'Logged out.');
    res.redirect('/login');
  });
};

const forgot = (req, res) => {
  res.render('pages/forgot-password', { user: req.user, title: 'Forgot Password' });
};

const forgotP = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', 'Email not found.');
      return res.redirect('/forgot-password');
    }

    let otp = generateOtp(4);
    console.log("OTP is:", otp);

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpEmail(user.email, otp, user.name);

    req.flash('success', 'OTP sent to your email account.');
    res.redirect('/verify-otp?email=' + user.email);
  } catch (err) {
    console.log(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/forgot-password');
  }
};

const vOtp = (req, res) => {
  res.render('pages/verify-otp', { user: req.user, title: 'Verify OTP', email: req.query.email });
};

const vOtpP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

  if (!user) {
    req.flash('error', 'OTP is invalid or expired.');
    return res.redirect(`/verify-otp?email=${email}`);
  }

  res.render('pages/reset-password', { user: req.user, title: 'Reset Password', email, otp });
};

const reset = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.render('pages/reset-password', { user: req.user, title: 'Reset Password', email, otp });
    }

    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });
    if (!user) {
      req.flash('error', 'Session expired. Try again.');
      return res.redirect('/forgot-password');
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    req.flash('success', 'Password changed successfully!');
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    req.flash('error', 'Error resetting password.');
    res.redirect('/forgot-password');
  }
};

module.exports = { reg, regPost, log, logPost, out, forgot, forgotP, vOtp, vOtpP, reset };
