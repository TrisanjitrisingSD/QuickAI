import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react';
import { SignIn, useUser } from '@clerk/clerk-react';
import Sidebar from '../components/Sidebar';

const Layout = () => {

  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();


  return user ? (
    <div className='flex flex-col items-start justify-start h-screen'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        <div className='flex items-center gap-0'>
                        <img src={assets.favicon} alt="favicon" className="w-10 h-10 cursor-pointer sm:w-44" onClick={() => navigate('/')} />
                        {/* <img className='cursor-pointer w-32 sm:w-44' src={assets.logo} alt="" />  */}
                    </div>
        {
          sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
            :
            <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
        }
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#F4F7FB]'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout