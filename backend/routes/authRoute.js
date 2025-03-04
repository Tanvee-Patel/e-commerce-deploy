const express = require('express')
const {register, login, logout, authMiddleware, forgotPassword} = require ('../controllers/authController');
const { sendOtp, verifyOtp, resetPassword, resetPasswordRequest } = require('../controllers/passwordController');

const router = express.Router();

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/check-auth',authMiddleware, (req,res)=>{
   const user =req.user
   res.status(200).json({
      success: true,
      message: 'Authenticated user!',
      user
   })
})
router.post('/send-otp', sendOtp)
router.post('/forgot-password',forgotPassword)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)
router.post('/reset-password-request', resetPasswordRequest)

module.exports = router