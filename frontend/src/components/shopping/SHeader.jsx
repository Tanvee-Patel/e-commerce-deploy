import { Bell, CircleUserRound, House, InboxIcon, LogOut, ShoppingCart, SquareMenu } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewHeaderMenuItems } from '@/config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { logoutUser } from '@/store/authSlice'
import CartWrapper from './CartWrapper'
import { fetchCartItems } from '@/store/user/cartSlice'
import { Label } from '../ui/label'
import { DialogTitle } from '../ui/dialog'

function MenuItems() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  function handleNavigate(getCurrentMenuItems) {
    sessionStorage.removeItem('filters')
    const currentFilter = getCurrentMenuItems.id !== 'home' && getCurrentMenuItems.id !== 'products' && getCurrentMenuItems.id !== 'search' ?
      {
        category: [getCurrentMenuItems.id]
      } : null
    if (currentFilter) {
      sessionStorage.setItem('filters', JSON.stringify(currentFilter));
      setSearchParams(new URLSearchParams({ category: getCurrentMenuItems.id }));
    }
    navigate(getCurrentMenuItems.path);
  }

  return (
    <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row mt-3'>
      {
        shoppingViewHeaderMenuItems.map(menuItem =>
          <Label
            onClick={() => handleNavigate(menuItem)}
            key={menuItem.id}
            className='text-sm font-medium cursor-pointer'
          >
            {menuItem.label}
          </Label>
        )
      }
    </nav>
  );
}

function HeaderRightContent({ closeMenu }) {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.userCart)

  const unreadNotifications = 0;

  function handleLogout() {
    dispatch(logoutUser());
    closeMenu();
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id))
  }, [dispatch])

  return (
    <div className='flex lg:flex-row flex-col gap-4 w-full sm:text-left text-center'>
      <Button
      onClick={ () => navigate('/user/notifications')}
      size="icon"
      className="relative"
      >
        <Bell className='h-6 w-6'/>
        {unreadNotifications > 0 && (
          <span className='absolute -top-1.5 -right-1.5 backdrop-b text-gray-600 bg-white/40 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border bg-sky-400 border-sky-700 shadow-lg transition-all duration-300 hover:scale-110'>
            {unreadNotifications}
          </span>
        )}
        <span className='sr-only'>Notifications</span>
      </Button>
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          size="icon"
          className="relative">
          <ShoppingCart className='h-6 w-6' />
          <span className='absolute -top-1.5 -right-1.5 backdrop-b bg-white/40 text-gray-600 font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full border bg-sky-400 border-sky-700 shadow-lg transition-all duration-300 hover:scale-110'>
            {cartItems?.items?.length}
          </span>
          <span className='sr-only'>User shopping cart</span>
        </Button>
        <CartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ?
            cartItems.items : []} />
      </Sheet>
      <DropdownMenu>
        <div className='relative'>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent side="right" className="w-56 mt-2 bg-white">
          <DropdownMenuLabel >
            Logged in as {user?.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-black" />
          <DropdownMenuItem onClick={() => navigate('/user/account')}>
            <CircleUserRound className='mr-2 h-4 w-4' />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className='mr-2 h-4 w-4' /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}

const SHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-white shadow-md'>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>
        <Link to="/user/home" className='flex items-center gap-2 text-gray-900'>
          <House className='h-6 w-6 text-primary-600' />
          <span className='font-bold text-primary-600'>
          GlamLit
          </span>
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden text-gray-900 border-gray-300 hover:border-primary-600" onClick={handleOpen}>
              <SquareMenu className='h-6 w-6 text-primary-600' />
              <span className='sr-only'>Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white p-4" aria-describedby={undefined}>
            <DialogTitle className="sr-only">Header Menu</DialogTitle>
            <HeaderRightContent closeMenu={handleClose} />
            <MenuItems closeMenu={handleClose} />
          </SheetContent>
        </Sheet>
        <div className='hidden lg:block'>
          <MenuItems closeMenu={handleClose} />
        </div>
        {
          isAuthenticated ? (
            <div className='hidden lg:block'>
              <HeaderRightContent closeMenu={handleClose} />
            </div>
          ) : null
        }
      </div>
    </header>
  );
};

export default SHeader;
