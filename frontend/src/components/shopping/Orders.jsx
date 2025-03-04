import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import OrderDetails from './OrderDetails'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrderByUser, getOrderDetails, resetOrderDetails } from '@/store/user/orderSlice'
import { Badge } from '../ui/badge'

const Orders = () => {

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { orders: orderList = [], orderDetails } = useSelector(state => state.orders)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

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

  useEffect(() => {
    dispatch(getAllOrderByUser(user?.id))
  }, [dispatch, user])

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(true)
    }
  }, [orderDetails])

  function handleFetchOrderDetails(getId) {
    setSelectedOrderId(getId)
    dispatch(getOrderDetails(getId))
  }

  return (
    <Card className="shadow-lg bg-white rounded-xl border border-gray-200 p-6">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-800">Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-gray-700 border border-gray-200 rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-100 text-gray-900">
              <TableHead className="py-3 w-auto text-center">Order Id</TableHead>
              <TableHead className="py-3 w-auto text-center">Order Date</TableHead>
              <TableHead className="py-3 w-auto text-center">Order Status</TableHead>
              <TableHead className="py-3 w-auto text-center">Order Price</TableHead>
              <TableHead className="py-3 w-auto text-center">
                <span className='sr-only'>Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                    <TableCell className="py-3 px-4 text-center font-mono text-gray-700">{orderItem?._id}</TableCell>
                    <TableCell className="py-3 px-4 text-center">{orderItem?.orderDate.split('T')[0]}</TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <Badge className={`py-3 px-4 rounded-full text-center font-medium ${statusColors[orderItem?.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                        {orderItem?.orderStatus.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center font-semibold">${orderItem?.totalAmount}</TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl transition">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>))
              ) :(
                <TableRow>
                  <TableCell colSpan="5" className="py-6 text-center text-gray-500">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog
      className="ring-2 ring-gray-300 bg-white rounded-lg shadow-xl"
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false)
          dispatch(resetOrderDetails())
        }}>
        <OrderDetails orderDetails={orderDetails} />
      </Dialog>
    </Card>
  )
}

export default Orders