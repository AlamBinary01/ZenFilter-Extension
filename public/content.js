import { NsfwSpy } from './nsfw.ts';

const nsfwSpy = new NsfwSpy(chrome.runtime.getURL('./models/model.json'));

async function classifyAndProcessImages() {
  // Ensure the model is loaded
  await nsfwSpy.load();

  // Get all images that haven't been processed yet
  const images = Array.from(document.getElementsByTagName('img'));
  const unprocessedImages = images.filter(img => !img.classList.contains('processed'));

  // Immediately blur all unprocessed images
  unprocessedImages.forEach(img => {
    img.style.filter = 'blur(10px)'; // Apply blur
    img.classList.add('processed'); // Mark as processed to avoid re-blurring
  });

  // Asynchronously classify and potentially unblur images
  unprocessedImages.forEach(async (img) => {
    const imageUrl = img.src || img.getAttribute('data-src');
    if (imageUrl) {
      try {
        const result = await nsfwSpy.classifyImageUrl(imageUrl);
        // If the image is classified as safe, remove the blur
        if (result.predictedLabel !== 'pornography' && result.predictedLabel !== 'sexy' && result.predictedLabel !== 'hentai') {
          img.style.filter = ''; // Remove blur
        }
      } catch (error) {
        console.error('Error classifying image:', error);
        // Optionally, decide whether to unblur on error based on your use case
      }
    }
  });
}

async function processVideoFrames() {
  const videos = document.querySelectorAll('video:not(.processed)');
  videos.forEach(video => {
    video.classList.add('processed'); // Mark the video as processed to avoid setting multiple intervals on the same video
    let explicitContentCount = 0; // Reset count for each video

    const intervalId = setInterval(async () => {
      if (video.paused || video.ended) {
        clearInterval(intervalId); // Stop the interval if the video is not playing
        explicitContentCount = 0; // Reset count if video ends or is paused
        return;
      }

      const frame = captureFrame(video);
      const classificationResult = await nsfwSpy.classifyImage(frame);
      
      // Handle classification result
      const explicitContentDetected = ['pornography', 'hentai', 'sexy'].includes(classificationResult.predictedLabel);
      if (explicitContentDetected) {
        explicitContentCount++;
        
        // Display an alert and log to the console if explicit content is detected
        if(explicitContentCount === 1){ // Alert once when the first explicit frame is detected
            alert("You are watching explicit content");
            console.log("Explicit frame detected");
        }
      } else {
        explicitContentCount = Math.max(0, explicitContentCount - 1); // Optionally decrease count on consecutive non-explicit frames
      }

      // Redirect if explicit content detected more than 3 times
      if (explicitContentCount >= 3) {
        clearInterval(intervalId); // Stop checking this video
        redirectToDashboard(); // Implement this function to handle redirection
      }
    }, 3000); // Check every 3 seconds
  });
}



function captureFrame(video) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

const videoClassificationCounts = new Map();

function handleVideoClassificationResult(result, video) {
  const explicitContentDetected = ['pornography', 'hentai', 'sexy'].includes(result.predictedLabel);
  const count = videoClassificationCounts.get(video) || 0;
  
  if (explicitContentDetected) {
    if (count >= 2) { // If this is the third (or more) detection
      chrome.tabs.update(tabId, {url: "./dashboard.html"});
    }
    videoClassificationCounts.set(video, count + 1);
  }
}

function redirectToDashboard() {
  // Redirect after sending the request
  chrome.runtime.sendMessage({action: "redirect", url: "./dashboard.html"});
}

 
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      classifyAndProcessImages();
      processVideoFrames();
    }
  });
});

// Start observing the document body for added nodes
observer.observe(document.body, { childList: true, subtree: true });

// Initial classification
classifyAndProcessImages();
processVideoFrames(); // Newly added function for videos

