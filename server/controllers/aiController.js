import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";
import OpenAI from "openai";
import dotenv from 'dotenv'
import axios from 'axios'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'


dotenv.config();


const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;


        const plan = req.plan;
        const free_usage = req.free_usage;


        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }


        const response = await AI.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },

            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content

        await sql` INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content},'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }


        res.json({ success: true, content })

    } catch (error) {
        console.log(error.message);
        if (error.response?.status === 429) {
            return res.status(429).json({ message: "AI quota limit reached for today." });
        }

        res.json({ success: false, message: error.message })
    }
}



export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;


        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }


        const response = await AI.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },

            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content

        await sql` INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content},'blog-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }


        res.json({ success: true, content })

    } catch (error) {
        console.log(error.message);
        if (error.response?.status === 429) {
            return res.status(429).json({ message: "AI quota limit reached for today." });
        }

        res.json({ success: false, message: error.message })
    }
}



export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;


        if (plan !== 'premium') {
            return res.json({ success: false, message: "Only Available for premium customers." })
        }




        const formData = new FormData();
        formData.append('prompt', prompt)


        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: "arraybuffer",
        })



        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;


        const { secure_url } = await cloudinary.uploader.upload(base64Image);




        await sql` INSERT INTO creations (user_id,prompt,content,type,publish) VALUES (${userId},${prompt},${secure_url},'image',${publish ?? false})`;



        res.json({ success: true, content: secure_url })

    } catch (error) {
        console.log(error.message);
        if (error.response?.status === 429) {
            return res.status(429).json({ message: "AI quota limit reached for today." });
        }

        res.json({ success: false, message: error.message })
    }
}


export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const plan = req.plan;
        const image = req.file


        if (plan !== 'premium') {
            return res.json({ success: false, message: "Only Available for premium customers." })
        }



        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        });




        await sql` INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},'remove background from image',${secure_url},'image')`;



        res.json({ success: true, content: secure_url })

    } catch (error) {
        console.log(error.message);
        if (error.response?.status === 429) {
            return res.status(429).json({ message: "AI quota limit reached for today." });
        }

        res.json({ success: false, message: error.message })
    }
}


export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const plan = req.plan;
        const image = req.file
        const { object } = req.body;


        if (plan !== 'premium') {
            return res.json({ success: false, message: "Only Available for premium customers." })
        }



        const { public_id } = await cloudinary.uploader.upload(image.path);


        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        })


        await sql` INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${`Removed ${object} from image`},${imageUrl},'image')`;



        res.json({ success: true, content: imageUrl })

    } catch (error) {
        console.log(error.message);
        if (error.response?.status === 429) {
            return res.status(429).json({ message: "AI quota limit reached for today." });
        }

        res.json({ success: false, message: error.message })
    }
}


export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const plan = req.plan;
        const resume = req.file


        if (plan !== 'premium') {
            return res.json({ success: false, message: "Only Available for premium customers." })
        }


        if (resume.size > 5 * 1024 * 1024) {
            return res.json({ success: false, message: "Resume file size exceeds allowed size(5 MB)." })
        }


        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdf(dataBuffer);


        const prompt = `Review The following resume and provide constructive feedback on its strengths,weaknesses and areas for improvement.Resume Content:\n\n${pdfData.text} `



        const response = await AI.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },

            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content





        await sql` INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},'Review the uploaded resume',${content},'resume-review')`;



        res.json({ success: true, content})

    } catch (error) {
        console.log(error.message);
        if (error.response?.status === 429) {
            return res.status(429).json({ message: "AI quota limit reached for today." });
        }

        res.json({ success: false, message: error.message })
    }
}






export const chata = async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        message: userMessage,
        chat_history: [], // required by Cohere
        model: 'command-r-plus', // 'command-r' or 'command-r-plus'
        temperature: 0.5,
        stream: false
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.text || response.data.reply;
    return res.status(200).json({ reply: botReply });
  } catch (err) {
    console.error('Cohere error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Something went wrong with AI.' });
  }
};