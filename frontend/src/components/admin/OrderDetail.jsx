
import React, { useEffect, useState } from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import Form from '../common/Form'
import { Badge } from '../ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminOrderDetails, getAllOrderOfAllUsers, sendOrderEmail, updateOrderStatus } from '@/store/admin/orderSlice'
import toast from 'react-hot-toast'

const initialFormData = {
   status: ''
}

const OrderDetail = ({ orderDetail }) => {
   const { user } = useSelector(state => state.auth)
   const [formData, setFormData] = useState(initialFormData)
   const [updating, setUpdating] = useState(false);
   const dispatch = useDispatch()

   function handleUpdateStatus(e) {
      e.preventDefault()
      setUpdating(true)
      const { status } = formData;
      const email = orderDetail?.userId?.email;

      dispatch(updateOrderStatus({
         id: orderDetail?._id,
         orderStatus: status
      }))
         .then(data => {            
            if (data?.payload?.success) {
               dispatch(getAdminOrderDetails(orderDetail?._id))
               dispatch(getAllOrderOfAllUsers())
               setFormData(initialFormData)
               toast.success('Order status updates successfully!')

               if (status.toLowerCase() === "confirmed") {
                  dispatch(sendOrderEmail({
                     email,
                     orderId: orderDetail?._id,
                     status
                  }))
                  toast.success("Confirmation email sent to customer!");
               }
            }
            else {
               toast.error('Failed to update order status');
            }
         })
         .finally(() => setUpdating(false))
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
                     <Label className="mr-5">{orderDetail?._id}</Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Order Date</p>
                     <Label className="mr-5">{orderDetail?.orderDate.split('T')[0]}</Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Order Status</p>
                     <Label className="mr-5"><Badge className='py-1 px-2'>{orderDetail?.orderStatus}</Badge></Label>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='font-medium'>Order Price</p>
                     <Label className="mr-5">${orderDetail?.totalAmount?.toFixed(2)}</Label>
                  </div>
               </div>
               <Separator />
               <div className='grid gap-4'>
                  <div className='grid gap-2'>
                     <div className='font-extrabold'>
                        Order Details
                     </div>
                     <ul className='grid gap-3'>
                        <li className='flex items-center justify-between font-semibold border-b pb-2'>
                           <span className='w-1/2'>Product Name</span>
                           <span className='w-1/4 text-center'>Quantity</span>
                           <span className='w-1/4 text-right'>Price</span>
                        </li>
                        {
                           orderDetail?.cartItems && orderDetail.cartItems.length > 0 ?
                              orderDetail?.cartItems.map(item =>
                                 <li key={item?._id} className='flex items-center justify-between'>
                                    <span className='w-1/2'>{item.title}</span>
                                    <span className='w-1/4 text-center'>{item.quantity}</span>
                                    <span className='w-1/4 text-right'>${item.price}</span>
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
                        <span>Address: {orderDetail?.addressInfo?.address}
                           <span>, {orderDetail?.addressInfo?.city || 'N/A'}</span> </span>
                        <span>Pincode: {orderDetail?.addressInfo?.pincode || 'N/A'}</span>
                        <span>Phone: {orderDetail?.addressInfo?.phone || 'N/A'}</span>
                     </div>
                  </div>
               </div>
               <div>
                  <Form
                     formControlls={[
                        {
                           label: "Order Status",
                           name: "status",
                           componentType: "select",
                           options: [
                              { id: "pending", label: "Pending" },
                              { id: "confirmed", label: "Confirmed" },
                              { id: "processing", label: "Processing" },
                              { id: "shipped", label: "Shipped" },
                              { id: "out_for_delivery", label: "Out for Delivery" },
                              { id: "delivered", label: "Delivered" },
                              { id: "cancelled", label: "Cancelled" },
                              { id: "returned", label: "Returned" }
                           ]
                        }
                     ]}
                     formData={formData}
                     setFormData={setFormData}
                     buttonText={'Update Order Status'}
                     onSubmit={handleUpdateStatus}
                  />
               </div>
            </div>
         </div>
      </DialogContent>
   )
}

export default OrderDetail