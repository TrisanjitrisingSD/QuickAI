import React, { useState } from 'react'
import Markdown from 'react-markdown'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'



axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const CreationItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents expansion
          onDelete(); // Only call parent's delete
        }}
        className='self-end bg-orange-300 hover:bg-red-700 px-2 py-0.5 rounded text-xs font-semibold'
      >
        Delete
      </button>

      <div className='flex justify-between items-center gap-4'>
        <div>
          <h2>{item.prompt}</h2>
          <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>{item.type}</button>
      </div>

      {
        expanded && (
          <div>
            {item.type === 'image' ? (
              <img src={item.content} alt="image" className='mt-3 w-full max-w-md' />
            ) : (
              <div className='mt-3 text-sm text-slate-700'>
                <Markdown>{item.content}</Markdown>
              </div>
            )}
          </div>
        )
      }
    </div>
  );
};


export default CreationItem