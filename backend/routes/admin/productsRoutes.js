const express = require ('express')
const { upload } = require('../../helpers/cloudinary')
const { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct } = require('../../controllers/admin/productsController')

const router = express.Router()

router.post('/upload-image', upload.single('my_file'), handleImageUpload)
router.post('/add',addProduct)
router.put('/edit/:id',editProduct)
router.delete('/delete/:id',deleteProduct)
router.get('/get',fetchAllProducts)

module.exports = router; 