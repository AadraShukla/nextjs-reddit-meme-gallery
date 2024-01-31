import axios from 'axios';
import * as oauth from 'oauth';

const oauth2 = new oauth.OAuth2(
 process.env.JEYiCqBee5kcJ5JZWWNOyA, // obtained from Reddit's app settings
 process.env.F48mbkQFpbrAUQujEObgKSMdzwslDQ, // obtained from Reddit's app settings
 'https://www.reddit.com/', // base URL
 null, // authorization path
 'https://www.reddit.com/api/v1/access_token' // token path
);

export default async function handler(req, res) {
 try {
    const { page } = req.query;
    const token = await oauth2.getOAuthAccessToken();
    const response = await oauth2.get(`https://www.reddit.com/r/memes.json?after=${page}`, token, {}, {'User-Agent': 'nextjs-react-meme-gallery'});
    res.status(200).json(JSON.parse(response));
 } catch (error) {
    console.error('Error fetching memes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
 }
}
