// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useAuth } from '@clerk/clerk-react'
// import toast from 'react-hot-toast'
// import Markdown from 'react-markdown'
// import { ExternalLink } from 'lucide-react';



// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


// export const DailyNewsPage = () => {


//     const [creations, setCreations] = useState([]);
//     const [loading, setLoading] = useState(true)
//     const { getToken } = useAuth();
//     const [topic, setTopic] = useState('');

//     const fetchNews = async (topic) => {
//         topic.preventDetails();
//         setLoading(true);
//         try {
//             const { data } = await axios.get('/api/user/news', {
//                 params: { q: topic },
//                 headers: {
//                     Authorization: `Bearer ${await getToken()}`
//                 }
//             });

//             if (data.success) {
//                 setCreations(data.articles);
//                 toast.success("Fetched Successfully");
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };



//     useEffect(() => {
//         fetchNews()
//     }, [])

//     return loading ? (
//         <div className='flex justify-center items-center h-3/4'>
//             <div className='animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent'></div>
//         </div>
//     ) : (
//         <div className='p-4 max-w-5xl mx-auto'>
//             <div className='flex gap-2 mb-6'>
//                 <input
//                     type='text'
//                     value={topic}
//                     onChange={(e) => setTopic(e.target.value)}
//                     placeholder='Enter a topic like AI, Technology, Health...'
//                     className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
//                 />
//                 <button
//                     onClick={() => fetchNews(topic)}
//                     className='px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition'
//                 >
//                     Get News
//                 </button>
//             </div>

//             {creations.length === 0 ? (
//                 <div className='text-center text-gray-500'>No news found. Try a different topic.</div>
//             ) : (
//                 <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
//                     {creations.map((article, index) => (
//                         <div
//                             key={index}
//                             className='bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition duration-200 flex flex-col'
//                         >
//                             {article.image && (
//                                 <img
//                                     src={article.image}
//                                     alt={article.title}
//                                     className='h-48 w-full object-cover'
//                                 />
//                             )}

//                             <div className='p-4 flex flex-col flex-grow'>
//                                 <h3 className='text-md font-semibold text-gray-800 mb-2 line-clamp-2'>{article.title}</h3>
//                                 <p className='text-sm text-gray-600 flex-grow line-clamp-3'>{article.description}</p>

//                                 <div className='flex justify-between items-center mt-4'>
//                                     <a
//                                         href={article.url}
//                                         target='_blank'
//                                         rel='noopener noreferrer'
//                                         className='text-sm text-purple-600 hover:underline font-medium flex items-center gap-1'
//                                     >
//                                         <ExternalLink className='w-4 h-4' /> Read More
//                                     </a>
//                                     <span className='text-xs text-gray-400'>{new Date(article.publishedAt).toLocaleDateString()}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }


import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { ExternalLink, X } from 'lucide-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const DailyNewsPage = () => {
    const [creations, setCreations] = useState([])
    const [loading, setLoading] = useState(true)
    const { getToken } = useAuth()
    const [topic, setTopic] = useState('')
    const [selectedArticle, setSelectedArticle] = useState(null)

    const fetchNews = async (q = '') => {
        if(q===''){
            toast.error("Enter a topic to continue");
            setLoading(false);
            return;
        }
        setLoading(true)
        try {
            const { data } = await axios.get('/api/user/news', {
                params: { q },
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })

            if (data.success) {
                setCreations(data.articles)
                toast.success("Fetched Successfully")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNews()
    }, [])

    return (
        <div className='p-4 max-w-5xl mx-auto relative'>
            {/* Search Bar */}
            <div className='flex gap-2 mb-6'>
                <input
                    type='text'
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder='Enter a topic like AI, Technology, Health...'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <button
                    onClick={() => fetchNews(topic)}
                    className='px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition'
                >
                    Get News
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className='flex justify-center items-center h-3/4'>
                    <div className='animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent'></div>
                </div>
            ) : creations.length === 0 ? (
                <div className='text-center text-gray-500'>No news found. Try a different topic.</div>
            ) : (
                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {creations.map((article, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedArticle(article)}
                            className='bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition duration-200 flex flex-col cursor-pointer'
                        >
                            {article.image && (
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className='h-48 w-full object-cover'
                                />
                            )}

                            <div className='p-4 flex flex-col flex-grow'>
                                <h3 className='text-md font-semibold text-gray-800 mb-2 line-clamp-2'>{article.title}</h3>
                                <p className='text-sm text-gray-600 flex-grow line-clamp-3'>{article.description}</p>

                                <div className='flex justify-between items-center mt-4'>
                                    <a
                                        href={article.url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm text-purple-600 hover:underline font-medium flex items-center gap-1'
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink className='w-4 h-4' /> Read More
                                    </a>
                                    <span className='text-xs text-gray-400'>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedArticle && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4'
                    onClick={() => setSelectedArticle(null)}
                >
                    <div
                        className='bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedArticle(null)}
                            className='absolute top-4 right-4 text-gray-600 hover:text-gray-900'
                        >
                            <X className='w-5 h-5' />
                        </button>

                        {selectedArticle.image && (
                            <img
                                src={selectedArticle.image}
                                alt={selectedArticle.title}
                                className='w-full h-64 object-cover rounded-lg mb-4'
                            />
                        )}

                        <h2 className='text-xl font-bold text-gray-800 mb-2'>{selectedArticle.title}</h2>
                        <p className='text-sm text-gray-600 mb-4'>{selectedArticle.description}</p>
                        <div className='flex justify-between items-center'>
                            <a
                                href={selectedArticle.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-sm text-purple-600 hover:underline font-medium flex items-center gap-1'
                            >
                                <ExternalLink className='w-4 h-4' /> Read Full Article
                            </a>
                            <span className='text-xs text-gray-400'>{new Date(selectedArticle.publishedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}