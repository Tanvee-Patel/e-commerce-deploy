const mongoose = require ('mongoose')
const bcrypt = require ('bcryptjs')

const userSchema = new mongoose.Schema({
   username:{
      type: String,
      required: true,
      trim: true
   },
   email:{
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/
   },
   password:{
      type: String,
      required: true,
      minlength: 6
   },
   role:{
      type: String,
      default: 'user',
      enum: ['user', 'admin']
   }
},
{
   timestamps: true,
})

userSchema.methods.hashPassword = async function() {
   try {
     const salt = await bcrypt.genSalt(10); 
     this.password = await bcrypt.hash(this.password, salt); 
   } catch (error) {
     throw new Error('Error hashing password');
   }
 };
 
 userSchema.methods.comparePassword = async function (password) {
   try {
     const isMatch = await bcrypt.compare(password, this.password);
     return isMatch;  
   } catch (error) {
     throw new Error('Password comparison failed');
   }
};


const user = mongoose.model('User', userSchema)
module.exports = user