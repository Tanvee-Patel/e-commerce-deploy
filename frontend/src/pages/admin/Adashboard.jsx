import ImageUpload from '@/components/admin/ImageUpload'
import { Button } from '@/components/ui/button'
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from '@/store/commonSlice'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Adashboard = () => {
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const dispatch = useDispatch()
  const { featureImageList } = useSelector(state => state.commonFeature)

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      alert('Please upload an image before submitting.')
      return;
    }

    dispatch(addFeatureImage(uploadedImageUrl))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          setImageFile(null)
          setUploadedImageUrl('')
        } else {
          console.error('Image upload failed:', data?.payload?.message);
        }
      })
      .catch((err) => console.error('Upload error:', err));
  }

  function handleDeleteFeatureImage(imageId){
    dispatch(deleteFeatureImage(imageId))
    .then(()=>{
      dispatch(getFeatureImages())
    })
    .catch((e) => console.error('Error',e))
  }
  useEffect(() => {
    dispatch(getFeatureImages())
  }, [dispatch])

  return (
    <div>
      <ImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
        isCustomStyling={true}
      />
      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full bg-blue-500 text-white hover:bg-blue-600 rounded-xl">
        Upload
      </Button>
      <div className='mt-5'>
        {
          featureImageList?.length > 0 ? (
            featureImageList.map((featureImageItem) => (
              <div className='relative group' key={featureImageItem?._id}>
                <img
                  src={featureImageItem?.image}
                  className='w-full h-[300px] object-cover rounded-xl'
                />
                <Button
                onClick={()=>handleDeleteFeatureImage(featureImageItem?._id)}
                className='absolute top-2 right-2 bg-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  <X className='text-red-500 w-6 h-6'/>
                </Button>
              </div>
            ))
          ) : (
            <p>No images found.</p>
          )}
      </div>
    </div>
  )
}

export default Adashboard 