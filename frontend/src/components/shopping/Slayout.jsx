import React from 'react'
import { Outlet } from 'react-router-dom'
import SHeader from './SHeader'
import SFooter from './SFooter'

const Slayout = () => {
  return (
    <div className='flex flex-col min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
      <SHeader />
      <main className='flex-grow w-full'>
        <Outlet />
      </main>
      <SFooter />
    </div>
  )
}

export default Slayout