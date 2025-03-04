import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { filterOptions } from '@/config'

const getCategoryLabel = (categoryId) => {
   const category = filterOptions.category.find(item => item.id === categoryId);
   return category ? category.label : categoryId;
};

const getBrandLabel = (brandId) => {
   const brand = filterOptions.brand.find(item => item.id === brandId);
   return brand ? brand.label : brandId;
};

const ProductTile = ({ product, handleGetProductDetails, handleAddToCart }) => {
   const categoryLabel = getCategoryLabel(product.category)
   const brandLabel = getBrandLabel(product.brand)

   return (
      <Card className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
         <div onClick={() => handleGetProductDetails(product?._id)}>
            <div className='flex justify-center items-center relative'>
               <img
                  src={product.image}
                  alt={product.title}
                  className='h-80 w-auto object-fill rounded-xl'
               />
               {
                  product?.totalStock === 0 ? (
                     <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                        Out of Stock
                     </Badge>
                  ) :
                     product?.totalStock < 10 ? (
                        <Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600'>
                           {`Only ${product?.totalStock} items left`}
                        </Badge>
                     ) :
                        product?.salePrice > 0 ?
                           <Badge className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-xl shadow-lg">
                              Sale
                           </Badge> : null
               }
            </div>
            <CardContent className="p-4">
               <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                  {product?.title?.length > 27 ? `${product.title.slice(0,27)}...` : product?.title}
               </h2>
               <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm text-gray-600'>{categoryLabel}</span>
                  <span className='text-sm text-gray-600'>{brandLabel}</span>
               </div>
               <div className='flex justify-between items-center'>
                  <span className={` ${product.salePrice > 0 ? 'line-through text-gray-500' : "text-primary-600"} text-lg font-semibold`}>
                     ${product?.price}
                  </span>
                  {
                     product?.salePrice > 0 ?
                        <span className='text-lg font-semibold text-primary-600'>${product?.salePrice}</span>
                        : null
                  }
               </div>
            </CardContent>
         </div>
         <CardFooter>
            {
               product?.totalStock === 0 ?
                  <Button className="w-full opacity-60 cursor-not-allowed">
                     Out of stock
                  </Button>
                  : <Button
                     onClick={() => handleAddToCart(product?._id, product?.totalStock)}
                     className="w-full bg-primary-600 hover:bg-primary-700 text-cyan-700 font-semibold py-2 rounded-xl">
                     Add to Cart
                  </Button>
            }

         </CardFooter>
      </Card>
   )
}

export default ProductTile
