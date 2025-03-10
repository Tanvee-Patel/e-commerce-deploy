import React, { useEffect, useRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { FileImage, Upload, X } from 'lucide-react'
import { Button } from '../ui/button'
import axios from 'axios'
import { Skeleton } from '../ui/skeleton'

const ImageUpload = ({ imageFile, 
   setImageFile, 
   imageLoadingState, 
   uploadedImageUrl, 
   setUploadedImageUrl, 
   setImageLoadingState, 
   isEditMode, 
   isCustomStyling= false }) => {
   const inputRef = useRef(null)

   function handleImageFileChange(e) {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) setImageFile(selectedFile)
   }
   function handleDragOver(e) {
      e.preventDefault()
   }
   function handleDrop(e) {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) setImageFile(droppedFile)
   }
   function handleRemoveImage() {
      setImageFile(null)
      if (inputRef.current) {
         inputRef.current.value = ""
      }
   }

   async function uploadeImageToCloudinary() {
      setImageLoadingState(true)
      const data = new FormData();
      data.append('my_file', imageFile)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/products/upload-image`, data)
      if (response?.data?.success) {
         setUploadedImageUrl(response.data.result.url)
         setImageLoadingState(false)
      }
   }

   useEffect(() => {
      if (imageFile !== null) uploadeImageToCloudinary()
   }, [imageFile])

   return (
      <div className={`w-full mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
         {!isEditMode && (
            <div
               onDragOver={handleDragOver}
               onDrop={handleDrop}
               className={`${isEditMode ? "opacity-60" : ""} border-4 border-dashed rounded-xl p-4 bg-white`}
            >
               <Label className="text-lg font-semibold mb-2 block">
                  Upload Image
               </Label>
               <Input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleImageFileChange}
                  disabled={isEditMode}
               />
               {
                  !imageFile ? (
                     <Label
                        htmlFor="image-upload"
                        className={`${isEditMode ? 'cursor-not-allowed' : ''} flex flex-col items-center justify-center h-32 cursor-pointer`}
                     >
                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                        <span>Drag & Drop or click to upload image</span>
                     </Label>
                  ) : imageLoadingState ? (
                     <Skeleton className="h-10 bg-gray-100" />
                  ) : (
                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           <FileImage className="w-8 h-8 text-primary mr-2" />
                        </div>
                        <p className="text-sm font-medium">{imageFile.name}</p>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="text-muted-foreground hover:text-foreground"
                           onClick={handleRemoveImage}
                        >
                           <X className="w-4 h-4" />
                           <span className="sr-only">Remove Image</span>
                        </Button>
                     </div>
                  )
               }
            </div>
         )}
      </div>

   )
}

export default ImageUpload