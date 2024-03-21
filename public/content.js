import { NsfwSpy } from './nsfw.ts';

const nsfwSpy = new NsfwSpy(chrome.runtime.getURL('./models/model.json'));

async function classifyAndProcessImages() {
    await nsfwSpy.load();

    const images = document.querySelectorAll('img:not(.processed)');
    images.forEach(img => {
        img.classList.add('processed');
        classifyImage(img);
    });
}

async function classifyImage(img) {
    const imageUrl = img.src || img.dataset.src;
    if (!imageUrl) return;

    try {
        const result = await nsfwSpy.classifyImageUrl(imageUrl);
        if (!['pornography', 'sexy', 'hentai'].includes(result.predictedLabel)) {
            classifyViolenceInImage(img);
        } else {
            img.style.filter = 'blur(10px)';
        }
    } catch (error) {
        console.error('Error classifying image:', error);
    }
}

async function classifyViolenceInImage(imgElement) {
    const imageUrl = imgElement.src || imgElement.getAttribute('data-src');
    const response = await fetch('http://localhost:5000/fetchImage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) throw new Error('Failed to fetch image through proxy');

    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob);

    try {
        const result = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData });
        const prediction = await result.json();
        if (['fight on a street', 'fire on a street', 'street violence', 'car crash', 'violence in office', 'fire in office'].includes(prediction.label)) {
            imgElement.style.filter = 'blur(10px)';
        } else {
            imgElement.style.filter = '';
        }
    } catch (error) {
        console.error('Error classifying image for violence:', error);
    }
}

async function monitorVideos() {
    document.querySelectorAll('video:not(.processed)').forEach(video => {
        video.classList.add('processed');
        processVideoFrames(video);
    });
}

async function processVideoFrames(video) {
    // Mark the video as processed to avoid setting multiple intervals
    video.classList.add('processed');

    const intervalId = setInterval(async () => {
        if (video.paused || video.ended) {
            clearInterval(intervalId); // Stop the interval if the video is not playing
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        console.log('Video frame captured');

        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const formData = new FormData();
        formData.append('file', blob);

        try {
            const explicitResult = await nsfwSpy.classifyImage(canvas);
            const violenceResult = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData });
            const prediction = await violenceResult.json();

            if (['pornography', 'sexy', 'hentai'].includes(explicitResult.predictedLabel) || ['fight on a street', 'fire on a street', 'street violence', 'car crash', 'violence in office', 'fire in office'].includes(prediction.label)) {
                alert("You're watching sensitive content");
                redirectToDashboard();
                clearInterval(intervalId); // Stop checking this video
                return;
            }
        } catch (error) {
            console.error('Error processing video frame:', error);
        }
    }, 1000); // Check every 1 second
}

function redirectToDashboard() {
    chrome.runtime.sendMessage({action: "redirect", url: "./dashboard.html"});
}

function init() {
    classifyAndProcessImages();
    monitorVideos();
}

const observer = new MutationObserver(() => {
    init();
});

observer.observe(document.body, { childList: true, subtree: true });

init();
