const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// Route to request password reset

router.post('/request-password-reset', authController.requestPasswordReset);

// Route to reset password
router.post('/reset-password', authController.resetPassword);
module.exports = router;
