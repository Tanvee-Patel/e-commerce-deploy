const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { sendOtp, verifyOtp, resetPassword } = require('../controllers/passwordController');

const register = async (req, res) => {
   const { username, email, password } = req.body;
   try {
      const checkUser = await User.findOne({ email })
      if (checkUser) return res.json({ success: false, message: 'User already exists with same email!' })

      const hashPassword = await bcrypt.hash(password, 10)
      const newUser = new User({
         username, email, password: hashPassword
      })

      await newUser.save()
      res.status(200).json({
         success: true,
         message: 'User registered successfully'
      })
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Some error occured',
      })
   }
}

const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const checkUser = await User.findOne({ email })
      if (!checkUser) {
         return res.json({
            success: false,
            message: "User doesn't exists"
         })
      }

      const isPasswordCorrect = await checkUser.comparePassword(password);

      if (!isPasswordCorrect) {
         return res.status(400).json({
            success: false,
            message: "Incorrect Password"
         });
      }

      const token = jwt.sign({
         id: checkUser._id,
         role: checkUser.role,
         email: checkUser.email,
         username: checkUser.username,
      }, process.env.CLIENT_SECRET_KEY, { expiresIn: '60m' })

      // res.cookie('token',token, {httpOnly: true, secure: true})
      // .json({
      //    success: true,
      //    message: 'Logged in successfully',
      //    user: {
      //       email: checkUser.email,
      //       role: checkUser.role,
      //       id: checkUser._id,
      //       username: checkUser.username,
      //    },
      // })

      res.status(200).
         json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
               email: checkUser.email,
               role: checkUser.role,
               id: checkUser._id,
               username: checkUser.username,
            },
         })

   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Some error occured',
      })
   }
}

const logout = (req, res) => {
   res.clearCookie("token").json({
      success: true,
      message: "Logged out successfully"
   })
}

const authMiddleware = async (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) {
      return res.status(401).json({
         success: false,
         message: 'Unauthorized user'
      })
   }
   try {
      const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
      req.user = decoded;
      next()
   } catch (error) {
      res.status(401).json({
         success: false,
         message: 'Unauthorized user'
      })
   }
}

const forgotPassword = async (req, res) => {
   const { email, action } = req.body;

   try {

      if (action === 'sendOtp') {
         return sendOtp(req, res);
      }

      if (action === 'resetPassword') {
         const otpVerification = await verifyOtp(req, res);
         if (!otpVerification) {
            return res.status(400).json({ error: 'OTP verification failed' });
         }

         req.body.email = email;
         req.body.newPassword = newPassword;
         return resetPassword(req, res);
      }

      return res.status(400).json({ error: 'Invalid action specified' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during the password reset process.' });
   }
};

module.exports = { register, login, logout, authMiddleware, forgotPassword }