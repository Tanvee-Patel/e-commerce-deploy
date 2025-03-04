const express = require ('express');
const { createOrder, getAllOrderByUser, getOrderDetails, capturePayment } = require('../../controllers/user/orderController');

const router = express.Router();

router.post('/create', createOrder)
router.post('/capture', capturePayment)
router.get('/list/:userId', getAllOrderByUser)
router.get('/details/:id', getOrderDetails)

module.exports = router;