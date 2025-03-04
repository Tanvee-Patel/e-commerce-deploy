const express = require("express")
const { submitContactForm, getMessages } = require("../../controllers/contactController")

const router = express.Router()

router.post('/contact-form', submitContactForm)
router.get('/messages', getMessages)

module.exports = router;