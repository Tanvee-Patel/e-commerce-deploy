const express = require("express")

const {addToCart, updateCartItemQuantity, fetchCartItems, deleteCartItem} = require('../../controllers/user/cartController')

const router = express.Router()

router.post('/add',addToCart)
router.get('/get/:userId', fetchCartItems)
router.put('/update-cart', updateCartItemQuantity)
router.delete('/:userId/:productId', deleteCartItem)

module.exports = router;