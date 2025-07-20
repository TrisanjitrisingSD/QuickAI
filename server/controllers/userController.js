import sql from '../configs/db.js'
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getUserCreations = async (req, res) => {
    try {

        const { userId } = req.auth()


        const creations = await sql` SELECT * from creations WHERE user_id=${userId} ORDER BY created_at DESC`;


        res.json({ success: true, creations })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const getPublishedCreations = async (req, res) => {
    try {

        const creations = await sql` SELECT * from creations WHERE publish=true ORDER BY created_at DESC`;
        res.json({ success: true, creations })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const toggleLikeCreation = async (req, res) => {
    try {


        const { userId } = req.auth();
        const { id } = req.body;


        // const {creation}=await sql` SELECT * FROM creations WHERE id=${id}`
        const result = await sql`SELECT * FROM creations WHERE id=${id}`;
        const creation = result[0];



        if (!creation) {
            return res.json({ success: false, message: "Creations Not Found" })
        }


        const currentLikes = creation.likes;

        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdStr)
            message = 'Creation Unliked';
        } else {
            updatedLikes = [...currentLikes, userIdStr]
            message = "Creation Liked";
        }


        const formattedArray = `{${updatedLikes.join(',')}}`


        await sql`UPDATE creations set likes=${formattedArray}::text[] WHERE id=${id}`


        res.json({ success: true, message })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const getNews = async (req, res) => {
    const topic = req.query.q;
    const apiKey = process.env.NEWS_API_KEY;

    try {
        const url = `https://gnews.io/api/v4/search?q=${topic}&lang=en&country=in&max=15&apikey=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(400).json({ success: false, message: "Failed to fetch news" });
        }

        const result = await response.json();
        return res.json({ success: true, articles: result.articles });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




export const deletepic = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.auth();

    // Get user_id and image URL
    const result = await sql`SELECT user_id, content FROM creations WHERE id = ${id}`;
    if (!result.length) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const creatorId = result[0].user_id;
    const imageUrl = result[0].content;

    if (creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post. Delete yours.",
      });
    }

    
    const fileNameWithExt = imageUrl.split('/').pop(); // e.g. vabvrotugsbhaqmufyuz.png
    const publicId = fileNameWithExt.split('.')[0];

    console.log('Correct publicId:', publicId);

    const cloudRes = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', cloudRes);

    // ❌ Delete from DB
    await sql`DELETE FROM creations WHERE id = ${id}`;

    return res.json({ success: true, message: 'Deleted Successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};