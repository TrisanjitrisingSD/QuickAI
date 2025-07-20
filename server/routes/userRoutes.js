import express from 'express'
import { auth } from '../middlewares/auth.js'
import { deleteItem, deletepic, getNews, getPublishedCreations, getUserCreations, toggleLikeCreation } from '../controllers/userController.js'

const userRouter=express.Router()


userRouter.get('/get-user-creations',auth,getUserCreations);
userRouter.get('/get-published-creations',auth,getPublishedCreations);
userRouter.post('/toggle-like-creation',auth,toggleLikeCreation);
userRouter.get('/news',auth,getNews);
userRouter.post('/delete',auth,deletepic);
userRouter.post('/delc',auth,deleteItem)

export default userRouter;