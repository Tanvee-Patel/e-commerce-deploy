import { BellRing, LayoutDashboard, MessageSquareText, Package, ShoppingCart } from "lucide-react";

import { SquareUserRound } from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate()
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 bg-white"
          aria-describedby="sidebar-description"
          aria-label="Admin Panel Sidebar"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mb-3">
                <SquareUserRound size={30} />
                <span className="font-extrabold">Admin Panel</span>
              </SheetTitle>
              <SheetDescription id="sidebar-description">
                Navigate through admin tools and settings.
              </SheetDescription>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
        <div
          onClick={() => navigate("/admin/dashboard")}
          className='flex cursor-pointer items-center gap-2'>
          <SquareUserRound size={30} />
          <h1 className='text-lg font-extrabold'>Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  )
}

export const adminSidebarMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <LayoutDashboard />
  },
  {
    id: 'products',
    label: 'Products',
    path: '/admin/products',
    icon: <Package />
  }, {
    id: 'orders',
    label: 'Orders',
    path: '/admin/orders',
    icon: <ShoppingCart />
  },
  {
    id: 'messages',
    label: 'Messages',
    path: '/admin/messages',
    icon: <MessageSquareText />
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/admin/notifications',
    icon: <BellRing />
  }
]

const MenuItems = ({ setOpen }) => {
  const navigate = useNavigate();
  return (
    <nav className='mt-8 flex-col flex gap-2'>
      {adminSidebarMenuItems.map((MenuItem) => (
        <div
          className='flex text-xl items-center gap-2 rounded-xl px-3 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground '
          key={MenuItem.id}
          onClick={() => {
            navigate(MenuItem.path);
            setOpen ? setOpen(false) : null;
          }}
        >
          {MenuItem.icon}
          <span>{MenuItem.label}</span>
        </div>
      ))}
    </nav>
  );
};


export default Sidebar