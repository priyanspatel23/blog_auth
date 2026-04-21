const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.reg);
router.post('/register', authController.regPost);

router.get('/login', authController.log);
router.post('/login', authController.logPost);

router.get('/logout', authController.out);

router.get('/forgot-password', authController.forgot);
router.post('/forgot-password', authController.forgotP);

router.get('/verify-otp', authController.vOtp);
router.post('/verify-otp', authController.vOtpP);

router.post('/reset-password', authController.reset);

module.exports = router;