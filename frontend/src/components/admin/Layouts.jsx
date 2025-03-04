import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Layouts = () => {
  const [openSidebar, setOpenSidebar]=useState(false)
  return (
    <div className='flex min-h-screen w-full'>
      <Sidebar open={openSidebar} setOpen={setOpenSidebar}/>
      <div className='flex flex-1 flex-col'>
         <Header setOpen={setOpenSidebar}/>
         <main className='flex-1 flex-col flex bg-muted/40 p-4 md:p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50'>
            <Outlet/>
         </main>
         
      </div>
    </div>
  )
}

export default Layouts