import React from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useSelector } from 'react-redux'

const OrderDetails = ({ orderDetails }) => {

   const { user } = useSelector(state => state.auth)
   const getEstimatedDelivery = (orderDate) => {
      if (!orderDate) return 'N/A'
      const deliveryDate = new Date(orderDate)
      deliveryDate.setDate(deliveryDate.getDate() + 7)
      return deliveryDate.toDateString().split('T')[0]
   }

   return (
      <DialogContent className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center ring-4">
         <div className="w-full max-w-lg rounded-xl p-8 space-y-6 ">
            <div className="text-center">
               <DialogTitle className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Order Details
               </DialogTitle>
            </div>
            <div className='grid gap-6'>
               <div className='grid gap-2'>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Order Id</p>
                     <Label className="mr-5 text-base">{orderDetails?._id}</Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Order Date</p>
                     <Label className="mr-5 text-base">{orderDetails?.orderDate.split('T')[0]}</Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Estimated Delivery</p>
                     <Label className="mr-5 text-base">{getEstimatedDelivery(orderDetails?.orderDate)}</Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Order Status</p>
                     <Label className="mr-5"><Badge className='text-base py-1 px-2'>{orderDetails?.orderStatus}</Badge></Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Order Price</p>
                     <Label className="mr-5 text-base">${orderDetails?.totalAmount}</Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Payment Status</p>
                     <Label className="mr-5"><Badge className='py-1 px-2 text-base'>{orderDetails?.paymentStatus}</Badge></Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Payment Method</p>
                     <Label className="mr-5 text-base">{orderDetails?.paymentMethod.toUpperCase()}</Label>
                  </div>

               </div>
               <Separator />
               <div className='grid gap-4'>
                  <div className='grid gap-2'>
                     <div className='font-extrabold'>
                        Ordered Items
                     </div>
                     <ul className='grid gap-3'>
                        <li className='flex items-center justify-between font-semibold border-b pb-2'>
                           <span className='w-1/4'>Product Name</span>
                           <span className='w-1/4 text-center'>Quantity</span>
                           <span className='w-1/4 text-right'>Price</span>
                           <span className='w-1/4 text-right'>Sale Price</span>
                        </li>
                        {
                           orderDetails?.cartItems && orderDetails.cartItems.length > 0 ?
                              orderDetails?.cartItems.map(item =>
                                 <li className='flex items-center justify-between'>
                                    <span className='w-1/4'>{item.title}</span>
                                    <span className='w-1/4 text-center'>{item.quantity}</span>
                                    <span className='w-1/4 text-right'>  
                                    {item?.salePrice > 0 ? (
                                       <span className="line-through text-red-600">{item?.price}</span>
                                    ) : ( item?.price )}</span>
                                    <span className='w-1/4 text-right'>$ {item?.salePrice} </span>
                                 </li>) : null
                        }
                     </ul>
                  </div>
               </div>
               <Separator />
               <div className='grid gap-4'>
                  <div className='grid gap-2'>
                     <div className='font-medium'>
                        Shipping Info
                     </div>
                     <div className='grid gap-0.5 text-muted-foreground'>
                        <span>Username: {user.username}</span>
                        <span>Address: {orderDetails?.addressInfo?.address}
                           <span>, {orderDetails?.addressInfo?.city || 'N/A'}</span> </span>
                        <span>Pincode: {orderDetails?.addressInfo?.pincode || 'N/A'}</span>
                        <span>Phone: {orderDetails?.addressInfo?.phone || 'N/A'}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </DialogContent>
   )
}

export default OrderDetails