const express = require ('express')
const {searchProducts} = require('../../controllers/user/searchController')

const router = express.Router()

router.get('/:keyword',searchProducts)

module.exports = router;