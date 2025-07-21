import express from 'express'
import {auth} from '../middlewares/auth.js'
import {chata, generateArticle, generateBlogTitle, generateImage, getSingleChat, getUserChats, removeImageBackground, removeImageObject, resumeReview, saveMessages} from '../controllers/aiController.js'
import { upload } from '../configs/multer.js';

const aiRouter=express.Router()


aiRouter.post('/generate-article',auth,generateArticle);
aiRouter.post('/generate-blog-title',auth,generateBlogTitle);
aiRouter.post('/generate-image',auth,generateImage);


aiRouter.post('/remove-image-background',upload.single('image'),auth,removeImageBackground);
aiRouter.post('/remove-image-object',upload.single('image'),auth,removeImageObject);
aiRouter.post('/resume-review',upload.single('resume'),auth,resumeReview);
aiRouter.post('/chat',auth,chata)
aiRouter.post('/save',auth,saveMessages);
aiRouter.get('/chats', auth, getUserChats);
aiRouter.get('/chatt/:id', auth, getSingleChat);


export default aiRouter;