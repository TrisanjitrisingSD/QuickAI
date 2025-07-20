import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BlogTitles from './pages/BlogTitles'
import Layout from './pages/Layout'
import WriteArticle from './pages/WriteArticle'
import Dashboard from './pages/Dashboard'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import {DailyNewsPage} from './pages/DailyNewsPage'
import ChatBot from './pages/ChatBot'



const App = () => {



  return (

    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />} >
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GenerateImages />} />
          <Route path='remove-background' element={<RemoveBackground />} />
          <Route path='remove-object' element={<RemoveObject />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='community' element={<Community />} />
          <Route path='news' element={<DailyNewsPage />} />
          <Route path='chatt' element={<ChatBot />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App