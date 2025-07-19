import sql from '../configs/db.js'


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
