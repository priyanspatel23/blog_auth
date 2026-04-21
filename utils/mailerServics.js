const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'priyansbhai250@gmail.com',
    pass: 'gzujdwesawhvalyb',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendOtpEmail = async (toEmail, otp, name = 'User') => {
  try {
    await transporter.sendMail({
      from: 'priyansbhai250@gmail.com',
      to: toEmail,
      subject: 'MyBlog OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h3>Welcome to MyBlog!</h3>
          <p>Hi ${name},</p>
          <p>Use the OTP below to verify your account:</p>
          <h2 style="background: #f4f4f4; padding: 10px; width: fit-content; border-radius: 5px;">${otp}</h2>
          <p>This code will expire in 10 minutes.</p>
          <br>
          <p>Thanks,<br>MyBlog Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.log('mailer error:', err);
  }
};

const generateOtp = (length = 4) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

module.exports = { sendOtpEmail, generateOtp };
