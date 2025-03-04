const express = require('express');
const { getAllOrderOfAllUsers, getAdminOrderDetails, updateOrderStatus } = require('../../controllers/admin/orderController');
const { sendMail } = require ('../../models/mailer')

const router = express.Router();

router.get('/get-orders', getAllOrderOfAllUsers)
router.get('/details/:id', getAdminOrderDetails)
router.put('/update/:id', updateOrderStatus)
router.post('/send-mail', async (req, res) => {
   const { email, orderId, status } = req.body;
   if (!email || !orderId || !status) {
      return res.status(400).json({
         success: false,
         message: "Invalid request"
      });
   }
   try {
      const subject = 'Order Confirmed Successfully!';
      const text = `Dear Customer,\n\nWe’re excited to let you know that your order has been confirmed! 🎉\n\nThank you for shopping with us—we truly appreciate your support. Your order is now being processed, and we’ll keep you updated on its status. \n\n If you have any questions, feel free to reach out.`;

      await sendMail(email, subject, text);
      res.json({ success: true, message: 'Email sent successfully' });
   } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send email' });
   }
})

module.exports = router;