import axios from 'axios';

const PASTEBIN_API_KEY = 'your_pastebin_api_key'; // Replace with your API key
const PASTEBIN_API_URL = 'https://pastebin.com/api/api_post.php';

const saveToPastebin = async (content, title) => {
  const params = new URLSearchParams();
  params.append('api_dev_key', PASTEBIN_API_KEY);
  params.append('api_option', 'paste');
  params.append('api_paste_code', content);
  params.append('api_paste_name', title);
  params.append('api_paste_private', 1); // 1 = unlisted
  params.append('api_paste_expire_date', '10M'); // 10 minutes, adjust as needed

  try {
    const response = await axios.post(PASTEBIN_API_URL, params);
    return response.data; // Returns the URL of the Pastebin paste
  } catch (error) {
    console.error('Error saving to Pastebin:', error);
    throw error;
  }
};
