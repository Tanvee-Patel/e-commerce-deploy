const Order = require("../../models/order")
const Product = require("../../models/product")
const ProductReview = require("../../models/review")
const mongoose = require("mongoose")

const addProductReview = async (req, res) => {
   try {
      const { productId, userId, userName, ReviewMessage, reviewValue } = req.body;
      const order = await Order.findOne({
         userId,
         "cartItems.productId": productId,
         orderStatus: "confirmed"
      })

      if (!order) {
         return res.status(403).json({
            success: false,
            message: "You must have purchased this product to submit a review.",
         });
      }

      const existingReview = await ProductReview.findOne({ productId, userId })
      if (existingReview) {
         return res.status(400).json({
            success: false,
            message: "You have already reviewed this product.",
         });
      }

      const newReview = new ProductReview({
         productId: new mongoose.Types.ObjectId(productId),
         userId: new mongoose.Types.ObjectId(userId),
         ReviewMessage,
         reviewValue,
      })
      await newReview.save()

      const reviews = await ProductReview.find({ productId })
      const totalReviewsLength = reviews.length;
      const avgReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;

      await Product.findByIdAndUpdate(productId, { avgReview })
      res.status(200).json({
         success: true,
         data: newReview
      })

   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error"
      })
   }
}

const getProductReviews = async (req, res) => {
   try {
      const { productId } = req.params;

      const reviews = await ProductReview.find({ productId })
         .populate({
            path: 'userId',
            select: 'username'
         });

      res.status(200).json({
         success: true,
         data: reviews
      })

   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Error"
      })
   }
}

module.exports = { addProductReview, getProductReviews }