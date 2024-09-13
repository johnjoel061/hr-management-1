// Require necessary modules
const bcrypt = require('bcrypt');


// User Model
const User = require('../models/userModel');

// Generate Verification Code and Send Email
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 character code

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    // Send verification code to user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'alfabetejohnjoel@gmail.com',
        pass: 'HYPERTEXTTRANSFERPROTOCOL1724',
      },
    });

    const mailOptions = {
      from: 'alfabetejohnjoel@gmail.com',
      to: user.email,
      subject: 'Password Reset Verification Code',
      text: `Your verification code is ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 'success',
      message: 'Verification code sent to email',
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};

// Verify Code and Update Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, verificationCode, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== verificationCode || user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification code',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};
