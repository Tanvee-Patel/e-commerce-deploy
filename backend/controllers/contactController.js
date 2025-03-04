const Contact = require('../models/contact')

const submitContactForm = async (req, res) => {
   try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
         return res.status(400).json({ message: "All fields are required" });
      }

      const newContact = new Contact({ name, email, message });
      await newContact.save();

      res.status(201).json({ message: "Message sent successfully" });

   } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
   }
};

const getMessages = async (req, res) => {
   try {
      const messages = await Contact.find().sort({ createdAt: -1 });
      res.status(200).json(messages);
   } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
   }
};

module.exports = {submitContactForm, getMessages}