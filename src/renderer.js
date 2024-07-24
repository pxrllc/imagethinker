const { ipcRenderer } = require('electron');
const path = require('path');
const { downloadImage, arrangeImages, displayImages, showImagesFromDirectory, saveImagePositions, loadImagePositions, getSelectedImagePath, toggleSelectImage, addClickEventToImages } = require('./functions.js'); // パスを再確認

const settingsFilePath = path.join(__dirname, 'settings.json');
let selectedImage = null;

window.onload = () => {
  console.log('App is loaded. Waiting for user input...');

  const searchButton = document.getElementById('search-button');
  const searchQueryInput = document.getElementById('search-query');
  const showImagesLink = document.getElementById('show-images-link');
  const sizeSlider = document.getElementById('size-slider');
  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');
  const clearButton = document.getElementById('clear-button');
  const analyzeButton = document.getElementById('analyze-button');
  const textOutput = document.getElementById('text-output');

  searchButton.addEventListener('click', () => {
    const query = searchQueryInput.value;
    if (query) {
      displayImages(query);
    }
  });

  showImagesLink.addEventListener('click', () => {
    showImagesFromDirectory();
  });

  sizeSlider.addEventListener('input', () => {
    const images = document.querySelectorAll('.draggable');
    const newSize = sizeSlider.value;
    images.forEach(img => {
      img.style.maxWidth = `${newSize}%`;
    });
  });

  saveButton.addEventListener('click', () => {
    saveImagePositions(sizeSlider.value);
  });

  loadButton.addEventListener('click', () => {
    loadImagePositions();
  });

  clearButton.addEventListener('click', () => {
    const container = document.getElementById('canvas-container');
    container.innerHTML = ''; // Clear all images
    selectedImage = null; // Clear selected image
  });

  analyzeButton.addEventListener('click', async () => {
    const selectedImagePath = getSelectedImagePath();
    if (!selectedImagePath) {
      textOutput.textContent = 'Please select an image file first.';
      return;
    }

    try {
      const text = await analyzeImage(selectedImagePath);
      textOutput.textContent = text;
    } catch (error) {
      console.error('Error analyzing image:', error);
      textOutput.textContent = `Error analyzing image: ${error.message}`;
    }
  });
};
