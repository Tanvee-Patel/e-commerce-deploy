import React, { useEffect, useState } from 'react'
import image from '../../assets/e-comm.jpg'
import Address from '@/components/shopping/Address'
import { useDispatch, useSelector } from 'react-redux'
import CartItemsContent from '@/components/shopping/CartItemsContent'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { createOrder } from '@/store/user/orderSlice'
import { fetchAllAddress, setSelectedAddress } from '@/store/user/addressSlice'
import { deleteCartItem } from '@/store/user/cartSlice'

const Checkout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth)
  const orderStatus = useSelector((state) => state.orders.orderStatus) || 'Pending';
  const { addressList, selectedAddress } = useSelector(state => state.userAddress)
  const { cartItems } = useSelector(state => state.userCart)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false)
  const { approvalURL } = useSelector((state) => state.orders)
  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddress(user?.id))
    }
  }, [dispatch, user])

  const handleAddressSelect = (addressId) => {
    const address = addressList.find(addr => addr._id === addressId)
    setCurrentSelectedAddress(address);
    const action = setSelectedAddress(address);
    dispatch(action);
  }

  const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0 ?
    cartItems.items.reduce((sum, currentItem) => sum + (
      currentItem?.salePrice > 0 ?
        currentItem?.salePrice : currentItem?.price
    ) * currentItem?.quantity, 0) : 0

  async function handleCheckout() {
    if (!cartItems || !cartItems.items.length) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!currentSelectedAddress) {
      toast.error('Please select a delivery address!');
      return;
    }

    const orderData = {
      userId: user?.id || '',
      cartId: cartItems?._id,
      cartItems: cartItems.items.map(singleCartItem => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: singleCartItem?.price,
        salePrice: singleCartItem?.salePrice,
        quantity: singleCartItem?.quantity
      })),
      addressInfo: currentSelectedAddress || {},
      totalAmount: totalCartAmount,
      orderStatus: orderStatus,
      paymentId: '',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      payerId: '',
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      approvalURL: approvalURL
    };

    try {
      const response = await dispatch(createOrder(orderData)).unwrap();

      if (paymentMethod === 'paypal' && response?.approvalURL) {
        sessionStorage.setItem("currentOrderId", JSON.stringify(response.orderId));
        window.location.href = response.approvalURL;
      } else if (paymentMethod === 'cod' && response?.success) {
        toast.success('Order placed successfully with Cash on Delivery! 🎉', {
          duration: 5000,
        });
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    }
  }

  useEffect(() => {
    if (isPaymentStart && paymentMethod === 'paypal' && approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL, paymentMethod, isPaymentStart]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-6">
      <div className="w-full space-y-8 mb-7">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mt-4 mb-4">
            Checkout
          </h1>
        </div>

        {/* Image */}
        <div className="relative h-[250px] w-full overflow-hidden rounded-xl shadow-md p-4 bg-white">
          <img src={image} className="h-full w-full object-cover rounded-xl object-center" alt="Checkout Banner" />
        </div>

        {/* Checkout Card */}
        <Card className="bg-white rounded-xl shadow-2xl p-7 space-y-6 ">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Address Section */}
              <div className="bg-white p-6 rounded-xl">
                <Address
                  selectedId={selectedAddress?._id}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                  onAddressSelect={handleAddressSelect}
                />
              </div>

              {/* Cart Items Section */}
              <div className="bg-white p-5 rounded-xl">
                <div className="flex flex-col gap-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl mt-10">
                  {/* Title */}
                  <CardTitle className="text-2xl font-semibold text-gray-900 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Cart Items</h1>
                  </CardTitle>

                  {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                    cartItems.items.map((cartItem, index) => (
                      <CartItemsContent key={cartItem._id || index} cartItem={cartItem} />
                    ))
                  ) : (
                    <p className="text-gray-600 text-center">Your cart is empty.</p>
                  )}

                  {/* Total Amount */}
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-gray-800">${totalCartAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">Select Payment Method</h2>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Cash on Delivery
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        PayPal
                      </label>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <div className="mt-4 w-[30%] bg-gray-500 text-white rounded-xl text-center hover:bg-gray-600">
                    <Button
                      onClick={handleCheckout}>
                      Place Order
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;