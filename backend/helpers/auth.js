const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const hashPassword = async (password) => {
  try {
    if (!password) {
      throw new Error('Password is missing');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error in hashPassword:', error);
    throw error;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error in comparePassword:', error);
    throw error;
  }
};

const generateResetToken = (user) => {
  const jwtSecretKey = process.env.JWT_SECRET;
  if (!jwtSecretKey) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return null;
  }
  const resetToken = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '2h' });
  return resetToken;
};


module.exports = { hashPassword, comparePassword, generateResetToken };