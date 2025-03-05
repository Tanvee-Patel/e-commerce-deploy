const Order = require('../../models/order')
const paypal = require('../../helpers/paypal')
const Cart = require("../../models/cart")
const Product = require("../../models/product")
const util = require('util')
const AdminNotifications = require('../../models/adminNotifications');

const createOrder = async (req, res) => {
   try {

      const { userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount } = req.body;

      if (!userId || !cartId || !cartItems || cartItems.length === 0 || !addressInfo || !totalAmount || !paymentMethod || !paymentStatus) {
         return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const cart = await Cart.findById(cartId).populate("items.productId"); 
      if (!cart) {
         return res.status(404).json({ success: false, message: "Cart not found" });
      }

      const computedTotal = cart.items.reduce((sum, item) => {
         const product = item.productId;
         if (!product || (!product.price && !product.salePrice)) {
            console.error("Product missing price:", product);
            return sum;
         }
         const finalPrice = product.salePrice > 0 ? product.salePrice : product.price;
         return sum + (finalPrice * item.quantity);
      }, 0);

      if (Math.abs(computedTotal - totalAmount) > 0.01) {
         console.error('Total amount mismatch! Please check your calculations.');
         return res.status(400).json({ success: false, message: 'Total amount mismatch' });
      }

      const newOrder = new Order({
         userId,
         cartId,
         cartItems,
         addressInfo,
         orderStatus: orderStatus?.toLowerCase() || "pending",
         totalAmount: computedTotal,
         orderDate: new Date(),
         orderUpdateDate: new Date(),
         paymentMethod,
         paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      });

      const create_payment_json = {
         intent: 'sale',
         payer: {
            payment_method: 'paypal'
         },
         redirect_urls: {
            return_url: `${process.env.FRONTEND_URL}/user/paypal-return?orderId=${newOrder._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/user/paypal-cancel`
         },
         transactions: [
            {
               item_list: {
                  items: cart.items.map(item => {
                     const product = item.productId;
                     const finalPrice = (product.salePrice > 0 ? product.salePrice : product.price) || 0;
                     if (!product || (!product?.price && !product?.salePrice)) {
                        console.error("Product missing price:", product);
                        return null;
                     }
                     return {
                        name: product.title,
                        sku: product._id.toString(),
                        price: finalPrice.toFixed(2),
                        currency: 'USD',
                        quantity: item.quantity
                     }
                  }).filter(Boolean)
               },
               amount: {
                  currency: 'USD',
                  total: totalAmount.toFixed(2).toString()
               },
               description: 'description'
            }
         ]
      }

      paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
         if (error) {
            console.error('PayPal Error:', JSON.stringify(error.response, null, 2));
            return res.status(500).json({
               success: false,
               message: 'Error while creating payment'
            })
         }
         else {
            const createPayment = util.promisify(paypal.payment.create.bind(paypal.payment));
            const paymentInfo = await createPayment(create_payment_json);

            const approvalURL = paymentInfo?.links?.find((link) => link.rel === 'approval_url')?.href;
            newOrder.approvalURL = approvalURL
            await newOrder.save();

            if (!approvalURL) {
               return res.status(500).json({
                  success: false,
                  message: 'Approval URL not found in PayPal response'
               });
            }

            const notification = new AdminNotifications({
               userId: userId,
               message: `New Order Alert! 🛒 Order #${newOrder._id} placed by User ID: ${newOrder.userId}`
            })
            await notification.save();

            const { io, onlineUsers } = require('../../index')
            const adminSocketId = onlineUsers.get('admin')
            if (adminSocketId) {
               io.to(adminSocketId).emit("notification", notification);
            }
            else {
               console.log("Admin is offline");
            }

            await Cart.findByIdAndDelete(cartId);

            res.status(201).json({
               success: true,
               message: 'Order created successfully',
               approvalURL,
               orderId: newOrder._id,  
            });
         }
      })
   } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
         success: false,
         message: 'An error occurred while creating the order'
      });
   }
};

const getAllOrderByUser = async (req, res) => {
   try {
      const { userId } = req.params;
      const orders = await Order.find({ userId })
         .populate({ path: "userId", select: "email username" }) 
         .lean();

      if (!orders.length) {
         return res.status(404).json({
            success: false,
            message: 'No orders found'
         })
      }

      res.status(200).json({
         success: true,
         data: orders
      })

   } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
         success: false,
         message: 'An error occurred while Fetching orders'
      });
   }
}

const getOrderDetails = async (req, res) => {
   try {
      const { id } = req.params
      const order = await Order.findById(id)
         .populate({ path: "userId", select: "email username" }) 
         .lean();

      if (!order) {
         return res.status(404).json({
            success: false,
            message: 'Order not found'
         })
      }

      res.status(200).json({
         success: true,
         data: order
      })

   } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
         success: false,
         message: 'An error occurred while Fetching orders'
      });
   }
}

const capturePayment = async (req, res) => {
   try {
      const { paymentId, payerId, orderId } = req.body;

      if (!paymentId || !payerId || !orderId) {
         return res.status(400).json({
            success: false,
            message: 'Missing payment parameters'
         });
      }

      let order = await Order.findById(orderId)

      if (!order) {
         return res.status(404).json({
            success: false,
            message: 'Order not found'
         })
      }

      const executePayment = util.promisify(paypal.payment.execute.bind(paypal.payment));
      const paymentResponse = await executePayment(paymentId, { payer_id: payerId });

      order.paymentId = paymentId;
      order.payerId = payerId;
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      await order.save();

      for (const item of order.cartItems) {
         const product = await Product.findById(item.productId)
         product.totalStock -= item.quantity;
         await product.save();
      }

      await Cart.findByIdAndDelete(order.cartId);

      res.status(200).json({
         success: true,
         message: "Order Confirmed",
         data: order,
         paymentResponse
      })

   } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({
         success: false,
         message: 'An error occurred while Fetching payment'
      });
   }
}

module.exports = { createOrder, getAllOrderByUser, getOrderDetails, capturePayment };