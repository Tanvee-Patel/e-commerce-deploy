import ImageUpload from '@/components/admin/ImageUpload'
import Form from '@/components/common/Form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { addProductFormElements } from '@/config'
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/admin/productSlice'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import AProductTile from '@/components/admin/AProductTile'

const Aproducts = () => {
  const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: '',
    brand: '',
    price: "",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
  }
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const dispatch = useDispatch()
  const { productList = [] } = useSelector((state) => state.adminProducts)
  const [currentEditedId, setCurrentEditedId] = useState(null)

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast.success("Product add successfully")
          }
        });
  }
  
  function isFormValid() {
    if (currentEditedId !== null) {
      return Object.keys(formData)
        .map((key) => formData[key] !== initialFormData[key] && formData[key] !== "")
        .every((item) => item);
    }
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }
  
  function handleDelete(getCurrentProductId){
    dispatch(deleteProduct(getCurrentProductId))
    .then(data=>{
      if(data?.payload?.success){
        dispatch(fetchAllProducts())
      }
    })
    
  }

  useEffect(() => { 
    dispatch(fetchAllProducts());
  }, [dispatch]);  

  return (
    <Fragment>
      <div className='mb-5 w-full flex justify-end'>
        <Button 
        className='bg-gray-500 text-white hover:bg-black'
        onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
      </div>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0 ? (
          productList.map((productItem, index) => (
            <AProductTile 
            setOpenCreateProductsDialog={setOpenCreateProductsDialog} 
            setFormData={setFormData} 
            setCurrentEditedId={setCurrentEditedId} 
            product={productItem} 
            key={productItem.id || index}
            handleDelete={handleDelete} />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false)
          setCurrentEditedId(null)
          setFormData(initialFormData)
        }}>
        <SheetContent
          side="right"
          className="overflow-auto bg-white"
          aria-describedby="add-product-description">
          <SheetHeader>
            <SheetTitle>
              {
                currentEditedId !== null ?
                  'Edit Product' : 'Add new Product'

              }
            </SheetTitle>
            <div id="add-product-description" >
              {currentEditedId !== null ? "Fill out the form below to Edit product." : "Fill out the form below to add a new product."}

            </div>
          </SheetHeader>
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className='py-6'>
            <Form
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControlls={addProductFormElements}
              isBtnDisabled = {!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default Aproducts