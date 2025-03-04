const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart', required: true
   },
   cartItems: [
      {
         productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
         },
         title: String,
         image: String,
         price: Number,
         salePrice: Number,
         quantity: Number
      }
   ],
   addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
      Notes: String
   },
   orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
   },
   paymentId: String,
   paymentMethod: {
      type: String,
      enum: ['cod', 'paypal']
   },
   paymentStatus: {
      type: String,
      enum: ['pending', 'paid']
   },
   payerId: String,
   totalAmount: Number,
   orderDate: Date,
   orderUpdateDate: Date
})

module.exports = mongoose.model('Order', OrderSchema)