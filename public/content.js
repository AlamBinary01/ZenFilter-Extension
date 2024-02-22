import { NsfwSpy } from './nsfw.ts';

(async () => {
  // Initialize NsfwSpy with the path to the model hosted on your server or bundled with your extension
  const nsfwSpy = new NsfwSpy(chrome.runtime.getURL('./models/model.json'));
  console.log('Model URL:', chrome.runtime.getURL('./models/model.json'));

  // Load the model
  await nsfwSpy.load();

  // Select all images on the page
  const images = document.getElementsByTagName('img');

  for (let img of images) {
    // Use the image source URL for classification
    const imageUrl = img.src || img.getAttribute('data-src'); // Handling lazy-loaded images
    if (imageUrl) {
      try {
        // Adjusted to use classifyImageUrl for CORS compliance
        const result = await nsfwSpy.classifyImageUrl(imageUrl);
        // Apply a blur filter to images classified as explicit
        if (result.predictedLabel === 'pornography' || result.predictedLabel === 'sexy' || result.predictedLabel === 'hentai') {
          img.style.filter = 'blur(10px)';
        }
      } catch (error) {
        console.error('Error classifying image:', error);
      }
    }
  }
})();
