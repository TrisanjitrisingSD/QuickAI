// import React, { useState } from 'react'
// import { Outlet, useNavigate } from 'react-router-dom'
// import { assets } from '../assets/assets'
// import { Menu, X } from 'lucide-react';
// import { SignIn, useUser } from '@clerk/clerk-react';
// import Sidebar from '../components/Sidebar';

// const Layout = () => {

//   const navigate = useNavigate();
//   const [sidebar, setSidebar] = useState(false);
//   const { user } = useUser();


//   return user ? (
//     <div className='flex flex-col items-start justify-start h-screen'>
//       <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
//         <img className='cursor-pointer w-32 sm:w-44' src={assets.logo} alt="" onClick={() => navigate('/')} />
//         {
//           sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
//             :
//             <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
//         }
//       </nav>
//       <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
//         <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
//         <div className='flex-1 bg-[#F4F7FB]'>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className='flex items-center justify-center h-screen'>
//       <SignIn />
//     </div>
//   )
// }

// export default Layout

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
    <div className='h-screen w-screen overflow-hidden'>

      {/* Navbar Fixed */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-white px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        <img className='cursor-pointer w-32 sm:w-44' src={assets.logo} alt="" onClick={() => navigate('/')} />
        {
          sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
            :
            <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
        }
      </nav>

      {/* Body */}
      <div className='flex pt-16 h-[calc(100vh-64px)]'>

        {/* Sidebar Fixed */}
        <div className='hidden sm:flex flex-col fixed left-0 top-16 w-64 h-[calc(100vh-64px)] z-40 bg-white border-r border-gray-200'>
          <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        </div>


        {/* Main content scrollable */}
        <main className='flex-1 ml-0 sm:ml-64 overflow-y-auto bg-[#F4F7FB] p-4 h-[calc(100vh-64px)]'>
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout