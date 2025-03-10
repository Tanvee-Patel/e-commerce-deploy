import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import OrderDetail from './OrderDetail'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminOrderDetails, getAllOrderOfAllUsers, resetOrderDetails, updateOrderStatus } from '@/store/admin/orderSlice'
import { Badge } from '../ui/badge'

const AOrders = () => {
   const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
   const { orders: orderList = [], orderDetails } = useSelector(state => state.adminOrders)
   const dispatch = useDispatch()
   const statusColors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      processing: "bg-purple-100 text-purple-700",
      shipped: "bg-indigo-100 text-indigo-700",
      out_for_delivery: "bg-orange-100 text-orange-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      returned: "bg-gray-300 text-gray-800",
   };

   function handleFetchOrderDetails(getId) {
      dispatch(getAdminOrderDetails(getId))
   }

   useEffect(() => {
      dispatch(getAllOrderOfAllUsers())
   }, [dispatch])

   useEffect(() => {
      if (orderDetails !== null) {
         setOpenDetailsDialog(true)
      }
   }, [orderDetails])

   return (
      <div className="flex items-center justify-center px-4">
         <div className="w-full">
            <Card className="rounded-xl p-8">
               <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white tracking-tight mb-8 text-center">
                     All Orders
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <Table className="w-full border border-gray-200 bg-white items-center">
                     <TableHeader>
                        <TableRow className="bg-gray-100 border-b border-gray-400">
                           <TableHead className="w-1/5 text-center text-base font-medium text-gray-700">Order Id</TableHead>
                           <TableHead className="w-1/5 text-center text-base font-medium text-gray-700">Order Date</TableHead>
                           <TableHead className="w-1/5 text-center text-base font-medium text-gray-700">Order Status</TableHead>
                           <TableHead className="w-1/5 text-center text-base font-medium text-gray-700">Order Price</TableHead>
                           <TableHead className="w-1/5 text-center text-base font-medium text-gray-700"> Details
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {
                           orderList && orderList.length > 0 ? (
                              orderList.map((orderItem) => (
                                 <TableRow key={orderItem?._id}>
                                    <TableCell className='w-1/5 text-center'>{orderItem?._id}</TableCell>
                                    <TableCell className='w-1/5 text-center'>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                    <TableCell className="py-3 px-4 text-center">
                                       <Badge className={`py-3 px-4 rounded-full text-center font-medium ${statusColors[orderItem?.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                                          {orderItem?.orderStatus.replace(/_/g, " ")}
                                       </Badge>
                                    </TableCell>
                                    <TableCell className="w-1/5 text-center">${orderItem?.totalAmount?.toFixed(2)}</TableCell>
                                    <TableCell className="w-1/5 text-center">
                                       <Button
                                          className='border border-sky-600 rounded-xl'
                                          onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                                          View Details
                                       </Button>
                                    </TableCell>
                                 </TableRow>))
                           ) : null
                        }
                     </TableBody>
                  </Table>
               </CardContent>
               <Dialog
                  open={openDetailsDialog}
                  onOpenChange={() => {
                     setOpenDetailsDialog(false)
                     dispatch(resetOrderDetails())
                  }}>
                  <DialogContent aria-describedby="order-description">
                     <DialogTitle>Order Details</DialogTitle>
                     <p id="order-description">Order details and relevant information.</p>
                     <OrderDetail orderDetail={orderDetails} />
                  </DialogContent>
               </Dialog>
            </Card>
         </div>
      </div>
   );
};

export default AOrders;
