import { NsfwSpy } from './nsfw.ts';

const nsfwSpy = new NsfwSpy(chrome.runtime.getURL('./models/model.json'));

async function init() {
    try {
        await nsfwSpy.load();
        continuouslyProcessContent();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

function continuouslyProcessContent() {
    processCurrentContent();
    setupContinuousMonitoring();
}

function processCurrentContent() {
    document.querySelectorAll('img:not(.processed), video:not(.processed)').forEach(node => {
        if (node.tagName === 'IMG') {
            classifyImage(node).catch(console.error);
        } else if (node.tagName === 'VIDEO') {
            processVideoFrames(node).catch(console.error);
        }
    });
}

function setupContinuousMonitoring() {
    let lastProcessedContentTime = Date.now();

    const observer = new MutationObserver(() => {
        // Throttle DOM mutations handling to avoid overloading
        const now = Date.now();
        if (now - lastProcessedContentTime > 3000) { // Check if at least 3 seconds have passed
            processCurrentContent();
            lastProcessedContentTime = now;
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Additionally, set up a fallback interval to catch any missed content
    setInterval(() => {
        processCurrentContent();
    }, 5000);
}

async function classifyImage(img) {
    img.classList.add('processed');
    const imageUrl = img.src || img.dataset.src;
    if (!imageUrl) return;

    try {
        const explicitResultPromise = nsfwSpy.classifyImageUrl(imageUrl);
        const violenceResultPromise = fetchViolenceClassification(imageUrl);
        const [explicitResult, violenceResult] = await Promise.all([explicitResultPromise, violenceResultPromise]);

        if (shouldBlur(explicitResult, violenceResult)) {
            applyBlur(img);
        }
    } catch (error) {
        console.error('Error classifying image:', error);
    }
}

async function fetchViolenceClassification(imageUrl) {
    const response = await fetch('http://localhost:5000/fetchImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
    });
    if (!response.ok) throw new Error('Failed to fetch image through proxy');
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob);
    const result = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData });
    return result.json();
}

function shouldBlur(explicitResult, violenceResult) {
    return ['pornography', 'sexy', 'hentai'].includes(explicitResult.predictedLabel) ||
           ['fight on a street', 'fire on a street', 'street violence', 'car crash', 'violence in office', 'fire in office'].includes(violenceResult.label);
}

function applyBlur(img) {
    img.style.filter = 'blur(10px)';
}

async function monitorVideos() {
    document.querySelectorAll('video:not(.processed)').forEach(video => {
        video.classList.add('processed');
        processVideoFrames(video);
    });
}

let detectionSteps = 0; // Tracks the steps of detection: notification, blur, redirect

async function processVideoFrames(video) {
    let intervalId;
    video.classList.add('processed');
    let detectionSteps = 0; // Tracks the steps of detection: notification, blur, redirect

    const processFrame = throttle(async () => {
        if (video.readyState < 2) {
            console.log("Video metadata not loaded yet.");
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        console.log("Video Frame Captured");

        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const formData = new FormData();
        formData.append('file', blob);

        try {
            const explicitResult = await nsfwSpy.classifyImage(canvas);
            const violenceResult = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData }).then(response => response.json());

            if (['pornography', 'sexy', 'hentai'].includes(explicitResult.predictedLabel) ||
                ['fight on a street', 'fire on a street', 'street violence', 'car crash', 'violence in office', 'fire in office'].includes(violenceResult.label)) {

                detectionSteps += 1;
                
                if (detectionSteps === 1) {
                    showNotification("You're watching sensitive content");
                } else if (detectionSteps === 2) {
                    video.style.filter = 'blur(10px)';
                } else if (detectionSteps >= 3) {
                    redirectToDashboard();
                    clearInterval(intervalId); // Stop processing frames
                    return;
                }
            }
        } catch (error) {
            console.error('Error processing video frame:', error);
        }
    }, 1000);

    // Immediate frame processing and setting up interval for continuous processing
    if (video.readyState >= 2) {
        processFrame();
    } else {
        video.addEventListener('loadedmetadata', processFrame, { once: true });
    }

    video.addEventListener('play', () => {
        if (intervalId) clearInterval(intervalId); // Clear any existing interval
        intervalId = setInterval(processFrame, 1000);
    });

    video.addEventListener('pause', () => clearInterval(intervalId), { once: true });
    video.addEventListener('ended', () => clearInterval(intervalId), { once: true });
}

async function redirectToDashboard() {
    const currentUrl = window.location.origin;

    // Use a Promise to wait for the email value
    const email = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["userEmail"], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(result.userEmail);
            }
        });
    });

    // Now get the token the same way, for consistency and to handle possible errors
    const token = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["token"], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(result.token);
            }
        });
    });

    // Proceed if token is available
    if (token) {
        try {
            const response = await fetch("http://localhost:5000/addBlockedUrl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ email, url: currentUrl }),
            });

            // Handle response...
            // For example, check if response was successful and then redirect
            if (response.ok) {
                // Assuming you want to redirect on successful addition
                window.location.href = "https://zenfilter.netlify.app";
            } else {
                console.error('Failed to add blocked site: ', await response.text());
            }
        } catch (error) {
            console.error('Failed to add blocked site:', error);
        }
    } else {
        console.log("Token not found in storage.");
    }
}

  

function showNotification(message) {
    // Check if a notification already exists, if so, remove it
    const existingNotification = document.getElementById('customNotification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create the notification element
    const notification = document.createElement('div');
    notification.id = 'customNotification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'black';
    notification.style.color = 'red';
    notification.style.padding = '20px 40px';
    notification.style.borderRadius = '20px';
    notification.style.zIndex = '10000';
    notification.style.fontSize = '24px';
    notification.style.fontWeight = 'bold';
    notification.style.fontFamily = 'Montserrat, sans-serif';
    notification.style.textAlign = 'center';
    notification.style.maxWidth = '80%';
    notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';

    // Append the notification to the body
    document.body.appendChild(notification);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}


function throttle(callback, limit) {
    let waiting = false;
    return function () {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
}

init();

// const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         mutation.addedNodes.forEach(node => {
//             if (node.nodeName === 'IMG' && !node.classList.contains('processed')) {
//                 classifyImage(node);
//             } else if (node.nodeName === 'VIDEO' && !node.classList.contains('processed')) {
//                 processVideoFrames(node);
//             }
//         });
//     });
// });

// observer.observe(document.body, {
//     childList: true,
//     subtree: true,
// });
