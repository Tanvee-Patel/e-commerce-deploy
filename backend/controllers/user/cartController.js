const Cart = require("../../models/cart")
const Product = require("../../models/product")

const addToCart = async (req, res) => {
   try {
      const { userId, productId, quantity } = req.body;

      if (!userId || !productId || quantity <= 0) {
         return res.status(400).json({
            success: false,
            message: 'Invalid data provided!'
         })
      }

      const product = await Product.findById(productId)
      if (!product) {
         return res.status(404).json({
            success: false,
            message: 'Product not found'
         })
      }

      let cart = await Cart.findOne({ userId })

      if (!cart) {
         cart = new Cart({ userId, items: [] })
      }

      const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId)
      if (findCurrentProductIndex === -1) {
         cart.items.push({ productId, quantity })
      }
      else {
         cart.items[findCurrentProductIndex].quantity += quantity
      }

      await cart.save();
      res.status(200).json({
         success: true,
         data: cart
      })


   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: 'Error'
      })
   }
}

const fetchCartItems = async (req, res) => {
   try {
      const { userId } = req.params
      if (!userId) {
         return res.status(400).json({
            success: false,
            message: 'User Id is mandatory'
         })
      }

      const cart = await Cart.findOne({ userId }).populate({
         path: 'items.productId',
         select: 'image title price salePrice totalStock'
      })

      if (!cart) {
         return res.status(404).json({
            success: false,
            message: 'Cart not found!'
         })
      }

      const validItems = cart.items.filter(productItem => productItem.productId)
      if (validItems.length < cart.items.length) {
         cart.items = validItems
         await cart.save()
      }

      const populateCartItems = validItems.map(item => ({
         productId: item.productId._id,
         image: item.productId.image,
         title: item.productId.title,
         price: item.productId.price,
         salePrice: item.productId.salePrice,
         totalStock: item.productId.totalStock,
         quantity: item.quantity
      }))

      return res.status(200).json({
         success: true,
         data: {
            ...cart._doc,
            items: populateCartItems
         }
      });

   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: 'Error'
      })
   }
}

const updateCartItemQuantity = async (req, res) => {
   try {
      const { userId, items } = req.body;

      if (!userId || !items || !Array.isArray(items) || items.some(item => !item.productId || item.quantity <= 0)) {
         return res.status(400).json({
            success: false,
            message: "Invalid data provided"
         });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
         return res.status(404).json({
            success: false,
            message: "Cart not found"
         });
      }

      for (const { productId, quantity } of items) {
         const productIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

         if (productIndex === -1) {
            return res.status(404).json({
               success: false,
               message: `Item with productId ${productId} not found in cart`
            });
         }
         const product = await Product.findById(productId);
         if (!product) {
            return res.status(404).json({
               success: false,
               message: "Product not found"
            })
         }
         if (quantity > product.totalStock) {
            return res.status(400).json({
               success: false,
               message: `Only ${product.totalStock} items are available`
            });
         }

         cart.items[productIndex].quantity = quantity;
      }

      await cart.save();

      await cart.populate({
         path: 'items.productId',
         select: "image title price salePrice totalStock"
      });

      const populatedItems = cart.items.map(item => ({
         productId: item.productId ? item.productId._id : null,
         image: item.productId ? item.productId.image : null,
         title: item.productId ? item.productId.title : "Product not found",
         price: item.productId ? item.productId.price : null,
         salePrice: item.productId ? item.productId.salePrice : null,
         totalStock: item.productId.totalStock,
         quantity: item.quantity
      }));

      return res.status(200).json({
         success: true,
         data: {
            ...cart._doc,
            items: populatedItems
         }
      });

   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Error'
      });
   }
};


const deleteCartItem = async (req, res) => {
   try {
      const { userId, productId } = req.params
      if (!userId || !productId) {
         return res.status(400).json({
            success: false,
            message: "Provided data is INVALID"
         });
      }

      const cart = await Cart.findOneAndUpdate(
         { userId },
         { $pull: { items: { productId } } },
         { new: true }
      ).populate({
         path: "items.productId",
         select: "image title price salePrice"
      })
      if (!cart) {
         return res.status(404).json({
            success: false,
            message: "Cart not found!"
         });
      }

      cart.items = cart.items.filter(item => item.productId._id.toString() !== productId)
      await cart.save();
      await cart.populate("items.productId", "image title price salePrice")

      const populateCartItems = cart.items.map((item) => ({
         productId: item.productId ? item.productId : null,
         image: item.productId ? item.productId.image : null,
         title: item.productId ? item.productId.title : "Product not found",
         price: item.productId ? item.productId.price : null,
         salePrice: item.productId ? item.productId.salePrice : null,
         quantity: item.quantity
      }))

      return res.status(200).json({
         success: true,
         data: {
            ...cart._doc,
            items: populateCartItems
         }
      });

   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: 'Internal server error'
      })
   }
}

module.exports = {
   addToCart,
   updateCartItemQuantity,
   fetchCartItems,
   deleteCartItem
}