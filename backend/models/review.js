const mongoose = require('mongoose')

const ProductReviewSchema = new mongoose.Schema({
   productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   ReviewMessage: String,
   reviewValue: Number
}, {
   timestamps: true
})

module.exports = mongoose.model('ProductReview', ProductReviewSchema)