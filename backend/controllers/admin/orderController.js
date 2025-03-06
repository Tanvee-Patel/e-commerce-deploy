const Order = require('../../models/order')
const Notifications = require('../../models/notifications');

const getAllOrderOfAllUsers = async (req, res) => {
   try {
      const orders = await Order.find()
         .populate({
            path: "userId",
            select: "email username"
         })

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

const getAdminOrderDetails = async (req, res) => {
   try {
      const { id } = req.params;
      const order = await Order.findById(id)
         .populate({
            path: "userId",
            select: "email username"
         })

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

const updateOrderStatus = async (req, res) => {
   try {
      const { id } = req.params;
      const { orderStatus } = req.body;
      const order = await Order.findById(id).populate('userId')

      if (!order) {
         return res.status(404).json({
            success: false,
            message: 'Order not found'
         })
      }
      const userId = order.userId._id;
      order.orderStatus = orderStatus;
      await order.save()

      const notification = new Notifications({
         userId: userId,
         message: `Your order #${id} status changed to ${orderStatus}`
      })
      await notification.save()

      const { io, onlineUsers } = require("../../index")
      const userSocketId = onlineUsers.get(userId.toString());

      if (userSocketId) {
         console.log(`📤 Sending notification to ${userSocketId}`);
         io.to(userSocketId).emit("notification", notification);
         io.emit("adminOrderUpdated", {
            orderId: id,
            status: orderStatus
         })
      } else {
         console.log(`⚠️ User ${userId} is offline, can't send notification.`);
      }

      res.status(200).json({
         success: true,
         message: "Order status is updated",
         data: orderStatus
      })

   } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
         success: false,
         message: 'An error occurred while Fetching orders'
      });
   }
}

module.exports = { getAllOrderOfAllUsers, getAdminOrderDetails, updateOrderStatus };