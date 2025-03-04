const mongoose = require('mongoose')

const FeaturesSchema = new mongoose.Schema({
   image: String
},
   {
      timestamps: true
   }
)

module.exports = mongoose.model("Feature",FeaturesSchema)