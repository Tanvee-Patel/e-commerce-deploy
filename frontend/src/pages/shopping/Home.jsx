import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Book, BookOpen, Brush, ChevronLeft, ChevronRight, Droplet, LibraryBig, Palette,  WandSparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/user/productSlice'
import ProductTile from '@/components/shopping/ProductTile'
import { Link, useNavigate } from 'react-router-dom'
import { addToCart, fetchCartItems } from '@/store/user/cartSlice'
import toast from 'react-hot-toast'
import ProductDetails from '@/components/shopping/ProductDetails'
import { getFeatureImages } from '@/store/commonSlice'
import { FaPlus } from 'react-icons/fa'

const categories = [
  { id: "books", label: "Books", icon: LibraryBig },
  { id: "beauty", label: "Beauty & Skin Care", icon: WandSparkles }
]

const brand = [
  // Books brands
  { id: "penguin", label: "Penguin", icon: BookOpen },
  { id: "harpercollins", label: "HarperCollins", icon: Book },
  // Beauty brands
  { id: "thedermaco", label: "The Derma Co", icon: FaPlus },
  { id: "dotnkey", label: "Dot & Key", icon: Droplet},
  { id: "maybelline", label: "Maybelline", icon: Brush },
  { id: "mac", label: "MAC", icon: Palette },
]

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { productList, productDetails } = useSelector(state => state.userProducts)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const { featureImageList } = useSelector(state => state.commonFeature)
  function handleAddToCart(getCurrentProductId) {
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id))
          toast.success('Product is added to cart successfully')
        }
      })
  }
  
  useEffect(() => {
    if (!featureImageList || featureImageList.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % featureImageList.length)
    }, 7000)
  
    return () => clearInterval(timer);
  }, [featureImageList])
  
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({
      filterParams: {},
      sortParams: 'price-lowtohigh'
    }))
  }, [dispatch])

  function handlePrevSlide() {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)
  }

  function handleNextSlide() {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
  }

  useEffect(() => {
    dispatch(getFeatureImages())
  }, [dispatch])

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true)
  }, [productDetails])

  function handleNavigateToListingPage(section, getCurrentItem) {
    const validSections = ['category', 'brand'];
    if (!validSections.includes(section)) {
      console.error("Invalid section");
      return;
    }
    if (!getCurrentItem || !getCurrentItem.id) {
      console.error("Invalid item or item ID");
      return;
    }
    if (typeof section !== "string" || !section.trim()) {
      console.error("Invalid section");
      return;
    }
    if (!getCurrentItem || !getCurrentItem.id) {
      console.error("Invalid item or item ID");
      return;
    }
    sessionStorage.removeItem('filters');
    const currentFilter = JSON.parse(sessionStorage.getItem('filters')) || {}
    currentFilter[section] = [getCurrentItem.id]
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate('/user/listing')
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

return (
  <div className="min-h-screen flex flex-col">
    <div className="relative w-full h-[600px]">
      {
        featureImageList && featureImageList.length > 0 
          ? featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover py-7 transition-opacity duration-1000`}
            />
          ))
          : null
      }
      <Button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 shadow-lg hover:bg-white"
        variant="outline"
        size="icon"
        onClick={handlePrevSlide}>
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </Button>
      <Button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 shadow-lg hover:bg-white"
        variant="outline"
        size="icon"
        onClick={handleNextSlide}
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </Button>
    </div>

    <section className="py-10 bg-white rounded-xl mx-4 my-8 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {categories.map((categoryItem, index) => (
            <Card
              key={index}
              onClick={() => {
                handleNavigateToListingPage('category', categoryItem,);
              }}
              className="cursor-pointer hover:shadow-2xl transition-all bg-gray-100 text-blue-950 rounded-xl">
              <CardContent className="flex flex-col items-center justify-center p-8">
                {React.createElement(categoryItem.icon, { className: "w-14 h-14 mb-4 text-primary" })}
                <span className="text-lg font-semibold text-gray-900">{categoryItem.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-10 mx-4 my-8 bg-white rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Shop by Brand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brand.map((brandItem, index) => (
            <Card
              key={index}
              onClick={() => {
                handleNavigateToListingPage('brand', brandItem,);
              }}
              className="cursor-pointer hover:shadow-2xl transition-all bg-gray-100 text-blue-950 rounded-xl">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <brandItem.icon className="w-14 h-14 mb-4 text-primary" />
                <span className="text-lg font-semibold text-gray-900">{brandItem.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 mx-4 my-8 bg-white rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList && productList.length > 0 ? productList.map((productItem, index) => (
            <ProductTile
              key={index}
              handleGetProductDetails={handleGetProductDetails}
              product={productItem}
              handleAddToCart={handleAddToCart} />
          )) : null}
        </div>
      </div>
    </section>

    <ProductDetails
      open={openDetailsDialog}
      setOpen={setOpenDetailsDialog}
      productDetails={productDetails}
    />

  </div>
);
};

export default Home;