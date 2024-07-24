const { ipcRenderer } = require('electron');
const path = require('path');

const downloadImage = async (url, filepath) => {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  await ipcRenderer.invoke('write-file', filepath, buffer.toString('base64'));
  console.log(`Downloaded ${filepath}`);
};

const arrangeImages = (container) => {
  const images = container.querySelectorAll('img');
  const containerWidth = container.clientWidth;
  const imageSize = images[0].clientWidth;
  const columns = Math.floor(containerWidth / imageSize);

  images.forEach((img, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    img.style.position = 'absolute';
    img.style.left = `${col * imageSize}px`;
    img.style.top = `${row * imageSize}px`;
  });
};

const displayImages = async (query) => {
  const images = await fetchImages(query);
  const container = document.getElementById('canvas-container');
  container.innerHTML = ''; // Clear previous images

  if (images && images.length > 0) {
    images.slice(0, 10).forEach(image => {
      const img = document.createElement('img');
      img.src = image.link;
      img.classList.add('draggable');
      container.appendChild(img);
      makeElementDraggable(img);
    });
    arrangeImages(container);
    addClickEventToImages();
  } else {
    container.innerHTML = '<p>No images found.</p>';
  }
};

const showImagesFromDirectory = async () => {
  const directoryPath = path.join(__dirname, 'images');
  const container = document.getElementById('canvas-container');
  container.innerHTML = ''; // Clear previous images

  let settings = {};
  if (await ipcRenderer.invoke('exists', settingsFilePath)) {
    settings = JSON.parse(await ipcRenderer.invoke('read-file', settingsFilePath));
  }

  const files = await ipcRenderer.invoke('readdir', directoryPath);

  files.forEach(file => {
    const img = document.createElement('img');
    img.src = path.join('images', file); // 相対パスを使用
    img.classList.add('draggable');
    img.style.maxWidth = settings.imageSize ? `${settings.imageSize}%` : '25%'; // スライダーの値を設定
    container.appendChild(img);
    makeElementDraggable(img);

    // 位置を復元
    if (settings.positions && settings.positions[file]) {
      img.style.left = settings.positions[file].left;
      img.style.top = settings.positions[file].top;
    }
  });

  // スライダーの値を復元
  if (settings.imageSize) {
    document.getElementById('size-slider').value = settings.imageSize;
  }

  arrangeImages(container);
  addClickEventToImages();
};

// 画像がクリックされたときに選択状態をトグルする関数
const toggleSelectImage = (img) => {
  if (selectedImage) {
    selectedImage.classList.remove('selected');
  }
  if (selectedImage !== img) {
    selectedImage = img;
    selectedImage.classList.add('selected');
  } else {
    selectedImage = null;
  }
};

// 画像をクリックしたときに選択状態をトグルするイベントリスナーを追加する関数
const addClickEventToImages = () => {
  const images = document.querySelectorAll('.draggable');
  images.forEach(img => {
    img.addEventListener('mousedown', (event) => {
      event.preventDefault();
      let isDragging = false;

      const onMouseMove = () => {
        isDragging = true;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (!isDragging) {
          toggleSelectImage(img);
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
};

const saveImagePositions = async (imageSize) => {
  const images = document.querySelectorAll('.draggable');
  const positions = {};

  const container = document.getElementById('canvas-container');
  const containerRect = container.getBoundingClientRect();

  images.forEach(img => {
    const filename = path.basename(img.src);
    const left = (parseFloat(img.style.left) / containerRect.width) * 100;
    const top = (parseFloat(img.style.top) / containerRect.height) * 100;
    positions[filename] = {
      left,
      top,
    };
  });

  const settings = {
    positions,
    imageSize,
  };

  await ipcRenderer.invoke('write-file', settingsFilePath, JSON.stringify(settings, null, 2));
  console.log('Image positions and settings saved.');
};

const loadImagePositions = () => {
  showImagesFromDirectory();
};

// 選択された画像のパスを取得する関数
const getSelectedImagePath = () => {
  if (selectedImage) {
    return selectedImage.src;
  }
  return null;
};

module.exports = {
  downloadImage,
  arrangeImages,
  displayImages,
  showImagesFromDirectory,
  saveImagePositions,
  loadImagePositions,
  getSelectedImagePath,
  toggleSelectImage,
  addClickEventToImages,
};
