// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { page } = req.query;
    const response = await axios.get(`https://www.reddit.com/r/memes.json?after=${page}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching memes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
