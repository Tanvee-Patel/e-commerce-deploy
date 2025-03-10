import ProductDetails from '@/components/shopping/ProductDetails'
import ProductTile from '@/components/shopping/ProductTile'
import { Input } from '@/components/ui/input'
import { addToCart, fetchCartItems } from '@/store/user/cartSlice'
import { fetchProductDetails } from '@/store/user/productSlice'
import { getSearchResults, resetSearchResults } from '@/store/user/searchSlice'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const Search = () => {
   const [keyword, setKeyword] = useState('')
   const [searchParams, setSearchParams] = useSearchParams()
   const dispatch = useDispatch()
   const { user } = useSelector(state => state.auth)
   const { searchResults } = useSelector(state => state.userSearch)
   const { cartItems } = useSelector(state => state.userCart)
   const { productDetails } = useSelector(state => state.userProducts)
   const [openDetailsDialog, setOpenDetailsDialog]=useState(false)

   useEffect(() => {
      const timer = setTimeout(() => {
         if (keyword.trim() && keyword.trim().length > 2) {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(getSearchResults(keyword));
         }
         else {
            dispatch(resetSearchResults())
         }
      }, 1000);

      return () => clearTimeout(timer);
   }, [keyword, setSearchParams, dispatch]);

   function handleGetProductDetails(getCurrentProductId){
       dispatch(fetchProductDetails(getCurrentProductId))
       setOpenDetailsDialog(true)
     }

   function handleAddToCart(getCurrentProductId, getTotalStock) {
      let getCartItems = cartItems.items || [];
      if (getCartItems.length) {
         const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)
         if (indexOfCurrentItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentItem].quantity
            if (getQuantity + 1 > getTotalStock) {
               toast(`Only ${getQuantity} quantity can be added for this item`)
               return;
            }
         }
      }

      dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
         .then((data) => {
            if (data?.payload?.success) {
               dispatch(fetchCartItems(user?.id))
               toast.success('Product is added to cart successfully')
            }
         })
   }

   return (
      <div className='container mx-auto md:px-6 px-4 py-8 rounded-xl h-fit'>
         <div className='flex justify-center mb-8'>
            <div className='w-full flex items-center'>
               <Input
                  value={keyword}
                  name="keyword"
                  onChange={(e) => setKeyword(e.target.value)}
                  className="py-6 text-white rounded-xl"
                  placeholder="Search Products"
               />
            </div>
         </div>
         {
            !searchResults.length ?
               <h3 className='text-5xl text-white font-extrabold'>No Results found</h3> :
               null
         }
         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {
               searchResults.map((item, index) =>
                  <ProductTile
                  key={index}
                     handleAddToCart={handleAddToCart}
                     handleGetProductDetails={handleGetProductDetails}
                     product={item} />)
            }
         </div>
         <ProductDetails
         open={openDetailsDialog} 
         setOpen={setOpenDetailsDialog}
          productDetails={productDetails} />
      </div>
   )
}

export default Search