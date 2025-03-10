import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const AddressCard = ({ addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedId, currentSelectedAddress }) => {
   const handleClick = () =>{
      console.log("Clicked Address", addressInfo);
      setCurrentSelectedAddress(addressInfo)
   } 
   return (
      <Card
         onClick={handleClick}
         className={`cursor-pointer border rounded-xl shadow-md bg-gradient-to-br from-gray-900 via-gray-800 to-black ${selectedId?._id === addressInfo?._id
               ? "border-red-900 border-[4px]"
               : ""
            }`}>
         <CardContent className="p-4 space-y-2 text-white">
            <div className="flex flex-col">
               <Label className="font-semibold">Address:</Label>
               <p className='text-white/85'>{addressInfo?.address}</p>
            </div>
            <div className="flex flex-col">
               <Label className="font-semibold">City:</Label>
               <p className='text-white/85'>{addressInfo?.city}</p>
            </div>
            <div className="flex flex-col">
               <Label className="font-semibold">Pincode:</Label>
               <p className='text-white/85'>{addressInfo?.pincode}</p>
            </div>
            <div className="flex flex-col">
               <Label className="text-white font-semibold">Phone:</Label>
               <p className="text-white/85">{addressInfo?.phone}</p>
            </div>
            <div className="flex flex-col">
               <Label className="text-white font-semibold">Notes:</Label>
               <p className="text-white/85">{addressInfo?.notes}</p>
            </div>
         </CardContent>
         <CardFooter className='flex justify-between'>
            <Button onClick={() => handleEditAddress(addressInfo)} className='bg-gray-400 rounded-xl text-white hover:bg-gray-500'>Edit</Button>
            <Button onClick={() => handleDeleteAddress(addressInfo)} className='bg-red-500 rounded-xl text-white hover:bg-red-600'>Delete</Button>
         </CardFooter>
      </Card>
   );
};

export default AddressCard;
