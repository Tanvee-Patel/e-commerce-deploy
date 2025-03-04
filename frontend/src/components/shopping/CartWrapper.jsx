import React from 'react'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import CartItemsContent from './CartItemsContent'
import { useNavigate } from 'react-router-dom'

const CartWrapper = ({ cartItems, setOpenCartSheet }) => {

   const navigate = useNavigate()
   const totalCartAmount = cartItems && cartItems.length > 0 ?
      cartItems.reduce((sum, currentItem) => sum + (
         currentItem?.salePrice > 0 ?
            currentItem?.salePrice : currentItem?.price
      ) * currentItem?.quantity, 0) : 0

   return (
      <SheetContent className="sm:max-w-md bg-white">
         <SheetHeader>
            <SheetTitle>
               Your Cart
            </SheetTitle>
            <SheetDescription>
               Review your cart items before proceeding to checkout.
            </SheetDescription>
         </SheetHeader>
         <div className='mt-8 space-y-4' key={cartItems}>
            {
               cartItems && cartItems.length > 0 ?
                  cartItems.map(item => <CartItemsContent key={item.productId} cartItem={item} />) : null
            }
         </div>
         <div className='mt-8 space-y-4'>
            <div className='flex justify-between'>
               <span className='font-bold'>Total</span>
               <span className='font-bold'>${totalCartAmount}</span>
            </div>
         </div>
         <Button
            onClick={() => {
               navigate('/user/checkout')
               setOpenCartSheet(false)
            }}
            className="w-full justify-center py-3 mt-6 bg-blue-400 hover:bg-blue-500 font-semibold rounded-xl">
            Checkout
         </Button>
      </SheetContent>
   )
}

export default CartWrapper