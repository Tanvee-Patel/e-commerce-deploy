import React from 'react'
import accountImage from '../../assets/e-comm.jpg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import Orders from '@/components/shopping/Orders'
import Address from '@/components/shopping/Address'

const Account = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full space-y-8 mb-7">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4 mt-4">
            Your Account
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
          <div className='relative h-[250px] max-w-full rounded-xl shadow-lg mb-6 p-4 bg-white'>
            <img
              src={accountImage}
              className='h-full w-full object-cover object-center transition-transform transform rounded-xl  '
              alt='Account'
            />
          </div>
          <Tabs defaultValue='orders'>
            <TabsList className="flex justify-center space-x-1 text-black">
              <TabsTrigger value="orders" className="px-6 py-2 text-lg font-semibold text-gray-300 rounded-xl hover:text-gray-700">Orders</TabsTrigger>
              <Separator className="h-6 w-10 sm:w-16 md:w-20 lg:w-24" />
              <TabsTrigger value="address" className="px-6 py-2 text-lg font-semibold text-gray-300 rounded-xl hover:text-gray-700">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <div className="text-gray-600 text-lg">
                <Orders/>
              </div>
            </TabsContent>
            <TabsContent value="address">
              <div className="text-gray-600 text-lg"><Address/></div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Account
