const express = require('express')
const { addAddress,
   fetchAllAddress,
   deleteAddress,
   editAddress } = require('../../controllers/user/addressController')

const router = express.Router()

router.post('/add', addAddress)
router.get('/get/:userId', fetchAllAddress)
router.put('/update/:userId/:addressId', editAddress)
router.delete('/delete/:userId/:addressId', deleteAddress)

module.exports = router;