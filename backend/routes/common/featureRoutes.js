const express = require("express")

const { addFeatureImage, getFeatureImages, deleteFeatureImage } = require('../../controllers/admin/featureController')

const router = express.Router()

router.post('/add', addFeatureImage)
router.get('/get', getFeatureImages)
router.delete('/delete/:id',deleteFeatureImage)

module.exports = router;