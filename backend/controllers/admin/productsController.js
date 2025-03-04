const { imageUploadUtils } = require("../../helpers/cloudinary");
const Product = require ('../../models/product')

const handleImageUpload = async (req, res) => {
   try {
      const b64 = Buffer.from(req.file.buffer).toString('base64')
      const url = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await imageUploadUtils(url);

      res.json({
         success: true,
         result
      })

   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: 'Error occured'
      })

   }
};

const addProduct = async (req, res) => {
   try {
      const {
         image,
         title,
         description,
         category,
         brand,
         price,
         salePrice,
         totalStock
      } = req.body
      const newlyCreatedProduct = new Product({
         image,
         title,
         description,
         category,
         brand,
         price,
         salePrice,
         totalStock
      })
      await newlyCreatedProduct.save();
      res.status(201).json({
         success: true,
         data: newlyCreatedProduct
      })
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Error'
      })

   }
}

const fetchAllProducts = async (req, res) => {
   try {
      const listOfProducts = await Product.find({});
      res.status(200).json({
         success: true,
         data: listOfProducts
      })
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Error'
      })

   }
}

const editProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
      let findProduct = await Product.findById(id)
      if (!findProduct) return res.status(404).json({
         success: false,
         message: "Product not found"
      })

      findProduct.image = image || findProduct.image
      findProduct.title = title || findProduct.title
      findProduct.description = description || findProduct.description
      findProduct.category = category || findProduct.category
      findProduct.brand = brand || findProduct.brand
      findProduct.price = price === '' ? 0 : price|| findProduct.price
      findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice
      findProduct.totalStock = totalStock || findProduct.totalStock

      await findProduct.save();
      res.status(200).json({
         success: true,
         data: findProduct
      })

   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Error'
      })

   }
}

const deleteProduct = async (req, res) => {
   try {
      const { id } = req.params
      const product = await Product.findByIdAndDelete(id)
      if (!product) return res.status(404).json({
         success: false,
         message: "Product not found"
      })

      res.status(200).json({
         success: true,
         message: "Product deleted successfully"
      })

   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Error'
      })

   }
}

module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct }