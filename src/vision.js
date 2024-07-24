import { ImageAnnotatorClient } from '@google-cloud/vision';
import fetch from 'node-fetch';

const client = new ImageAnnotatorClient({
  keyFilename: 'path/to/your-service-account-file.json' // サービスアカウントキーのパスを指定
});

export const analyzeImage = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const imageBuffer = Buffer.from(await response.arrayBuffer()); // arrayBufferを使用
  const request = {
    image: {
      content: imageBuffer.toString('base64'),
    },
    features: [
      {
        type: 'LABEL_DETECTION',
      },
    ],
  };

  const [result] = await client.annotateImage(request);
  const labels = result.labelAnnotations;
  return labels.map(label => label.description).join(', ');
}
