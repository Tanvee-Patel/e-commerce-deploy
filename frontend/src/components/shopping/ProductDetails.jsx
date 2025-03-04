import { Star } from 'lucide-react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, fetchCartItems } from '@/store/user/cartSlice'
import toast from 'react-hot-toast'
import { setProductDetails } from '@/store/user/productSlice'
import { Label } from '../ui/label'
import StarRating from '../common/StarRating'
import { useEffect, useState } from 'react'
import { addProductReview, getProductReviews } from '@/store/user/reviewSlice'

const ProductDetails = ({ open, setOpen, productDetails }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth)
  const { cartItems } = useSelector((state) => state.userCart)
  const [reviewMsg, setReviewMsg] = useState("")
  const [rating, setRating] = useState(0)
  const { reviews } = useSelector((state) => state.userReview)
  const avgReview = reviews && reviews.length > 0 ?
    reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
    : 0

  function handleRatingChange(getRating) {
    setRating(getRating)
  }

  function handleAddReview() {
    if (!rating || !reviewMsg.trim()) {
      return toast.error("Please provide a rating and a review message.");
    }

    dispatch(addProductReview({
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      ReviewMessage: reviewMsg,
      reviewValue: rating
    }))
      .unwrap()
      .then((data) => {
        if (data.payload.success) {
          setRating(0)
          setReviewMsg("")
          dispatch(getProductReviews(productDetails?._id))
          toast.success("Review Added successfully")
        }
      })
      .catch((error) => {
        // toast.error("Error submitting review",error)
        toast.error(error);
      });

  }

  function handleAddToCart(productId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === productId)
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`)
          return;
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id))
          toast.success('Product is added to cart successfully')
        }
      })
  }

  function handleCloseDialog() {
    setOpen(false)
    dispatch(setProductDetails())
    setRating(0)
    setReviewMsg("")
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getProductReviews(productDetails?._id))
    }
  }, [productDetails])

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:p-8 p-6 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] rounded-xl shadow-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 overflow-y-auto max-h-[80vh]">
        <DialogTitle className="text-3xl font-extrabold text-gray-900 mb-6 text-center">{productDetails?.title || "Loading..."}</DialogTitle>
        {productDetails ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <img
              src={productDetails.image}
              alt={productDetails.title}
              width={600}
              height={600}
              className="aspect-square w-full object-cover rounded-xl"
            />
            <div className="space-y-6">
              {/* <h1 className="text-3xl font-bold text-gray-900">{productDetails.title}</h1> */}
              <p className="text-lg text-gray-600 leading-relaxed">{productDetails.description}</p>

              <div className="flex items-center justify-between">
                <p 
                className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? 
                  "line-through" : "" }`} >
                  ${productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 ? (
                  <p className="text-2xl font-bold text-muted-foreground">
                    ${productDetails?.salePrice}
                  </p>
                ) : null}
              </div>

              <div className='flex items-center gap-2 mt-2'>
                <div className='flex items-center gap-0.5'>
                  <StarRating
                    rating={avgReview}
                  />
                </div>
                <span className='text-muted-foreground font-medium'>({avgReview.toFixed(1)})</span>
              </div>

              {
                productDetails?.totalStock === 0 ?
                  <Button className="w-full opacity-60 cursor-not-allowed">
                    Out of stock
                  </Button>
                  : <Button
                    onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                    className="w-full bg-primary-500 text-cyan-700 hover:bg-primary-600 hover:bg-slate-200 transition-all mt-4">
                    Add to Cart
                  </Button>
              }

              <Separator />

              <div className='max-h-[300px] overflow-auto'>
                <h2 className='text-xl font-bold mb-4'>Reviews</h2>
                <div className='grid gap-6'>
                  {
                    reviews && reviews.length > 0 ? (
                      reviews.map(reviewItem => (
                        <div className="flex gap-4" key={reviewItem?._id}>
                          <Avatar className="w-10 h-10 border">
                            <AvatarFallback>
                              {reviewItem?.userId?.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">{reviewItem?.userId?.username || "Anonymous"}</h3>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <StarRating rating={reviewItem?.reviewValue} />
                            </div>
                            <p className="text-muted-foreground">
                              {reviewItem?.ReviewMessage || "No comment provided"}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <h1>No Reviews</h1>
                    )
                  }
                </div>

                <div className='mt-10 flex-col flex gap-2'>
                  <Label>Write a review</Label>
                  <div className='flex gap-1'>
                    <StarRating
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    placeholder="Write a Review"
                    className="w-full p-4 border rounded-xl  " />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                    className="p-4 hover:bg-slate-200">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading product details...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetails
