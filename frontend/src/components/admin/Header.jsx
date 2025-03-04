import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/authSlice'

const Header = ({setOpen}) => {
  const dispatch = useDispatch()
  
  function handleLogout(){
    dispatch(logoutUser())
  }

  return (
    <header className='flex items-center justify-between px-4 py-3 bg-background border-b'>
      <Button
      onClick={()=>setOpen(true)} 
      className="lg:hidden sm:block flex items-center space-x-2 px-4 py-2  text-white bg-blue-500 rounded hover:bg-blue-800 transition duration-300">
        <AlignJustify className="w-5 h-5" />
        <span className="sr-only">
          Toggle Menu
        </span>
      </Button>
      <div className='flex flex-1 justify-end'>
        <Button
        onClick = {handleLogout}
        className="inline-flex gap-2 shadow-md items-center rounden-md px-4 py-2 text-sm font-medium hover:bg-red-700 rounded-xl bg-red-500 text-white transition duration-300">
          <LogOut /> Logout
        </Button>
      </div>
    </header>
  )
}

export default Header 