const Feature = require("../../models/features")

const addFeatureImage = async(req,res)=>{
   try {
      const { image } = req.body;
      const featureImages = new Feature({
         image
      })

      await featureImages.save();

      res.status(200).json({
         success: true,
         data: featureImages
      })
      
   } catch (error) {
      console.log(error);
      
      res.status(500).json({
         success: false,
         message: 'An error occurred while Fetching orders'
      });
   }
}

const getFeatureImages = async(req,res)=>{
   try {
      const images = await Feature.find({})

      res.status(200).json({
         success: true,
         data: images
      });
      
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'An error occurred while Fetching orders'
      });
   }
}

const deleteFeatureImage = async(req,res)=>{
   try {
      const { id } = req.params;
      const deletedImage = await Feature.findByIdAndDelete(id)

      if (!deletedImage) {
         return res.status(404).json({ success: false, message: "Image not found." });
       }

      res.status(200).json({
         success: true,
         message: "Image deleted successfully."
      });
      
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'An error occurred while Fetching orders'
      });
   }
}

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };