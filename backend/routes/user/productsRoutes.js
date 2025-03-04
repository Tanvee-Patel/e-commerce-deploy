const express = require ('express')
const {getFilteredProducts, getProductDetails} = require('../../controllers/user/productsController')

const router = express.Router()

router.get('/get',getFilteredProducts)
router.get('/get/:id', getProductDetails)

module.exports = router;