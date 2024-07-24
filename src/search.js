// search.js
import fetch from 'node-fetch';
import { GOOGLE_API_KEY, SEARCH_ENGINE_ID } from '../config.js';

export const fetchImages = async (query) => {
  console.log(`Fetching images for query: ${query} from Google Custom Search API...`);
  const URL = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${SEARCH_ENGINE_ID}&searchType=image&key=${GOOGLE_API_KEY}`;
  console.log('Request URL:', URL);
  try {
    const response = await fetch(URL);
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data.items;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}
