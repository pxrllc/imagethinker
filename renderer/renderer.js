const fetch = require('node-fetch');

const API_KEY = '16b2bb0a8d10068dab4569a560453f0ef4964972';
const QUERY = 'tokyo';
const URL = `https://api.pinterest.com/v5/search/pins/?query=${QUERY}&access_token=${API_KEY}`;

async function fetchImages() {
  const response = await fetch(URL);
  const data = await response.json();
  return data.data;
}

async function displayImages() {
  const images = await fetchImages();
  const container = document.getElementById('canvas-container');
  
  images.slice(0, 10).forEach(image => {
    const img = document.createElement('img');
    img.src = image.images.original.url;
    container.appendChild(img);
  });
}

window.onload = displayImages;
