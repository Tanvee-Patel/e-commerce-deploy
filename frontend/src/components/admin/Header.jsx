import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, BellRing, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser, resetTokenAndCredentials } from '@/store/authSlice'
import { Link, useNavigate } from 'react-router-dom'

const Header = ({ setOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    // dispatch(logoutUser())
    dispatch(resetTokenAndCredentials())
    sessionStorage.clear()
    navigate('/auth/login')
  }

  return (
    <header className='flex items-center justify-between px-4 py-3 bg-background border-b'>
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block flex items-center space-x-2 px-4 py-2  text-white bg-blue-500 rounded hover:bg-blue-800 transition duration-300">
        <AlignJustify className="w-5 h-5" />
        <span className="sr-only">
          Toggle Menu
        </span>
      </Button>
      <div className='flex flex-1 justify-end'>
      <Link
        to='/admin/notifications'
        className='relative flex items-center justify-center p-2 text-gray-500 hover:bg-gray-700 hover:text-white text-primary transition duration-300 bg-gray-300 rounded-xl mr-4'
      >
        <BellRing className='w-5 h-5'/>
        <p className='pl-1'>Notifications</p>
      </Link>
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 shadow-md items-center rounden-md px-4 py-2 text-sm font-medium hover:bg-red-700 rounded-xl bg-red-500 text-white transition duration-300">
          <LogOut /> Logout
        </Button>
      </div>
    </header>
  )
}

export default Header 